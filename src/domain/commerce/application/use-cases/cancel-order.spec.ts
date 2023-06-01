import { beforeEach, describe, expect, it } from 'vitest';
import { CancelOrderUseCase } from './cancel-order';

import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { InMemoryBagItemsRepository } from 'test/repositories/in-memory-bag-items-repository';

import { makeCustomer } from 'test/factories/make-customer';
import { makeOrder } from 'test/factories/make-order';

import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { NotAllowedError } from '@account/application/use-cases/errors/not-allowed-error';

let customersRepository: InMemoryCustomersRepository;
let ordersRepository: InMemoryOrdersRepository;
let bagItemsRepository: InMemoryBagItemsRepository;
let dessertsRepository: InMemoryDessertsRepository;
let sut: CancelOrderUseCase;

describe('Cancel Order Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    ordersRepository = new InMemoryOrdersRepository();
    bagItemsRepository = new InMemoryBagItemsRepository();
    dessertsRepository = new InMemoryDessertsRepository();
    sut = new CancelOrderUseCase(
      ordersRepository,
      customersRepository,
      bagItemsRepository,
      dessertsRepository,
    );
  });

  it('should be able to cancel an order', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await ordersRepository.create(
      makeOrder({ customerId: 'customer-1' }, 'order-1'),
    );

    const { order } = await sut.execute({
      customerId: 'customer-1',
      orderId: 'order-1',
    });

    expect(order.status).toEqual('CANCELED');
  });

  it('should not be able to cancel the order another customer', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await ordersRepository.create(
      makeOrder({ customerId: 'customer-2' }, 'order-1'),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-1',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it('should not be able for a non-existent customer to cancel an order', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to cancel a non-existent order', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to cancel a delivered order', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await ordersRepository.create(
      makeOrder(
        { customerId: 'customer-1', deliveredAt: new Date() },
        'order-1',
      ),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-1',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
