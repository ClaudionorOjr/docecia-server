import { beforeEach, describe, expect, it } from 'vitest';
import { EditProfileUseCase } from './edit-profile';
import { InMemoryCustomersRepository } from '@domain/repositories/in-memory/in-memory-customers-repository';
import { makeCustomer } from 'src/utils/test/factories/makeCustomer';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let customersRepository: InMemoryCustomersRepository;
let sut: EditProfileUseCase;

describe('Edit Profile Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new EditProfileUseCase(customersRepository);
  });

  it('should be able to edit a customer profile', async () => {
    const newCustomer = await makeCustomer();

    await customersRepository.create(newCustomer);

    await sut.execute({
      customerId: newCustomer.id,
      name: 'John',
    });

    expect(customersRepository.customers[0]).toEqual(
      expect.objectContaining({
        name: 'John',
      }),
    );
  });

  it('should not be able to edit a non-existent customer profile', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'non-existing-id',
        name: 'John',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
