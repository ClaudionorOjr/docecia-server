import { AddressesRepository } from '@account/application/repositories/addresses-repository';
import { Address } from '@account/enterprise/entities/address';

interface FetchAddressesUseCaseRequest {
  customerId: string;
}

interface FetchAddressesUseCaseResponse {
  addresses: Address[];
}

export class FetchAddressesUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({
    customerId,
  }: FetchAddressesUseCaseRequest): Promise<FetchAddressesUseCaseResponse> {
    const addresses = await this.addressesRepository.findManyByCustomerId(
      customerId,
    );

    return { addresses };
  }
}
