import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { describe, it, expect, beforeEach } from 'vitest';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';
import { GetBySlugCategoryUseCase } from './get-by-slug-category';

let categoryRepository: InMemoryCategoriesRepository;
let sut: GetBySlugCategoryUseCase;

describe('GetBySlugCategoryUseCase', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoriesRepository();
    sut = new GetBySlugCategoryUseCase(categoryRepository);
  });

  it('Deve ser possível retornar uma categoria pelo slug', async () => {
    await categoryRepository.create({
      name: 'Categoria Teste',
      slug: 'categoria-teste',
    });

    const result = await sut.execute({ categorySlug: 'categoria-teste' });

    expect(result.category).not.toBeNull();
    expect(result.category?.name).toBe('Categoria Teste');
  });

  // ---

  it('Deve retornar ResourceNotFoundError se a categoria não existir', async () => {
    await expect(
      sut.execute({ categorySlug: 'NOT-EXISTING' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  // ---

  it('Deve lançar BadRequestError se o id não for informado', async () => {
    // @ts-expect-error: Testando cenário inválido
    await expect(sut.execute({ categorySlug: null })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
