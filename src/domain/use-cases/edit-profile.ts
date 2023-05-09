import { CustomersRepository } from '@domain/repositories/customers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface EditProfileUseCaseRequest {
  customerId: string;
  name?: string;
  surname?: string;
  phone?: string;
}

interface EditProfileUseCaseResponse {}

export class EditProfileUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    customerId,
    name,
    surname,
    phone,
  }: EditProfileUseCaseRequest): Promise<EditProfileUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      throw new ResourceNotFoundError();
    }

    customer.name = name ?? customer.name;
    customer.surname = surname ?? customer.surname;
    customer.phone = phone ?? customer.phone;

    await this.customersRepository.save(customer);

    return {};
  }
}
