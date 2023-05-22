import { beforeEach, describe, expect, it } from 'vitest';
import { FetchAllDesserts } from './fetch-all-desserts';
import { InMemoryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { makeDessert } from 'test/factories/make-dessert';

let dessertsRepository: InMemoryDessertsRepository;
let sut: FetchAllDesserts;

describe('Fetch All Desserts Use Case', () => {
  beforeEach(() => {
    dessertsRepository = new InMemoryDessertsRepository();
    sut = new FetchAllDesserts(dessertsRepository);
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
