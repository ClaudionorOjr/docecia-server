import { Customer } from '@domain/entities/customer';
import { CustomersRepository } from '@domain/repositories/customers-repository';
import { compare } from 'bcryptjs';

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
      throw new Error('Invalid credentials!');
    }

    const doesPasswordMatches = await compare(password, customer.passwordHash);

    if (!doesPasswordMatches) {
      throw new Error('Invalid credentilas!');
    }

    return { customer };
  }
}
