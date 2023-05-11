import { Address } from '@account/enterprise/entities/address';
import { AddressesRepository } from '@account/application/repositories/addresses-repository';
import { CustomersRepository } from '@account/application/repositories/customers-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CreateAddressUseCaseRequest {
  customerId: string;
  street: string;
  addressNumber: number;
  city: string;
  addressComplement?: string;
}

interface CreateAddressUseCaseResponse {
  address: Address;
}

export class CreateAddressUseCase {
  constructor(
    private addressesRepository: AddressesRepository,
    private customersRepository: CustomersRepository,
  ) {}

  async execute({
    customerId,
    street,
    addressNumber,
    city,
    addressComplement,
  }: CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      throw new ResourceNotFoundError();
    }

    const address = Address.create({
      customerId,
      street,
      addressNumber,
      city,
      addressComplement,
    });

    await this.addressesRepository.create(address);

    return { address };
  }
}
