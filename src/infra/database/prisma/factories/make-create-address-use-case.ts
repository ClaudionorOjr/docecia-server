import { PrismaAddressesRepository } from '@database/prisma/repositories/prisma-addresses-repository';
import { CreateAddressUseCase } from '../../../../domain/account/application/use-cases/create-address';
import { PrismaCustomersRepository } from '@database/prisma/repositories/prisma-customers-repository';

export function MakeCreateAddressUseCase() {
  const customersRepository = new PrismaCustomersRepository();
  const addressesRepository = new PrismaAddressesRepository();
  const createAddressUseCase = new CreateAddressUseCase(
    addressesRepository,
    customersRepository,
  );

  return createAddressUseCase;
}
