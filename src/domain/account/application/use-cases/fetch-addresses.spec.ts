import { beforeEach, describe, expect, it } from 'vitest';
import { FetchAddressesUseCase } from './fetch-addresses';
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-adresses-repository';
import { makeAddress } from 'test/factories/make-address';

let addressesRepository: InMemoryAddressesRepository;
let sut: FetchAddressesUseCase;

describe('Fetch Addresses Use Case', () => {
  beforeEach(() => {
    addressesRepository = new InMemoryAddressesRepository();
    sut = new FetchAddressesUseCase(addressesRepository);
  });

  it('should be able to fetch addresses for this customer id', async () => {
    await addressesRepository.create(
      makeAddress({
        customerId: 'customer-1',
      }),
    );
    await addressesRepository.create(
      makeAddress({
        customerId: 'customer-2',
      }),
    );
    await addressesRepository.create(
      makeAddress({
        customerId: 'customer-1',
      }),
    );
    await addressesRepository.create(
      makeAddress({
        customerId: 'customer-1',
      }),
    );
    await addressesRepository.create(
      makeAddress({
        customerId: 'customer-1',
      }),
    );

    const { addresses } = await sut.execute({ customerId: 'customer-1' });

    expect(addresses).toHaveLength(4);
    expect(addresses).toEqual([
      expect.objectContaining({ customerId: 'customer-1' }),
      expect.objectContaining({ customerId: 'customer-1' }),
      expect.objectContaining({ customerId: 'customer-1' }),
      expect.objectContaining({ customerId: 'customer-1' }),
    ]);
  });
});
