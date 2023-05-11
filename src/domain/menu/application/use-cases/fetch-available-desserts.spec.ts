import { beforeEach, describe, expect, it } from 'vitest';
import { FetchAvailableDesserts } from './fetch-available-desserts';
import { InMemoeryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { makeDessert } from 'test/factories/makeDessert';

let dessertsRepository: InMemoeryDessertsRepository;
let sut: FetchAvailableDesserts;

describe('Fetch Available Desserts Use Case', () => {
  beforeEach(() => {
    dessertsRepository = new InMemoeryDessertsRepository();
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
