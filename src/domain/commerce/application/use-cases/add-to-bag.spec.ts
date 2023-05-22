import { beforeEach, describe, expect, it } from 'vitest';
import { AddToBagUseCase } from './add-to-bag';
import { InMemoryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { makeDessert } from 'test/factories/make-dessert';
import { InMemoryBagItemsRepository } from 'test/repositories/in-memory-bag-items-repository';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository';
import { makeCustomer } from 'test/factories/make-customer';

let customersRepository: InMemoryCustomersRepository;
let dessertsRepository: InMemoryDessertsRepository;
let bagItemsRepository: InMemoryBagItemsRepository;
let sut: AddToBagUseCase;

describe('Add To Bag Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    dessertsRepository = new InMemoryDessertsRepository();
    bagItemsRepository = new InMemoryBagItemsRepository();
    sut = new AddToBagUseCase(
      customersRepository,
      bagItemsRepository,
      dessertsRepository,
    );
  });

  it('should be able add items to the bag', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await dessertsRepository.create(makeDessert({ amount: 2 }, 'dessert-1'));
    await dessertsRepository.create(makeDessert({ amount: 4 }, 'dessert-2'));

    await sut.execute({
      customerId: 'customer-1',
      dessertId: 'dessert-1',
      quantity: 2,
    });

    await sut.execute({
      customerId: 'customer-1',
      dessertId: 'dessert-2',
      quantity: 2,
    });

    expect(bagItemsRepository.bag).toHaveLength(2);
    expect(bagItemsRepository.bag).toEqual([
      expect.objectContaining({ productId: 'dessert-1' }),
      expect.objectContaining({ productId: 'dessert-2' }),
    ]);
  });

  it('should be able to increment an item existent in the bag', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await dessertsRepository.create(makeDessert({ amount: 4 }, 'dessert-1'));

    await sut.execute({
      customerId: 'customer-1',
      dessertId: 'dessert-1',
      quantity: 2,
    });

    await sut.execute({
      customerId: 'customer-1',
      dessertId: 'dessert-1',
      quantity: 2,
    });

    expect(bagItemsRepository.bag).toEqual([
      expect.objectContaining({ quantity: 4 }),
    ]);
  });

  it('should not be able to increment an item existent in the bag if the quantity is exceeded', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await dessertsRepository.create(makeDessert({ amount: 2 }, 'dessert-1'));

    await sut.execute({
      customerId: 'customer-1',
      dessertId: 'dessert-1',
      quantity: 2,
    });

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        dessertId: 'dessert-1',
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able a non-existent customer add a item to the bag', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        dessertId: 'dessert-1',
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able add a non-existent item to the bag', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        dessertId: 'dessert-1',
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able add a unavailable item to the bag', async () => {
    await dessertsRepository.create(
      makeDessert({ amount: 2, available: false }, 'dessert-1'),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        dessertId: 'dessert-1',
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able exceed the quantity of the item', async () => {
    await dessertsRepository.create(makeDessert({ amount: 2 }, 'dessert-1'));

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        dessertId: 'dessert-1',
        quantity: 3,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
