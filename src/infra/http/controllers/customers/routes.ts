import { FastifyInstance } from 'fastify';
import { verifyCustomerJWT } from '@infra/http/middlewares/verify-customer-jwt';

import { register } from './register';
import { authenticate } from './authenticate';
import { createAddress } from './create-address';
import { refresh } from './refresh';

export async function customerRoutes(app: FastifyInstance) {
  app.post('/customers', register);
  app.post('/sessions', authenticate);

  app.post('/addresses', { onRequest: [verifyCustomerJWT] }, createAddress);

  app.patch('/token/refresh', refresh);
}
