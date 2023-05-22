import { beforeEach, describe, expect, it } from 'vitest';
import { IncrementBagItemUseCase } from './increment-bag-item';
import { InMemoryBagItemsRepository } from 'test/repositories/in-memory-bag-items-repository';
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository';
import { InMemoryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { makeCustomer } from 'test/factories/make-customer';
import { makeItem } from 'test/factories/make-item';
import { makeDessert } from 'test/factories/make-dessert';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';

let bagItemsRepository: InMemoryBagItemsRepository;
let customersRepository: InMemoryCustomersRepository;
let dessertsRepository: InMemoryDessertsRepository;
let sut: IncrementBagItemUseCase;

describe('Increment Bag Item Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    bagItemsRepository = new InMemoryBagItemsRepository();
    dessertsRepository = new InMemoryDessertsRepository();
    sut = new IncrementBagItemUseCase(
      customersRepository,
      bagItemsRepository,
      dessertsRepository,
    );
  });

  it('should be able to increment a quantity of an item in the bag', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await dessertsRepository.create(makeDessert({ amount: 5 }, 'dessert-1'));
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-1', quantity: 3 },
        'item-1',
      ),
    );

    await sut.execute({ customerId: 'customer-1', itemId: 'item-1' });
    await sut.execute({ customerId: 'customer-1', itemId: 'item-1' });

    expect(bagItemsRepository.bag[0].quantity).toEqual(5);
  });

  it('should not be able exceed quantity available of a product', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await dessertsRepository.create(makeDessert({ amount: 3 }, 'dessert-1'));
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', productId: 'dessert-1', quantity: 3 },
        'item-1',
      ),
    );

    await expect(() =>
      sut.execute({ customerId: 'customer-1', itemId: 'item-1' }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able a non-existent customer decrement an item in the bag', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        itemId: 'item-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to increment a non-existent item in the bag', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        itemId: 'item-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able for a customer to increment an item in the bag another customer', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await dessertsRepository.create(makeDessert({ amount: 3 }, 'dessert-1'));
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-2', productId: 'dessert-1', quantity: 1 },
        'item-1',
      ),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        itemId: 'item-1',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
