import { describe, it, beforeEach, expect, vi } from 'vitest';

import { ScrapePolicyUseCase } from './scrape-policy';

vi.mock('@/lib/puppeteer', () => ({
  createBrowser: vi.fn(async () => ({
    close: vi.fn(),
  })),

  createPage: vi.fn(async () => ({
    goto: vi.fn(),
    evaluate: vi.fn(async () => 'Texto mockado'),
  })),
}));

let sut: ScrapePolicyUseCase;

describe('ScrapePolicyUseCase', () => {
  beforeEach(() => {
    sut = new ScrapePolicyUseCase();
  });

  it('Deve retornar texto mockado sem abrir navegador', async () => {
    const { text } = await sut.execute({ url: 'https://exemplo.com' });
    expect(text).toBe('Texto mockado');
  });
});
