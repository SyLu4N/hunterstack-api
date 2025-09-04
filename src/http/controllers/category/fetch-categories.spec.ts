import { app } from '@/app';
import { createCategoryPrismaTest } from '@/utils/test/createCategoryPrisma';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Fetch Categories (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve ser possível obter as categorias.', async () => {
    await createCategoryPrismaTest({
      data: { name: 'Categoria 1', slug: 'category-1' },
    });

    await createCategoryPrismaTest({
      data: { name: 'Categoria 2', slug: 'category-2' },
    });

    const response = await request(app.server).get(`/categories`).send();
    expect(response.statusCode).toEqual(200);

    const data = response.body;
    expect(data.totalCount).toBe(2);
    expect(data.categories).toEqual([
      expect.objectContaining({ slug: 'category-1' }),
      expect.objectContaining({ slug: 'category-2' }),
    ]);
  });
});
