import puppeteer from "puppeteer";
import minimist from "minimist";

const log = console.log;
const argv = minimist(process.argv.slice(2));

const url = argv['url'] || 'https://vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202';
const region = argv['region'] || 'Санкт-Петербург и область';
const regionSelector = argv['regS'] || 'Region_region__6OUBn';
const screenshotWidth = 1080;
const screenshotHeight = 1024;

const selectRegion = async (page, region) => {
    throw new Error('Not implemented');
}

const saveScreenshot = async page => {
    throw new Error('Not implemented');
}

const saveProduct = async page => {
    throw new Error('Not implemented');
}

const start = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    await selectRegion(page, region);
    await saveScreenshot(page);
    await saveProduct(page);

    return browser.close();
}

start();
