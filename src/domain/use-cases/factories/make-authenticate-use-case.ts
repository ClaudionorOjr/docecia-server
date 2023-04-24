import { PrismaCustomersRepository } from '@infra/database/prisma/repositories/prisma-customers-repository';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase() {
  const customersRepository = new PrismaCustomersRepository();
  const authenticateUseCase = new AuthenticateUseCase(customersRepository);

  return authenticateUseCase;
}
