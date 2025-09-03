import { describe, it, beforeEach, expect, vi } from 'vitest';

import { ScrapePolicyUseCase } from '../scrape/scrape-policy';
import { AnalizePolicyUseCase } from './analyzePolicy';

const mockScrapeText = 'Texto de política mockado';
vi.mock('../scrape/scrape-policy', () => ({
  ScrapePolicyUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(async () => ({ text: mockScrapeText })),
  })),
}));

let scrapePolicyUseCase: ScrapePolicyUseCase;
let sut: AnalizePolicyUseCase;

const mockAnalizeData = {
  categories: [
    {
      title: 'Política de Segurança',
      category: 'Segurança',
      description: 'Descrição da política',
      summary: 'Resumo da política',
    },
    {
      title: 'Política de Privacidade',
      category: 'Privacidade',
      description: 'Descrição da política',
      summary: 'Resumo da política',
    },
    {
      title: 'Política de Compliance',
      category: 'Compliance',
      description: 'Descrição da política',
      summary: 'Resumo da política',
    },
  ],
  source: 'mocked source',
};

vi.mock('./analyzePolicy', () => ({
  AnalizePolicyUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(async () => ({ data: mockAnalizeData })),
  })),
}));

describe('AnalizePolicyUseCase', () => {
  beforeEach(() => {
    scrapePolicyUseCase = new ScrapePolicyUseCase();
    sut = new AnalizePolicyUseCase();
  });

  it('Deve analisar e categorizar uma política usando mocks', async () => {
    const { text } = await scrapePolicyUseCase.execute({
      url: 'https://exemplo.com',
    });
    const { data } = await sut.execute({ text });

    expect(data.categories.length).toBeGreaterThan(2);
    expect(data.source.length).toBeGreaterThan(3);

    expect(data).toEqual(
      expect.objectContaining({
        categories: expect.arrayContaining([
          expect.objectContaining({
            title: expect.any(String),
            category: expect.any(String),
            description: expect.any(String),
            summary: expect.any(String),
          }),
        ]),
        source: expect.any(String),
      }),
    );
  });
});
