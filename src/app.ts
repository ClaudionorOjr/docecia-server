import fastifyJwt from '@fastify/jwt';
import { customerRoutes } from '@infra/http/controllers/customers/routes';
import fastify from 'fastify';
import { env } from './env';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(customerRoutes);
