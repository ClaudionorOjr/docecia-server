import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteDessertUseCase } from './delete-dessert';
import { InMemoeryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { makeDessert } from 'test/factories/makeDessert';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';

let dessertsRepository: InMemoeryDessertsRepository;
let sut: DeleteDessertUseCase;
describe('Delete Dessert Use Case', () => {
  beforeEach(() => {
    dessertsRepository = new InMemoeryDessertsRepository();
    sut = new DeleteDessertUseCase(dessertsRepository);
  });

  it('should be able to delete a dessert', async () => {
    const dessert = makeDessert({}, 'dessert-1');

    await dessertsRepository.create(dessert);

    await sut.execute({ dessertId: 'dessert-1' });

    expect(dessertsRepository.desserts).toHaveLength(0);
  });

  it('should not be able to delete a non-existent dessert', async () => {
    await expect(() =>
      sut.execute({ dessertId: 'dessert-1' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
