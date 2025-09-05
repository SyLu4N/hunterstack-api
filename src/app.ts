import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyFormBody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import {
  validatorCompiler,
  jsonSchemaTransform,
  serializerCompiler,
} from 'fastify-type-provider-zod';

import { env } from './env/index';
import { categoriesRoutes } from './http/controllers/category/routes';
import { policiesRoutes } from './http/controllers/policy/routes';
import { scrapingRoutes } from './http/controllers/scrape/routes';

export const app = fastify();

app.register(fastifyCors, {
  origin: '*',
});

/* app.register(
  fastifyCors,
  (
    req: FastifyRequest,
    callback: (err: Error | null, options?: any) => void,
  ) => {
    let corsOptions: any;

    if (req.url?.startsWith('/scraping')) {
      corsOptions = {
        origin: process.env.CLIENT_APP_ADM_URL,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      };
    } else if (
      req.url?.startsWith('/policies') ||
      req.url?.startsWith('/categories')
    ) {
      corsOptions = {
        origin: process.env.CLIENT_APP_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      };
    }

    callback(null, corsOptions);
  },
); */

app.register(fastifyCookie);
app.register(fastifyMultipart);
app.register(fastifyFormBody);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Politica de Segurança da Informação',
      description:
        'API para gerenciamento de políticas de segurança da informação',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(fastifyRateLimit, {
  max: 10,
  timeWindow: '1 second',
});

app.register(scrapingRoutes);
app.register(policiesRoutes);
app.register(categoriesRoutes);

app.setErrorHandler((error, _req, res) => {
  if (error.validation) {
    const errorZod = error.validation[0]?.message;

    return res.status(400).send({ message: errorZod });
  }

  const errorMessage =
    error.message || 'Algo deu errado, tente novamente mais tarde.';

  if (env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return res.status(500).send({ message: errorMessage, error });
});
