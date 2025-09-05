import { createBrowser, createPage } from '@/lib/puppeteer';
import { InterfacePolicyRepository } from '@/repositories/@interface/interface-policy-repository';
import { formatDate } from '@/utils/formatDate';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';

interface ExportPolicyPdfUseCaseRequest {
  slug: string;
}

interface ExportPolicyPdfUseCaseResponse {
  pdfBuffer: Buffer;
}

export class ExportPolicyPdfUseCase {
  constructor(private policyRepository: InterfacePolicyRepository) {}

  async execute({
    slug,
  }: ExportPolicyPdfUseCaseRequest): Promise<ExportPolicyPdfUseCaseResponse> {
    const policy = await this.policyRepository.findBySlug(slug);
    if (!policy) throw new ResourceNotFoundError('Política não encontrada.');

    const templatePath = path.resolve(process.cwd(), 'template', 'policy.html');

    let html = readFileSync(templatePath, 'utf-8');

    const newDate = formatDate(policy.createdAt);
    const descriptionWithBreaks = policy.description.replace(/\n/g, '<br>');

    html = html.replace(/{{policyTitle}}/g, policy.title);
    html = html.replace(/{{policyCategory}}/g, policy.category.name);
    html = html.replace(/{{policyName}}/g, policy.title);
    html = html.replace(/{{policySource}}/g, policy.source);
    html = html.replace(/{{policyDescription}}/g, descriptionWithBreaks);
    html = html.replace(/{{policyDate}}/g, newDate);

    const browser = await createBrowser();
    const page = await createPage(browser);

    try {
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfUint8 = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      const pdfBuffer = Buffer.from(pdfUint8);

      return { pdfBuffer };
    } catch (error) {
      console.log(error);
      throw new BadRequestError('Não foi possível gerar o PDF.');
    } finally {
      await browser.close();
    }
  }
}
