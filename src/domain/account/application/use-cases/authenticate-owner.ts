import { compare } from 'bcryptjs';
import { OwnerRepository } from '../repositories/owner-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { Owner } from '@account/enterprise/entities/owner';

interface AuthenticateOwnerUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateOwnerUseCaseResponse {
  owner: Owner;
}

export class AuthenticateOwnerUseCase {
  constructor(private ownerRepository: OwnerRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateOwnerUseCaseRequest): Promise<AuthenticateOwnerUseCaseResponse> {
    const owner = await this.ownerRepository.findByEmail(email);

    if (!owner) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, owner.passwordHash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { owner };
  }
}
