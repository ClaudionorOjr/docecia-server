import { beforeEach, describe, expect, it } from 'vitest';
import { FetchAllOrdersUseCase } from './fetch-all-orders';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';

import { makeOrder } from 'test/factories/make-order';

let ordersRepository: InMemoryOrdersRepository;
let sut: FetchAllOrdersUseCase;

describe('Fetch All Orders Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    sut = new FetchAllOrdersUseCase(ordersRepository);
  });

  it('should be able to fetch all orders', async () => {
    await ordersRepository.create(
      makeOrder({ customerId: 'customer-1' }, 'order-1'),
    );
    await ordersRepository.create(
      makeOrder({ customerId: 'customer-2' }, 'order-2'),
    );
    await ordersRepository.create(
      makeOrder({ customerId: 'customer-3' }, 'order-3'),
    );

    const { orders } = await sut.execute();

    expect(orders).toHaveLength(3);
    expect(orders).toEqual([
      expect.objectContaining({ id: 'order-1', customerId: 'customer-1' }),
      expect.objectContaining({ id: 'order-2', customerId: 'customer-2' }),
      expect.objectContaining({ id: 'order-3', customerId: 'customer-3' }),
    ]);
  });
});
