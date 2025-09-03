import { app } from '@/app';
import { createPolicyPrismaTest } from '@/utils/test/createPolicyPrisma';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Get Policy (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve ser possível obter uma política.', async () => {
    const dataPolicy = {
      title: 'Politica 1',
      description: 'Conteudo da politica 1',
      slug: 'policy-1',
      source: 'Fonte 1',
      summary: 'Resumo da politica 1',
      category: { create: { name: 'Categoria 1', slug: 'category-1' } },
    };

    await createPolicyPrismaTest({ data: dataPolicy });

    const response = await request(app.server).get(`/policies/policy-1`).send();
    const policy = response.body;

    expect(response.statusCode).toEqual(200);
    expect(policy).toEqual(
      expect.objectContaining({
        slug: 'policy-1',
        category: expect.objectContaining({ slug: 'category-1' }),
      }),
    );
  });

  // ---

  it('Deve retornar 404 caso a policy nao seja encontrada.', async () => {
    const response = await request(app.server)
      .get(`/policies/NOT-EXIST`)
      .send();

    expect(response.statusCode).toEqual(404);
    expect(response.body).toHaveProperty('message');
  });
});
