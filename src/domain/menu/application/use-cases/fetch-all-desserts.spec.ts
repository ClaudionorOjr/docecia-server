import { beforeEach, describe, expect, it } from 'vitest';
import { FetchAllDessertsUseCase } from './fetch-all-desserts';
import { InMemoryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { makeDessert } from 'test/factories/make-dessert';

let dessertsRepository: InMemoryDessertsRepository;
let sut: FetchAllDessertsUseCase;

describe('Fetch All Desserts Use Case', () => {
  beforeEach(() => {
    dessertsRepository = new InMemoryDessertsRepository();
    sut = new FetchAllDessertsUseCase(dessertsRepository);
  });

  it('should be able to fetch all desserts', async () => {
    await dessertsRepository.create(makeDessert({ available: false }));
    await dessertsRepository.create(makeDessert());
    await dessertsRepository.create(makeDessert({ available: false }));
    await dessertsRepository.create(makeDessert());

    const { desserts } = await sut.execute();

    expect(desserts).toHaveLength(4);
  });
});
