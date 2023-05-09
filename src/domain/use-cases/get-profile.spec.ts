import { beforeEach, describe, expect, it } from 'vitest';
import { GetProfileUseCase } from './get-profile';
import { InMemoryCustomersRepository } from '@domain/repositories/in-memory/in-memory-customers-repository';
import { Customer } from '@domain/entities/customer';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let customersRepository: InMemoryCustomersRepository;
let sut: GetProfileUseCase;

describe('Prifole Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new GetProfileUseCase(customersRepository);
  });

  it('should be able to get customer profile', async () => {
    const newCustomer = Customer.create({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
      phone: '99999999999',
    });

    await customersRepository.create(newCustomer);

    const { customer } = await sut.execute({ customerId: newCustomer.id });

    expect(customer).toEqual(expect.objectContaining({ id: newCustomer.id }));
  });

  it('should not be able to get customer profile with wrong id', async () => {
    await expect(() =>
      sut.execute({ customerId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
