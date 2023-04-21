import { beforeEach, describe, expect, it } from 'vitest';
import { CreateAddressUseCase } from './create-address';
import { InMemoryAddressesRepository } from '@/repositories/in-memory/in-memory-adresses-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';

let usersRepository: InMemoryUsersRepository;
let addressesRepository: InMemoryAddressesRepository;
let sut: CreateAddressUseCase;

describe('Create Address Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    addressesRepository = new InMemoryAddressesRepository();
    sut = new CreateAddressUseCase(addressesRepository, usersRepository);
  });

  it('should be able to create a address', async () => {
    const user = await usersRepository.create({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      phone: '99999999999'
    });

    const { address } = await sut.execute({
      city: 'Gotham',
      street: 'Victoria Place',
      address_number: 123,
      user_id: user.id
    });

    expect(address.id).toEqual(expect.any(String));
  });

  it('should not be able to create a address for non-existent user', async () => {
    
    await expect(() => 
      sut.execute({
        city: 'Gotham',
        street: 'Victoria Place',
        address_number: 123,
        user_id: 'user-01'
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to create one or more address for same user', async () => {
    const user = await usersRepository.create({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      phone: '99999999999'
    });

    await sut.execute({
      city: 'Gotham',
      street: 'Charon',
      address_number: 123,
      user_id: user.id
    });

    await sut.execute({
      city: 'Gotham',
      street: 'Victoria Place',
      address_number: 123,
      user_id: user.id
    });

    expect(addressesRepository.addresses).toHaveLength(2);
    expect(addressesRepository.addresses).toEqual([
      expect.objectContaining({ street: 'Charon'}),
      expect.objectContaining({ street: 'Victoria Place'})
    ]);
  });
});