import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found-error';
import { beforeEach, describe, expect, it } from 'vitest';

import { DeleteCategoryUseCase } from './delete-category';

let categoriesRepository: InMemoryCategoriesRepository;
let sut: DeleteCategoryUseCase;

describe('DeleteCategoryUseCase', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new DeleteCategoryUseCase(categoriesRepository);
  });

  it('Deve ser possível deletar uma categoria existente com sucesso', async () => {
    const category = await categoriesRepository.create({
      name: 'Categoria Teste',
      slug: 'categoria-teste',
    });

    let categories = await categoriesRepository.findMany({ page: 1 });

    expect(categories.totalCount).toBe(1);

    await sut.execute({ categoryId: category.id });

    categories = await categoriesRepository.findMany({ page: 1 });

    expect(categories.totalCount).toBe(0);
  });

  // ---

  it('Deve lançar ResourceNotFoundError se a categoria não existir', async () => {
    await expect(sut.execute({ categoryId: 999 })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});
