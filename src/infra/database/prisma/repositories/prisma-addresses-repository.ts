import { Address } from '@domain/entities/address';
import { AddressesRepository } from '@domain/repositories/addresses-repository';
import { prisma } from '../prisma';
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper';

export class PrismaAddressesRepository implements AddressesRepository {
  async create(address: Address) {
    const rawAddress = PrismaAddressMapper.toPrisma(address);

    await prisma.address.create({
      data: rawAddress,
    });
  }
}
