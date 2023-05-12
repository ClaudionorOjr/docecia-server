import { Owner } from '@account/enterprise/entities/owner';
import { OwnerRepository } from '../repositories/owner-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists';
import { hash } from 'bcryptjs';

interface RegisterOwnerUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterOwnerUseCaseResponse {}

export class RegisterOwnerUseCase {
  constructor(private ownerRepository: OwnerRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterOwnerUseCaseRequest): Promise<RegisterOwnerUseCaseResponse> {
    const ownerWithSameEmail = await this.ownerRepository.findByEmail(email);

    if (ownerWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await hash(password, 6);

    const owner = Owner.create({
      name,
      email,
      passwordHash,
    });

    await this.ownerRepository.create(owner);

    return {};
  }
}
