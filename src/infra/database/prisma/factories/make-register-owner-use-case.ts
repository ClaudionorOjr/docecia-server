import { RegisterOwnerUseCase } from '@account/application/use-cases/register-owner';
import { PrismaOwnerRepository } from '../repositories/prisma-owner-repository';

export function makeRegisterOwnerUseCase() {
  const ownerRepository = new PrismaOwnerRepository();
  const registerOwner = new RegisterOwnerUseCase(ownerRepository);

  return registerOwner;
}
