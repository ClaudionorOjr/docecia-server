import { Address } from '@account/enterprise/entities/address';
import { AddressesRepository } from '../../src/domain/account/application/repositories/addresses-repository';

export class InMemoryAddressesRepository implements AddressesRepository {
  public addresses: Address[] = [];

  async create(address: Address) {
    this.addresses.push(address);
  }

  async findById(id: string) {
    const address = this.addresses.find((address) => address.id === id);

    if (!address) {
      return null;
    }

    return address;
  }

  async findManyByCustomerId(customerId: string) {
    const addresses = this.addresses.filter(
      (item) => item.customerId === customerId,
    );

    return addresses;
  }

  async save(address: Address) {
    const addressIndex = this.addresses.findIndex(
      (item) => item.id === address.id,
    );

    this.addresses[addressIndex] = address;
  }

  async delete(id: string): Promise<void> {
    const addressIndex = this.addresses.findIndex(
      (address) => address.id === id,
    );

    if (addressIndex >= 0) {
      this.addresses.splice(addressIndex, 1);
    }
  }
}
