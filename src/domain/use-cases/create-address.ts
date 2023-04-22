import { Address } from '@/domain/entities/address';
import { AddressesRepository } from '@/domain/repositories/addresses-repository';
import { CustomersRepository } from '@/domain/repositories/customers-repository';

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
      throw new Error('Invalid user.');
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
