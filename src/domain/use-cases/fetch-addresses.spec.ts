import { beforeEach, describe, expect, it } from 'vitest';
import { FetchAddressesUseCase } from './fetch-addresses';
import { InMemoryAddressesRepository } from '@domain/repositories/in-memory/in-memory-adresses-repository';
import { makeAddress } from 'src/utils/test/factories/makeAddress';

let addressesRepository: InMemoryAddressesRepository;
let sut: FetchAddressesUseCase;

describe('Fetch Addresses Use Case', () => {
  beforeEach(() => {
    addressesRepository = new InMemoryAddressesRepository();
    sut = new FetchAddressesUseCase(addressesRepository);
  });

  it('should be able to fetch addresses for this customer id', async () => {
    for (let i = 0; i < 5; i++) {
      await addressesRepository.create(
        makeAddress({
          customerId: 'customer-1',
        }),
      );
    }

    const { addresses } = await sut.execute({ customerId: 'customer-1' });

    expect(addresses).toHaveLength(5);
    expect(addresses).toEqual([
      expect.objectContaining({ customerId: 'customer-1' }),
      expect.objectContaining({ customerId: 'customer-1' }),
      expect.objectContaining({ customerId: 'customer-1' }),
      expect.objectContaining({ customerId: 'customer-1' }),
      expect.objectContaining({ customerId: 'customer-1' }),
    ]);
  });
});
