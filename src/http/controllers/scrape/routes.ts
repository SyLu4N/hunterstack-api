import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { exportPolicyPdf } from './export-policy-pdf';
import { scrapingAndPosting } from './scraping-and-posting';

const ScrapeQuerySchema = z.object({
  url: z.string({ message: 'URL inválida.' }).url({ message: 'URL inválida.' }),
});

const ExportParamsSchema = z.object({
  slug: z.string({ message: 'Slug inválido.' }),
});

export async function scrapingRoutes(app: FastifyInstance) {
  app.get('/scraping', {
    schema: {
      summary: 'Executa scraping e salva a política',
      description: 'Recebe uma URL, faz scraping e salva como política',
      querystring: ScrapeQuerySchema,

      response: {
        201: z.null().describe('Policy created'),
        400: z.object({ message: z.string() }).describe('Bad request'),
      },
    },

    handler: scrapingAndPosting,
  });

  app.get(
    '/scraping/policy/:slug/pdf',
    {
      schema: {
        summary: 'Exporta uma Política para PDF',
        description: 'Recebe o slug de uma política e retorna um PDF',
        params: ExportParamsSchema,

        response: {
          200: z.instanceof(Buffer).describe('Pdf exported'),
          400: z.object({ message: z.string() }).describe('Bad request'),
          404: z.object({ message: z.string() }).describe('Not found'),
        },
      },
    },
    exportPolicyPdf,
  );
}
