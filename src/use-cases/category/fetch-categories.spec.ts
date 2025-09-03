import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { describe, it, expect, beforeEach } from 'vitest';

import { BadRequestError } from '../@errors/bad-request-error';
import { FetchCategoriesUseCase } from './fetch-categories';

let categoriesRepository: InMemoryCategoriesRepository;
let sut: FetchCategoriesUseCase;

describe('FetchCategoriesUseCase', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new FetchCategoriesUseCase(categoriesRepository);
  });

  it('Deve ser possível retornar categorias e totalCount', async () => {
    await categoriesRepository.create({
      name: 'Categoria 1',
      slug: 'categoria-1',
    });

    await categoriesRepository.create({
      name: 'Categoria 2',
      slug: 'categoria-2',
    });

    const result = await sut.execute({ data: { page: 1 } });

    expect(result.categories).toHaveLength(2);
    expect(result.totalCount).toBe(2);
    expect(result.categories[0]).toMatchObject({ name: 'Categoria 1' });
  });

  // ---

  it('Deve ser possível aplicar paginação a categorias', async () => {
    for (let i = 1; i <= 14; i++) {
      await categoriesRepository.create({
        name: `Categoria ${i}`,
        slug: `categoria-${i}`,
      });
    }

    const result = await sut.execute({
      data: { page: 2 },
    });

    expect(result.categories).toHaveLength(2);
    expect(result.categories[0].name).toBe('Categoria 13');
    expect(result.totalCount).toBe(14);
  });

  // ---

  it('deve lançar BadRequestError se os parâmetros não forem informados', async () => {
    await expect(sut.execute({ data: null as any })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
