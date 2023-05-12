import { compare, hash } from 'bcryptjs';
import { OwnerRepository } from '../repositories/owner-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AlterOwnerPasswordUseCaseRequest {
  ownerId: string;
  password: string;
  newPassword: string;
}

interface AlterOwnerPasswordUseCaseResponse {}

export class AlterOwnerPasswordUseCase {
  constructor(private ownerRepository: OwnerRepository) {}

  async execute({
    ownerId,
    password,
    newPassword,
  }: AlterOwnerPasswordUseCaseRequest): Promise<AlterOwnerPasswordUseCaseResponse> {
    const owner = await this.ownerRepository.findById(ownerId);

    if (!owner) {
      throw new ResourceNotFoundError();
    }

    const doesPasswordMatches = await compare(password, owner.passwordHash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    const newPasswordHash = await hash(newPassword, 6);

    owner.passwordHash = newPasswordHash;

    await this.ownerRepository.save(owner);

    return {};
  }
}
