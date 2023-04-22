import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { InMemoryCustomersRepository } from '@/domain/repositories/in-memory/in-memory-customers-repository';
import { compare } from 'bcryptjs';

let customersRepository: InMemoryCustomersRepository;
// * Sytem Under Test
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new RegisterUseCase(customersRepository);
  });

  it('should be able to register a customer', async () => {
    const { customer } = await sut.execute({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '99999999999',
    });

    expect(customer.id).toEqual(expect.any(String));
  });

  it('should hash customer password upon registration', async () => {
    const { customer } = await sut.execute({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '99999999999',
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      customer.password_hash,
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
    }).rejects.toBeInstanceOf(Error);
  });
});
