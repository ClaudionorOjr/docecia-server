import { beforeEach, describe, expect, it } from 'vitest';
import { FetchOpenOrdersUseCase } from './fetch-open-orders';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';

import { makeOrder } from 'test/factories/make-order';

let ordersRepository: InMemoryOrdersRepository;
let sut: FetchOpenOrdersUseCase;

describe('Fetch Orders Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    sut = new FetchOpenOrdersUseCase(ordersRepository);
  });

  it('should be able to fetch customer open orders', async () => {
    await ordersRepository.create(makeOrder({ customerId: 'customer-1' }));
    await ordersRepository.create(makeOrder({ customerId: 'customer-1' }));

    const { orders } = await sut.execute({ customerId: 'customer-1' });

    expect(orders).toHaveLength(2);
    orders.forEach((order) => expect(order.status).toEqual('PENDING'));
  });
});
