import { beforeEach, describe, expect, it } from 'vitest';
import { ToggleAvailabilityUseCase } from './toggle-availability';
import { InMemoryDessertsRepository } from 'test/repositories/in-memory-desserts-repository';
import { makeDessert } from 'test/factories/make-dessert';

let dessertsRepository: InMemoryDessertsRepository;
let sut: ToggleAvailabilityUseCase;

describe('Toggle Availability Use Case', () => {
  beforeEach(() => {
    dessertsRepository = new InMemoryDessertsRepository();
    sut = new ToggleAvailabilityUseCase(dessertsRepository);
  });

  it('should be able to toggle availability the desserts', async () => {
    await dessertsRepository.create(makeDessert({}, 'dessert-1'));
    await dessertsRepository.create(
      makeDessert({ available: false }, 'dessert-2'),
    );

    await sut.execute({ dessertId: 'dessert-1' });
    await sut.execute({ dessertId: 'dessert-2' });

    expect(dessertsRepository.desserts).toEqual([
      expect.objectContaining({ available: false }),
      expect.objectContaining({ available: true }),
    ]);
  });
});
