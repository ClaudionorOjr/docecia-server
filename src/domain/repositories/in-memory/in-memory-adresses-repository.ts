import { Address } from '@domain/entities/address';
import { AddressesRepository } from '../addresses-repository';

export class InMemoryAddressesRepository implements AddressesRepository {
  public addresses: Address[] = [];

  async create(address: Address) {
    this.addresses.push(address);
  }
}
