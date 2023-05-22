import { beforeEach, describe, expect, it } from 'vitest';
import { FetchAvailableDesserts } from './fetch-available-desserts';
import { InMemoryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { makeDessert } from 'test/factories/make-dessert';

let dessertsRepository: InMemoryDessertsRepository;
let sut: FetchAvailableDesserts;

describe('Fetch Available Desserts Use Case', () => {
  beforeEach(() => {
    dessertsRepository = new InMemoryDessertsRepository();
    sut = new FetchAvailableDesserts(dessertsRepository);
  });

  it('should be able to fetch available desserts', async () => {
    await dessertsRepository.create(makeDessert());
    await dessertsRepository.create(makeDessert({ available: false }));
    await dessertsRepository.create(makeDessert());

    const { desserts } = await sut.execute();

    expect(desserts.length).toEqual(2);
  });
});
