import { InMemoryPoliciesRepository } from '@/repositories/in-memory/in-memory-policies-repository';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('node:fs', () => ({
  readFileSync: vi.fn(
    () => `
    <html>
      <body>
        <h1>{{policyTitle}}</h1>
        <p>{{policyDescription}}</p>
      </body>
    </html>
  `,
  ),
}));

vi.mock('@/lib/puppeteer', () => ({
  createBrowser: vi.fn(async () => ({ close: vi.fn() })),
  createPage: vi.fn(async () => ({
    setContent: vi.fn(),
    pdf: vi.fn(async () => new Uint8Array([1, 2, 3, 4])),
  })),
}));

import { ResourceNotFoundError } from '../@errors/resource-not-found-error';
import { ExportPolicyPdfUseCase } from './export-policy-pdf';

let policyRepository: InMemoryPoliciesRepository;
let sut: ExportPolicyPdfUseCase;

describe('Export Policy Pdf UseCase', () => {
  beforeEach(() => {
    policyRepository = new InMemoryPoliciesRepository();
    sut = new ExportPolicyPdfUseCase(policyRepository);
  });

  it('Deve ser possível gerar um PDF da policy', async () => {
    const policy = await policyRepository.create({
      title: 'Política de Backup',
      slug: 'politica-de-backup',
      description: 'Descrição detalhada da política de backup',
      source: 'Empresa XYZ',
      category: { name: 'Segurança da Informação', id: 1 },
      createdAt: new Date('2025-08-31'),
      text: 'Conteúdo completo da política.',
    } as any);

    const { pdfBuffer } = await sut.execute({ slug: policy.slug });

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  // ---

  it('Deve lançar ResourceNotFoundError se policy não existir', async () => {
    await expect(() =>
      sut.execute({ slug: 'NOT-EXISTING' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
