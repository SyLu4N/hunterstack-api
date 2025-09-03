import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { describe, it, expect, beforeEach } from 'vitest';

import { BadRequestError } from '../@errors/bad-request-error';
import { GetFirstCategoryUseCase } from './get-first-category';

let categoryRepository: InMemoryCategoriesRepository;
let sut: GetFirstCategoryUseCase;

describe('GetFirstCategoryUseCase', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoriesRepository();
    sut = new GetFirstCategoryUseCase(categoryRepository);
  });

  it('Deve ser possível retornar a primeira categoria pelo nome', async () => {
    await categoryRepository.create({
      name: 'Categoria Teste',
      slug: 'categoria-teste',
    });

    const result = await sut.execute({ categoryName: 'Teste' });

    expect(result.category).not.toBeNull();
    expect(result.category?.name).toBe('Categoria Teste');
  });

  // ---

  it('Deve retornar null se a categoria não existir', async () => {
    const result = await sut.execute({ categoryName: 'NOT-EXISTING' });

    expect(result.category).toBeNull();
  });

  // ---

  it('Deve lançar BadRequestError se o id não for informado', async () => {
    // @ts-expect-error: Testando cenário inválido
    await expect(sut.execute({ categorySlug: null })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
