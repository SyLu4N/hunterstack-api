 import { app } from '@/app';
import { createPolicyPrismaTest } from '@/utils/test/createPolicyPrisma';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Export Policy PDF (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve exportar a política em PDF quando o slug existir', async () => {
    const { policy } = await createPolicyPrismaTest({
      data: {
        title: 'Politica 1',
        description: 'Conteudo da politica 1',
        slug: 'policy-1',
        source: 'Fonte 1',
        summary: 'Resumo da politica 1',
        category: { create: { name: 'Categoria 1', slug: 'category-1' } },
      },
    });

    const { slug } = policy;

    const response = await request(app.server).get(
      `/scraping/policy/${slug}/pdf`,
    );

    expect(response.statusCode).toEqual(200);
    expect(response.headers['content-type']).toEqual('application/pdf');
    expect(response.headers['content-disposition']).toContain(`${slug}.pdf`);
    expect(response.body).toBeInstanceOf(Buffer);
  }, 120000);

  // ---

  it('Deve retornar 404 caso a política não seja encontrada', async () => {
    const response = await request(app.server).get(
      `/scraping/policy/NOT-EXIST/pdf`,
    );

    expect(response.statusCode).toEqual(404);
    expect(response.body).toHaveProperty('message');
  });
});
