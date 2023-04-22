import { beforeEach, describe, expect, it } from 'vitest';
import { CreateAddressUseCase } from './create-address';
import { InMemoryAddressesRepository } from '@/domain/repositories/in-memory/in-memory-adresses-repository';
import { InMemoryCustomersRepository } from '@/domain/repositories/in-memory/in-memory-customers-repository';
import { hash } from 'bcryptjs';
import { Customer } from '@/domain/entities/customer';

let customersRepository: InMemoryCustomersRepository;
let addressesRepository: InMemoryAddressesRepository;
let sut: CreateAddressUseCase;

describe('Create Address Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    addressesRepository = new InMemoryAddressesRepository();
    sut = new CreateAddressUseCase(addressesRepository, customersRepository);
  });

  it('should be able to create a address', async () => {
    const customer = Customer.create({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
      phone: '99999999999',
    });

    await customersRepository.create(customer);

    const { address } = await sut.execute({
      city: 'Gotham',
      street: 'Victoria Place',
      addressNumber: 123,
      customerId: customer.id,
    });

    expect(address.id).toEqual(expect.any(String));
  });

  it('should not be able to create a address for non-existent customer', async () => {
    await expect(() =>
      sut.execute({
        city: 'Gotham',
        street: 'Victoria Place',
        addressNumber: 123,
        customerId: 'customer-01',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to create one or more address for same customer', async () => {
    const customer = Customer.create({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
      phone: '99999999999',
    });

    await customersRepository.create(customer);

    await sut.execute({
      city: 'Gotham',
      street: 'Charon',
      addressNumber: 123,
      customerId: customer.id,
    });

    await sut.execute({
      city: 'Gotham',
      street: 'Victoria Place',
      addressNumber: 123,
      customerId: customer.id,
    });

    expect(addressesRepository.addresses).toHaveLength(2);
    expect(addressesRepository.addresses).toEqual([
      expect.objectContaining({ street: 'Charon' }),
      expect.objectContaining({ street: 'Victoria Place' }),
    ]);
  });
});
