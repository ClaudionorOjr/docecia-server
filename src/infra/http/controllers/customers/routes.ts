import { FastifyInstance } from 'fastify';

import { register } from './register';
import { authenticate } from './authenticate';

export async function customerRoutes(app: FastifyInstance) {
  app.post('/customers', register);
  app.post('/sessions', authenticate);
}
