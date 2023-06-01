import { beforeEach, describe, expect, it } from 'vitest';
import { PlaceOrderUseCase } from './place-order';

import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository';
import { InMemoryBagItemsRepository } from 'test/repositories/in-memory-bag-items-repository';
import { InMemoryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-adresses-repository';

import { makeCustomer } from 'test/factories/make-customer';
import { makeItem } from 'test/factories/make-item';
import { makeDessert } from 'test/factories/make-dessert';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';

let customersRepository: InMemoryCustomersRepository;
let ordersRepository: InMemoryOrdersRepository;
let bagItemsRepository: InMemoryBagItemsRepository;
let dessertsRepository: InMemoryDessertsRepository;
let addressesRepository: InMemoryAddressesRepository;
let sut: PlaceOrderUseCase;

describe('Place Order Use Case', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    customersRepository = new InMemoryCustomersRepository();
    bagItemsRepository = new InMemoryBagItemsRepository();
    dessertsRepository = new InMemoryDessertsRepository();
    addressesRepository = new InMemoryAddressesRepository();
    sut = new PlaceOrderUseCase(
      ordersRepository,
      customersRepository,
      bagItemsRepository,
      dessertsRepository,
      addressesRepository,
    );
  });

  it('should be able to place an order', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await dessertsRepository.create(makeDessert({ amount: 4 }, 'dessert-1'));
    await dessertsRepository.create(makeDessert({ amount: 2 }, 'dessert-2'));
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-1', quantity: 2 },
        'item-1',
      ),
    );
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-2', quantity: 1 },
        'item-2',
      ),
    );

    const { order } = await sut.execute({
      customerId: 'customer-1',
      payment: 'DEBIT',
      pickupLocal: true,
    });

    expect(ordersRepository.orders).toHaveLength(1);
    expect(order).toEqual(expect.objectContaining({ id: expect.any(String) }));
  });

  it('should not be able a non-existent customer place an order', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        payment: 'DEBIT',
        pickupLocal: true,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able place an order without some item', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        payment: 'DEBIT',
        pickupLocal: true,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able place an order of a non-existent address', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-1', quantity: 2 },
        'item-1',
      ),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        payment: 'DEBIT',
        pickupLocal: false,
        note: 'I live near the highway',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able place an order of a non-existent or unavailable dessert', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await dessertsRepository.create(
      makeDessert({ amount: 1, available: false }, 'dessert-1'),
    );
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-1', quantity: 2 },
        'item-1',
      ),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        payment: 'DEBIT',
        pickupLocal: true,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to place an order if the available quantity not enough', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await dessertsRepository.create(makeDessert({ amount: 1 }, 'dessert-1'));
    await dessertsRepository.create(makeDessert({ amount: 2 }, 'dessert-2'));
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-1', quantity: 1 },
        'item-1',
      ),
    );

    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-2', quantity: 3 },
        'item-2',
      ),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        payment: 'DEBIT',
        pickupLocal: true,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
