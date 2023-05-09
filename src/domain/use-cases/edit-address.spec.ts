import { beforeEach, describe, expect, it } from 'vitest';
import { EditAddressUseCase } from './edit-address';
import { InMemoryAddressesRepository } from '@domain/repositories/in-memory/in-memory-adresses-repository';
import { makeAddress } from 'src/utils/test/factories/makeAddress';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let addressesRepository: InMemoryAddressesRepository;
let sut: EditAddressUseCase;
describe('Edit Address Use Case', () => {
  beforeEach(() => {
    addressesRepository = new InMemoryAddressesRepository();
    sut = new EditAddressUseCase(addressesRepository);
  });

  it('should be able to edit a customer address', async () => {
    const newAddress = makeAddress({
      customerId: 'customer-1',
    });

    await addressesRepository.create(newAddress);

    await sut.execute({
      addressId: newAddress.id,
      customerId: 'customer-1',
      city: 'Gotham',
      street: 'Victoria Place',
      addressNumber: 123,
      addressComplement: '',
    });

    expect(addressesRepository.addresses[0]).toEqual(
      expect.objectContaining({ street: 'Victoria Place' }),
    );
  });

  it('should not be able a customer to edit a non-existent address', async () => {
    await expect(() =>
      sut.execute({
        addressId: 'address-1',
        customerId: 'customer-1',
        city: 'Gotham',
        street: 'Victoria Place',
        addressNumber: 123,
        addressComplement: '',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able a customer to edit an address that is not yours', async () => {
    const newAddress = makeAddress({
      customerId: 'customer-1',
    });

    await addressesRepository.create(newAddress);

    await expect(() =>
      sut.execute({
        addressId: newAddress.id,
        customerId: 'customer-2',
        city: 'Gotham',
        street: 'Victoria Place',
        addressNumber: 123,
        addressComplement: '',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
