import { app } from '@/app';
import { createPolicyPrismaTest } from '@/utils/test/createPolicyPrisma';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Fetch Policies (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve ser possível obter as políticas.', async () => {
    const dataPolicy = {
      title: 'Politica 1',
      description: 'Conteudo da politica 1',
      slug: 'policy-1',
      source: 'Fonte 1',
      summary: 'Resumo da politica 1',
      category: { create: { name: 'Categoria 1', slug: 'category-1' } },
    };

    await createPolicyPrismaTest({ data: dataPolicy });
    await createPolicyPrismaTest({
      data: {
        ...dataPolicy,
        slug: 'policy-2',
        category: { create: { name: 'Categoria 2', slug: 'category-2' } },
      },
    });

    const response = await request(app.server).get(`/policies`).send();
    const data = response.body;

    expect(response.statusCode).toEqual(200);
    expect(data.totalCount).toBe(2);
    expect(data.policies).toEqual([
      expect.objectContaining({ slug: 'policy-1' }),
      expect.objectContaining({ slug: 'policy-2' }),
    ]);
  });
});
