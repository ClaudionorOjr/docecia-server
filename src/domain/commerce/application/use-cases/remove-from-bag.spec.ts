import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveFromBagUseCase } from './remove-from-bag';

import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository';
import { InMemoryBagItemsRepository } from 'test/repositories/in-memory-bag-items-repository';

import { makeItem } from 'test/factories/make-item';
import { makeCustomer } from 'test/factories/make-customer';

import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { NotAllowedError } from '@account/application/use-cases/errors/not-allowed-error';

let customersRepository: InMemoryCustomersRepository;
let bagItemsRepository: InMemoryBagItemsRepository;
let sut: RemoveFromBagUseCase;

describe('Remove To Bag Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    bagItemsRepository = new InMemoryBagItemsRepository();
    sut = new RemoveFromBagUseCase(customersRepository, bagItemsRepository);
  });

  it('should be able remove an item in the bag', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await bagItemsRepository.add(
      makeItem({ customerId: 'customer-1' }, 'item-1'),
    );

    await sut.execute({ customerId: 'customer-1', itemId: 'item-1' });

    expect(bagItemsRepository.bag).toHaveLength(0);
  });

  it('should not be able a non-existent customer remove an item in the bag', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        itemId: 'item-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to remove a non-existent item in the bag', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        itemId: 'item-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able remove an item in the bag another customer', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await bagItemsRepository.add(makeItem({}, 'item-1'));

    await expect(() =>
      sut.execute({ customerId: 'customer-1', itemId: 'item-1' }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
