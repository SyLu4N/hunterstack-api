import { app } from '@/app';
import { createCategoryPrismaTest } from '@/utils/test/createCategoryPrisma';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Get Category (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve ser possível obter uma categoria.', async () => {
    await createCategoryPrismaTest({
      data: { name: 'Categoria 1', slug: 'category-1' },
    });

    const response = await request(app.server)
      .get(`/categories/category-1`)
      .send();

    expect(response.statusCode).toEqual(200);

    const category = response.body;
    expect(category.slug).toBe('category-1');
  });

  // ---

  it('Deve retornar 400 caso a categoria seja inválida.', async () => {
    const response = await request(app.server)
      .get(`/categories/NOT-EXIST`)
      .send();

    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });
});
