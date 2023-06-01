import { beforeEach, describe, expect, it } from 'vitest';
import { HistoryCustomerOrdersUseCase } from './history-customer-orders';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';

import { makeOrder } from 'test/factories/make-order';

let ordersRepository: InMemoryOrdersRepository;
let sut: HistoryCustomerOrdersUseCase;

describe("History Customer's Orders Use Case", () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    sut = new HistoryCustomerOrdersUseCase(ordersRepository);
  });

  it("should be able to return the history of customer's orders", async () => {
    await ordersRepository.create(
      makeOrder({ customerId: 'customer-1' }, 'order-1'),
    );

    const deliveredAt = new Date();
    await ordersRepository.create(
      makeOrder({ customerId: 'customer-1', deliveredAt }, 'order-2'),
    );

    const canceledAt = new Date();
    await ordersRepository.create(
      makeOrder({ customerId: 'customer-1', canceledAt }, 'order-3'),
    );

    const { orders } = await sut.execute({ customerId: 'customer-1' });

    expect(orders).toHaveLength(3);
    expect(orders).toEqual([
      expect.objectContaining({ id: 'order-1' }),
      expect.objectContaining({ id: 'order-2', deliveredAt }),
      expect.objectContaining({ id: 'order-3', canceledAt }),
    ]);
  });
});
