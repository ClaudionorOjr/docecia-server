import { Address, AddressProps } from '@account/enterprise/entities/address';
import { faker } from '@faker-js/faker';

export function makeAddress(override: Partial<AddressProps> = {}, id?: string) {
  const address = Address.create(
    {
      customerId: faker.datatype.uuid(),
      street: faker.address.street(),
      addressNumber: Number(faker.address.buildingNumber()),
      city: faker.address.cityName(),
      addressComplement: faker.lorem.sentence(),
      ...override,
    },
    id,
  );

  return address;
}
