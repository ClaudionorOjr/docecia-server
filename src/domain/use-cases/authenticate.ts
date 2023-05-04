import { Customer } from '@domain/entities/customer';
import { CustomersRepository } from '@domain/repositories/customers-repository';
import { compare } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  customer: Customer;
}

export class AuthenticateUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const customer = await this.customersRepository.findByEmail(email);

    if (!customer) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, customer.passwordHash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { customer };
  }
}
