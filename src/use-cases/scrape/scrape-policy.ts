import { createBrowser, createPage } from '@/lib/puppeteer';

import { BadRequestError } from '../@errors/bad-request-error';

interface ScrapePolicyUseCaseRequest {
  url: string;
}

interface ScrapePolicyUseCaseResponse {
  text: string;
}

export class ScrapePolicyUseCase {
  constructor() {}

  async execute({
    url,
  }: ScrapePolicyUseCaseRequest): Promise<ScrapePolicyUseCaseResponse> {
    if (!url) throw new BadRequestError('URL inválida.');

    const browser = await createBrowser();
    const page = await createPage(browser);

    try {
      await page.goto(url, { waitUntil: 'networkidle0' });

      const text = await page.evaluate(() => document.body.innerText);

      return { text };
    } catch (error) {
      throw new BadRequestError('Nenhum dado retornado pela IA.');
    } finally {
      await browser.close();
    }
  }
}
