import { Customer } from '@domain/entities/customer';
import { CustomersRepository } from '@domain/repositories/customers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetProfileUseCaseRequest {
  customerId: string;
}
interface GetProfileUseCaseResponse {
  customer: Customer;
}

export class GetProfileUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    customerId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      throw new ResourceNotFoundError();
    }

    return { customer };
  }
}
