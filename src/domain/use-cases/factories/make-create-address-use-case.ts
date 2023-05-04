import { PrismaAddressesRepository } from '@infra/database/prisma/repositories/prisma-addresses-repository';
import { CreateAddressUseCase } from '../create-address';
import { PrismaCustomersRepository } from '@infra/database/prisma/repositories/prisma-customers-repository';

export function MakeCreateAddressUseCase() {
  const customersRepository = new PrismaCustomersRepository();
  const addressesRepository = new PrismaAddressesRepository();
  const createAddressUseCase = new CreateAddressUseCase(
    addressesRepository,
    customersRepository,
  );

  return createAddressUseCase;
}
