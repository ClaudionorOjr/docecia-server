import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteAddressUseCase } from './delete-address';
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-adresses-repository';
import { Address } from '@account/enterprise/entities/address';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

let addressesRepository: InMemoryAddressesRepository;
let sut: DeleteAddressUseCase;

describe('Delete Address Use Case', () => {
  beforeEach(() => {
    addressesRepository = new InMemoryAddressesRepository();
    sut = new DeleteAddressUseCase(addressesRepository);
  });

  it('should be able to delete an address', async () => {
    const address = Address.create({
      city: 'Gotham',
      street: 'Victoria Place',
      addressNumber: 123,
      customerId: 'customer-01',
    });

    await addressesRepository.create(address);

    await sut.execute({ addressId: address.id, customerId: 'customer-01' });

    expect(addressesRepository.addresses).toHaveLength(0);
  });

  it('should not be able to delete an non-existent address', async () => {
    const address = Address.create({
      city: 'Gotham',
      street: 'Victoria Place',
      addressNumber: 123,
      customerId: 'customer-01',
    });

    await addressesRepository.create(address);

    expect(addressesRepository.addresses).toHaveLength(1);

    await expect(() =>
      sut.execute({ addressId: 'address-id', customerId: 'customer-01' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able a customer to delete an address that is not yours', async () => {
    const address = Address.create({
      city: 'Gotham',
      street: 'Victoria Place',
      addressNumber: 123,
      customerId: 'customer-01',
    });

    await addressesRepository.create(address);

    await expect(() =>
      sut.execute({ addressId: address.id, customerId: 'customer-02' }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
