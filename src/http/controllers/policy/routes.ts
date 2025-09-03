import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { fetchPolicies } from './fetch-policies';
import { getPolicy } from './get-policy';

const PolicyParamsSchema = z.object({
  slug: z.string(),
});

const FetchPoliciesQuerySchema = z.object({
  page: z.coerce.number().default(1),
  title: z.string().optional(),
  search: z.string().optional(),
  slug: z.string().optional(),
  category: z.string().optional(),
  orderByCreated: z.enum(['asc', 'desc']).optional(),
});

export async function policiesRoutes(app: FastifyInstance) {
  app.get('/policies/:slug', {
    schema: {
      summary: 'Retorna uma política pelo slug',
      description: 'Busca uma política específica através do slug.',
      params: PolicyParamsSchema,

      response: {
        200: z
          .object({
            slug: z.string(),
            title: z.string(),
            description: z.string(),
            source: z.string().optional(),
            summary: z.string(),
            category: z.object({ name: z.string(), slug: z.string() }),
            createdAt: z.date(),
          })
          .describe('Policy found'),

        400: z.object({ message: z.string() }).describe('Bad request'),
      },
    },

    handler: getPolicy,
  });

  app.get('/policies', {
    schema: {
      summary: 'Lista todas as políticas',
      description: 'Busca políticas com filtros e paginação.',
      querystring: FetchPoliciesQuerySchema,

      response: {
        200: z
          .object({
            policies: z.array(
              z.object({
                slug: z.string(),
                title: z.string(),
                description: z.string(),
                source: z.string().optional(),
                summary: z.string(),
                category: z.object({ name: z.string(), slug: z.string() }),
                createdAt: z.date(),
              }),
            ),

            totalCount: z.number(),
          })
          .describe('Policies found'),

        400: z.object({ message: z.string() }).describe('Bad request'),
      },
    },

    handler: fetchPolicies,
  });
}
