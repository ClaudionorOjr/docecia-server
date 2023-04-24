import { PrismaCustomersRepository } from '@infra/database/prisma/repositories/prisma-customers-repository';
import { RegisterUseCase } from '../register';

export function makeRegisterUseCase() {
  const customersRepository = new PrismaCustomersRepository();
  const registerUseCase = new RegisterUseCase(customersRepository);

  return registerUseCase;
}
