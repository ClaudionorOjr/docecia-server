import { CustomersRepository } from '@domain/repositories/customers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { compare, hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AlterPasswordUseCaseRequest {
  customerId: string;
  password: string;
  newPassword: string;
}

interface AlterPasswordUseCaseResponse {}

export class AlterPasswordUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    customerId,
    password,
    newPassword,
  }: AlterPasswordUseCaseRequest): Promise<AlterPasswordUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      throw new ResourceNotFoundError();
    }

    const doesPasswordMatches = await compare(password, customer.passwordHash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    const newPasswordHash = await hash(newPassword, 6);

    customer.passwordHash = newPasswordHash;

    await this.customersRepository.save(customer);

    return {};
  }
}
