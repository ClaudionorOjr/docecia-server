import { beforeEach, describe, expect, it } from 'vitest';
import { DecrementBagItemUseCase } from './decrement-bag-item';

import { InMemoryBagItemsRepository } from 'test/repositories/in-memory-bag-items-repository';
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository';

import { makeCustomer } from 'test/factories/make-customer';
import { makeItem } from 'test/factories/make-item';

import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { NotAllowedError } from '@account/application/use-cases/errors/not-allowed-error';

let bagItemsRepository: InMemoryBagItemsRepository;
let customersRepository: InMemoryCustomersRepository;
let sut: DecrementBagItemUseCase;

describe('Decrement Bag Item Use Case', () => {
  beforeEach(() => {
    bagItemsRepository = new InMemoryBagItemsRepository();
    customersRepository = new InMemoryCustomersRepository();
    sut = new DecrementBagItemUseCase(customersRepository, bagItemsRepository);
  });

  it('should be able to decrement the quantity of anitem in the bag', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-1', quantity: 3 },
        'item-1',
      ),
    );
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-2', quantity: 3 },
        'item-2',
      ),
    );

    await sut.execute({
      customerId: 'customer-1',
      itemId: 'item-1',
    });

    await sut.execute({
      customerId: 'customer-1',
      itemId: 'item-2',
    });

    await sut.execute({
      customerId: 'customer-1',
      itemId: 'item-2',
    });

    expect(bagItemsRepository.bag[0].quantity).toEqual(2);
    expect(bagItemsRepository.bag[1].quantity).toEqual(1);
  });

  it('should be able to remove the item if the last unit is decremented', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-1', quantity: 3 },
        'item-1',
      ),
    );

    await sut.execute({
      customerId: 'customer-1',
      itemId: 'item-1',
    });

    await sut.execute({
      customerId: 'customer-1',
      itemId: 'item-1',
    });

    await sut.execute({
      customerId: 'customer-1',
      itemId: 'item-1',
    });

    expect(bagItemsRepository.bag).toHaveLength(0);
  });

  it('should not be able a non-existent customer decrement an item in the bag', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        itemId: 'item-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to decrement a non-existent item in the bag', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        itemId: 'item-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able for a customer to decrement an item in the bag another customer', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-2', productId: 'dessert-1', quantity: 3 },
        'item-1',
      ),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        itemId: 'item-1',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
