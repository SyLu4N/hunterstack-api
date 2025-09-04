import chromium from '@sparticuz/chromium';
import puppeteer, { Browser } from 'puppeteer-core';

export async function createBrowser() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  return browser;
}

export async function createPage(browser: Browser) {
  const page = await browser.newPage();
  return page;
}
