import puppeteer from "puppeteer";
import minimist from "minimist";
import * as fs from 'node:fs/promises';
import path from 'path';

const log = console.log;
const argv = minimist(process.argv.slice(2));

const url = argv['url'] || 'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202';
const region = argv['region'] || 'Санкт-Петербург и область';

const selectRegion = async (page, region) => {
    await page.evaluate(() => {
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
    throw new Error('Not implemented');
}

const start = async () => {
    const browser = await puppeteer.launch({
         headless: true, 
         defaultViewport: null, 
         args: ['--start-maximized'] 
    });
    log('Puppeteer init');
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    page.setDefaultTimeout(5000);

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

    return browser.close();
}

start();
