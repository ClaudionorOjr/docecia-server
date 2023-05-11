import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from 'src/app';
import { createAndAuthenticateCustomer } from 'test/create-and-authenticate-customer';

describe('Create Address (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create an address for customer', async () => {
    const { token } = await createAndAuthenticateCustomer(app);

    const response = await request(app.server)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        city: 'Gotham',
        street: 'Victoria Place',
        addressNumber: 123,
      });

    expect(response.statusCode).toEqual(201);
  });
});
