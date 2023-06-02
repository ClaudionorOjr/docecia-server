import { FastifyInstance } from 'fastify';
import { registerOwner } from './register-owner';

export async function ownerRoutes(app: FastifyInstance) {
  app.post('/owner', registerOwner);
}
