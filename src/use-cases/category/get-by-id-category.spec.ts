import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { describe, it, expect, beforeEach } from 'vitest';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';
import { GetByIdCategoryUseCase } from './get-by-id-category';

let categoryRepository: InMemoryCategoriesRepository;
let sut: GetByIdCategoryUseCase;

describe('GetByIdCategoryUseCase', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoriesRepository();
    sut = new GetByIdCategoryUseCase(categoryRepository);
  });

  it('Deve ser possível retornar uma categoria pelo id', async () => {
    await categoryRepository.create({
      name: 'Categoria Teste',
      slug: 'categoria-teste',
    });

    const result = await sut.execute({ categoryId: 1 });

    expect(result.category).not.toBeNull();
    expect(result.category?.name).toBe('Categoria Teste');
  });

  // ---

  it('Deve retornar ResourceNotFoundError se a categoria não existir', async () => {
    await expect(sut.execute({ categoryId: 999 })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  // ---

  it('deve lançar BadRequestError se o id não for informado', async () => {
    // @ts-expect-error: Testando cenário inválido
    await expect(sut.execute({ categoryId: null })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
