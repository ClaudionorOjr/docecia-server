import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InMemoryCustomersRepository } from '@/domain/repositories/in-memory/in-memory-customers-repository';
import { hash } from 'bcryptjs';
import { Customer } from '@/domain/entities/customer';

let customersRepository: InMemoryCustomersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new AuthenticateUseCase(customersRepository);
  });

  it('should be able to authenticate', async () => {
    await customersRepository.create(
      Customer.create({
        name: 'John',
        surname: 'Doe',
        email: 'johndoe@example.com',
        passwordHash: await hash('123456', 6),
        phone: '99999999999',
      }),
    );

    const { customer } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(customer.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await customersRepository.create(
      Customer.create({
        name: 'John',
        surname: 'Doe',
        email: 'johndoe@example.com',
        passwordHash: await hash('123456', 6),
        phone: '99999999999',
      }),
    );

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
