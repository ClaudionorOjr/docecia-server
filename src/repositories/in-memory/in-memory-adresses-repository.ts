import { Prisma, Address } from '@prisma/client';
import { AddressesRepository } from '../addresses-repository';
import { randomUUID } from 'crypto';

export class InMemoryAddressesRepository implements AddressesRepository {
  public addresses: Address[] = [];

  async create(data: Prisma.AddressUncheckedCreateInput) {
    const address: Address = {
      id: randomUUID(),
      street: data.street,
      address_number: new Prisma.Decimal(data.address_number.toString()),
      city: data.city,
      address_complement: data.address_complement ?? null,
      user_id: data.user_id
    };

    this.addresses.push(address);

    return address;
  }

}