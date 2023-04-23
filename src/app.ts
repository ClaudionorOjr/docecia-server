import { customerRoutes } from '@infra/http/controllers/customers/routes';
import fastify from 'fastify';

export const app = fastify();

app.register(customerRoutes);
