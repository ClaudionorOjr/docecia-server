import { AddressesRepository } from '../addresses-repository';
import { Address } from '@/domain/entities/address';

export class InMemoryAddressesRepository implements AddressesRepository {
  public addresses: Address[] = [];

  async create(address: Address) {
    this.addresses.push(address);

    return address;
  }
}
