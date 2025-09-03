import puppeteer, { Browser } from 'puppeteer';

export async function createBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  return browser;
}

export async function createPage(browser: Browser) {
  const page = await browser.newPage();
  return page;
}
