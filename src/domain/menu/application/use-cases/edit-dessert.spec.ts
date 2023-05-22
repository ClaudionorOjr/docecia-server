import { beforeEach, describe, expect, it } from 'vitest';
import { EditDessertUseCase } from './edit-dessert';
import { InMemoryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { makeDessert } from 'test/factories/make-dessert';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';

let dessertsRepository: InMemoryDessertsRepository;
let sut: EditDessertUseCase;

describe('Edit Dessert Use Case', () => {
  beforeEach(() => {
    dessertsRepository = new InMemoryDessertsRepository();
    sut = new EditDessertUseCase(dessertsRepository);
  });

  it('should be able to edit a dessert', async () => {
    const dessert = makeDessert({}, 'dessert-1');

    await dessertsRepository.create(dessert);

    await sut.execute({
      dessertId: 'dessert-1',
      name: 'pot cake',
      taste: 'chocolate',
      amount: 5,
      unitPrice: 9.75,
    });
  });

  it('should not be able to edit a non-existent dessert', async () => {
    await expect(() =>
      sut.execute({
        dessertId: 'dessert-1',
        name: 'pot cake',
        taste: 'chocolate',
        amount: 5,
        unitPrice: 9.75,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
