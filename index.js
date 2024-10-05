import puppeteer from "puppeteer";
import minimist from "minimist";
import * as fs from 'node:fs/promises';
import path from 'path';

const log = console.log;
const argv = minimist(process.argv.slice(2));

const url = argv['url'] || 'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202';
const region = argv['region'] || 'Санкт-Петербург и область';

const retry = async (operation, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await operation();
        } catch (e) {
            log(`Attempt ${i + 1} failed: ${e.message}`);
            if (i === retries - 1) throw e;
        }
    }
}

const selectRegion = async (page, region) => {
    await page.evaluate(() => { //This button is sometimes unresponsive. This should be a more robust method to click it
        document.querySelector('.Region_region__6OUBn').click();
    });
    
    const regionList = await page.waitForSelector('.UiRegionListBase_list__cH0fK');
    const regionHandle = await regionList.$(`::-p-text(${region})`);

    return regionHandle.click();
}

const saveScreenshot = async page => {
    const screenshot = await page.screenshot({ type: 'jpeg' });
    const filePath = path.join(process.cwd(), 'screenshot.jpg');
    return fs.writeFile(filePath, screenshot);
}

const saveProduct = async page => {
    await page.waitForSelector('.PriceInfo_root__GX9Xp');
    const dPriceHandle = await page.$('.Price_role_discount__l_tpE');
    
    let priceHandle;
    let priceSubhandle;
    let dPriceSubhandle;

    if (dPriceHandle) {
        dPriceSubhandle = await dPriceHandle.$('span');

        priceHandle = await page.$('.Price_role_old__r1uT1');
    } else {
        priceHandle = await page.$('.Price_role_regular__X6X4D');
    }
    priceSubhandle = await priceHandle.$('span');

    const nameHandle = await page.waitForSelector('.Title_title__nvodu');
    const ratingHandle = await page.waitForSelector('.Summary_reviewsCountContainer___aY6I');

    const product = await page.evaluate((p, ps, dp, dps, n, r) => {
        const parseNumber = e => {
            const f = parseFloat(e);
            if (!f || isNaN(f)) return 0;
            return f;
        }

        return {
            name: n.textContent,
            price: parseNumber(p.textContent) + parseNumber(ps.textContent.slice(1)) / 100,
            discountPrice: dp ? parseNumber(dp.textContent) + parseNumber(dps.textContent.slice(1)) / 100 : null,
            reviewCount: parseNumber(r.outerText)
        }
    }, priceHandle, priceSubhandle, dPriceHandle, dPriceSubhandle, nameHandle, ratingHandle);

    const filePath = path.join(process.cwd(), 'product.txt');
    return fs.writeFile(filePath, JSON.stringify(product));
}

const lifecycle = async (page) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('#__next'); //Waiting through 'Checking your browser' screen
    await Promise.any([ //Infinite loading fix in case of connection problems
        page.waitForNetworkIdle(),
        new Promise(r => setTimeout(r, 5000))
    ]);
    log('Page loaded');
    
    await selectRegion(page, region);
    log('Region selected');

    await new Promise(r => setTimeout(r, 1500));

    await saveScreenshot(page);
    log('Screenshot saved')

    await saveProduct(page);
    log('Product info saved');
    
    return 0;
}

const start = async () => {
    const browser = await puppeteer.launch({
         headless: true, 
         defaultViewport: null, 
         args: ['--start-maximized'] 
    });
    log('Puppeteer init');
    const page = await browser.newPage();
    page.setDefaultTimeout(5000);
    
    await retry(async () => lifecycle(page));

    return browser.close();
}

start();
