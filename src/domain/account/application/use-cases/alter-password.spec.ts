import { beforeEach, describe, expect, it } from 'vitest';
import { AlterPasswordUseCase } from './alter-password';
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository';
import { makeCustomer } from 'test/factories/make-customer';
import { compare, hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let customersRepository: InMemoryCustomersRepository;
let sut: AlterPasswordUseCase;

describe('Alter Password Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new AlterPasswordUseCase(customersRepository);
  });

  it('should be able to alter customer password', async () => {
    const customer = await makeCustomer(
      {
        passwordHash: await hash('123456', 6),
      },
      'customer-1',
    );

    await customersRepository.create(customer);

    await sut.execute({
      customerId: 'customer-1',
      password: '123456',
      newPassword: '122333',
    });

    const newPasswordHash = customersRepository.customers[0].passwordHash;

    const isNewPasswordHashed = await compare('122333', newPasswordHash);

    expect(isNewPasswordHashed).toBeTruthy();
  });

  it('should not be able to alter password a non-existing customer', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        password: '121212',
        newPassword: '122333',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to alter password when wrong password is passed', async () => {
    const customer = await makeCustomer(
      {
        passwordHash: await hash('123456', 6),
      },
      'customer-1',
    );

    await customersRepository.create(customer);

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        password: '121212',
        newPassword: '122333',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
