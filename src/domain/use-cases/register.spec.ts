import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { InMemoryCustomersRepository } from '@domain/repositories/in-memory/in-memory-customers-repository';
import { compare } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists';

let customersRepository: InMemoryCustomersRepository;
// * Sytem Under Test
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new RegisterUseCase(customersRepository);
  });

  it('should be able to register a customer', async () => {
    await sut.execute({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '99999999999',
    });

    const customerId = customersRepository.customers[0].id;

    expect(customersRepository.customers).toHaveLength(1);
    expect(customerId).toEqual(expect.any(String));
  });

  it('should hash customer password upon registration', async () => {
    await sut.execute({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '99999999999',
    });

    const customerPasswordHash = customersRepository.customers[0].passwordHash;

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      customerPasswordHash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com';

    await sut.execute({
      name: 'John',
      surname: 'Doe',
      email,
      password: '123456',
      phone: '99999999999',
    });

    await expect(() => {
      return sut.execute({
        name: 'John',
        surname: 'Doe',
        email,
        password: '123456',
        phone: '99999999999',
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
