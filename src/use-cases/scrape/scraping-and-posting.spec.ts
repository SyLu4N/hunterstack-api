import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { InMemoryPoliciesRepository } from '@/repositories/in-memory/in-memory-policies-repository';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { AnalizePolicyUseCase } from '../llm/analyzePolicy';
import { CreatePolicyUseCase } from '../policy/create-policy';
import { GetBySlugPolicyUseCase } from '../policy/get-by-slug-policy';
import { ScrapePolicyUseCase } from './scrape-policy';
import { SacrapingAndPostingUseCase } from './scraping-and-posting';

const mockScrapeText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum euismod, nisl sit amet consectetur congue, nunc urna aliquet nunc, sit amet tincidunt nunc nunc sit amet nunc.';

vi.mock('./scrape-policy', () => ({
  ScrapePolicyUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(async () => ({ text: mockScrapeText })),
  })),
}));

const mockAnalizeResult = {
  categories: [
    {
      id: 1,
      title: 'Política 1',
      slug: 'politica-1',
      description: 'Descrição da política 1',
      category: 'Categoria 1',
      createdAt: new Date(),
      categoryId: 1,
    },
    {
      id: 2,
      title: 'Política 2',
      slug: 'politica-2',
      description: 'Descrição da política 2',
      category: 'Categoria 2',
      createdAt: new Date(),
      categoryId: 1,
    },
  ],

  source: 'mock source',
};

vi.mock('../llm/analyzePolicy', () => ({
  AnalizePolicyUseCase: vi.fn().mockImplementation(() => ({
    execute: vi.fn(async () => ({
      data: mockAnalizeResult,
    })),
  })),
}));

let policiesRepository: InMemoryPoliciesRepository;
let categoriesRepository: InMemoryCategoriesRepository;

let getBySlugPolicyUseCase: GetBySlugPolicyUseCase;
let scrapingPolicyUseCase: ScrapePolicyUseCase;
let analizePolicyUseCase: AnalizePolicyUseCase;
let createPolicyUseCase: CreatePolicyUseCase;
let sut: SacrapingAndPostingUseCase;

describe('SacrapingAndPostingUseCase', () => {
  beforeEach(() => {
    policiesRepository = new InMemoryPoliciesRepository();
    categoriesRepository = new InMemoryCategoriesRepository();

    getBySlugPolicyUseCase = new GetBySlugPolicyUseCase(policiesRepository);

    createPolicyUseCase = new CreatePolicyUseCase(
      policiesRepository,
      categoriesRepository,
    );

    scrapingPolicyUseCase = new ScrapePolicyUseCase();
    analizePolicyUseCase = new AnalizePolicyUseCase();

    sut = new SacrapingAndPostingUseCase(
      createPolicyUseCase,
      scrapingPolicyUseCase,
      analizePolicyUseCase,
      getBySlugPolicyUseCase,
    );
  });

  it('Deve realizar scraping, análise e postagem usando mocks', async () => {
    const response = await sut.execute({ url: 'https://exemplo.com' });

    expect(response.policies.length).toBe(2);
    expect(response.policies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          slug: expect.any(String),
          title: expect.any(String),
          description: expect.any(String),
          source: expect.any(String),
          createdAt: expect.any(Date),
          categoryId: expect.any(Number),
        }),
      ]),
    );
  });
});
