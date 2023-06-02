import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import request from 'supertest';
import { app } from 'src/app';

describe('Owner Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to register owner', async () => {
    const response = await request(app.server).post('/owner').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toEqual(201);
  });
});
