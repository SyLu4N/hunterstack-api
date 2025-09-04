 import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Scraping And Posting (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve ser possível executar o scraping e salvar a política', async () => {
    const url =
      'https://fj.com.br/modelo-de-politica-de-seguranca-da-informacao';

    const response = await request(app.server).get(`/scraping?url=${url}`);

    expect(response.statusCode).toEqual(201);
  }, 120000);

  // ---

  it('Deve retornar 400 caso a URL seja inválida', async () => {
    const response = await request(app.server).get(`/scraping?url=123`);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });
});
