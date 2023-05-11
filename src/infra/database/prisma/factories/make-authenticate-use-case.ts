import { PrismaCustomersRepository } from '@database/prisma/repositories/prisma-customers-repository';
import { AuthenticateUseCase } from '../../../../domain/account/application/use-cases/authenticate';

export function makeAuthenticateUseCase() {
  const customersRepository = new PrismaCustomersRepository();
  const authenticateUseCase = new AuthenticateUseCase(customersRepository);

  return authenticateUseCase;
}
