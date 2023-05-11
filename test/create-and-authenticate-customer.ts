import request from 'supertest';
import { FastifyInstance } from 'fastify';

export async function createAndAuthenticateCustomer(app: FastifyInstance) {
  await request(app.server).post('/customers').send({
    name: 'John',
    surname: 'Doe',
    email: 'johndoe@example.com',
    password: '123456',
    phone: '99999999999',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  });

  const { token } = authResponse.body;

  return { token };
}
