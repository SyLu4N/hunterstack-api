import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { fetchCategories } from './fetch-categories';
import { getCategory } from './get-category';

const CategoryParamsSchema = z.object({
  slug: z.string(),
});

const FetchCategoriesQuerySchema = z.object({
  page: z.coerce.number().default(1),
  name: z.string().optional(),
  orderByCreated: z.enum(['asc', 'desc']).optional(),
});

export async function categoriesRoutes(app: FastifyInstance) {
  app.get('/categories/:slug', {
    schema: {
      summary: 'Retorna uma categoria pelo slug',
      description: 'Busca uma categoria específica através do slug.',
      params: CategoryParamsSchema,

      response: {
        200: z
          .object({ id: z.number(), name: z.string(), slug: z.string() })
          .describe('Category found'),

        400: z.object({ message: z.string() }).describe('Bad request'),
      },
    },

    handler: getCategory,
  });

  app.get('/categories', {
    schema: {
      summary: 'Lista todas as categorias',
      description: 'Busca categorias com filtros e paginação.',
      querystring: FetchCategoriesQuerySchema,

      response: {
        200: z
          .object({
            categories: z.array(
              z.object({ id: z.number(), name: z.string(), slug: z.string() }),
            ),

            totalCount: z.number(),
          })
          .describe('Categories found'),

        400: z.object({ message: z.string() }).describe('Bad request'),
      },
    },

    handler: fetchCategories,
  });
}
