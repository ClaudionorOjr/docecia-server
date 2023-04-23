import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from 'src/app';

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to register', async () => {
    const response = await request(app.server).post('/customers').send({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '99999999999',
    });

    expect(response.statusCode).toEqual(201);
  });
});
