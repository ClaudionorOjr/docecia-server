import { Address } from '@domain/entities/address';
import { Address as RawAddress } from '@prisma/client';

export class PrismaAddressMapper {
  static toPrisma(address: Address) {
    return {
      id: address.id,
      city: address.city,
      street: address.street,
      address_number: address.addressNumber,
      address_complement: address.addressComplement,
      customer_id: address.customerId,
    };
  }

  static toDomain(rawAddress: RawAddress) {
    return Address.create(
      {
        city: rawAddress.city,
        street: rawAddress.street,
        addressNumber: Number(rawAddress.address_number),
        addressComplement: rawAddress.address_complement,
        customerId: rawAddress.customer_id,
      },
      rawAddress.id,
    );
  }
}
