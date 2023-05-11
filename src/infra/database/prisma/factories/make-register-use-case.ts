import { PrismaCustomersRepository } from '@database/prisma/repositories/prisma-customers-repository';
import { RegisterUseCase } from '../../../../domain/account/application/use-cases/register';

export function makeRegisterUseCase() {
  const customersRepository = new PrismaCustomersRepository();
  const registerUseCase = new RegisterUseCase(customersRepository);

  return registerUseCase;
}
