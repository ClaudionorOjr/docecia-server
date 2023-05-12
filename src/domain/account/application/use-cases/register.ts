import { Customer } from '@account/enterprise/entities/customer';
import { CustomersRepository } from '@account/application/repositories/customers-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists';

interface RegisterUseCaseRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
}

interface RegisterUseCaseResponse {}

export class RegisterUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    name,
    surname,
    email,
    password,
    phone,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const passwordHash = await hash(password, 6);

    const customerWithSameEmail = await this.customersRepository.findByEmail(
      email,
    );

    if (customerWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const customer = Customer.create({
      name,
      surname,
      email,
      passwordHash,
      phone,
    });

    await this.customersRepository.create(customer);

    return {};
  }
}
