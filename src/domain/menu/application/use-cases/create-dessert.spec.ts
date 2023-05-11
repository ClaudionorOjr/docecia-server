import { beforeEach, describe, expect, it } from 'vitest';
import { CreateDessertUseCase } from './create-dessert';
import { InMemoeryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { faker } from '@faker-js/faker';

let dessertsRepository: InMemoeryDessertsRepository;
let sut: CreateDessertUseCase;

describe('Create Dessert Use Case', () => {
  beforeEach(() => {
    dessertsRepository = new InMemoeryDessertsRepository();
    sut = new CreateDessertUseCase(dessertsRepository);
  });

  it('should be able to create a dessert', async () => {
    await sut.execute({
      name: faker.lorem.words(2),
      taste: faker.lorem.word(),
      amount: Number(faker.finance.amount(1, 10, 0)),
      unitPrice: Number(faker.commerce.price(10, 60, 0)),
    });

    expect(dessertsRepository.desserts).toHaveLength(1);
    expect(dessertsRepository.desserts).toEqual([
      expect.objectContaining({ id: expect.any(String) }),
    ]);
  });
});
