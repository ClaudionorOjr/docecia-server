import { AddressesRepository } from '@account/application/repositories/addresses-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

interface DeleteAddressUseCaseRequest {
  addressId: string;
  customerId: string;
}

interface DeleteAddressUseCaseResponse {}

export class DeleteAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({
    addressId,
    customerId,
  }: DeleteAddressUseCaseRequest): Promise<DeleteAddressUseCaseResponse> {
    const address = await this.addressesRepository.findById(addressId);

    if (!address) {
      throw new ResourceNotFoundError();
    }

    if (customerId !== address.customerId) {
      throw new NotAllowedError();
    }

    await this.addressesRepository.delete(address.id);

    return {};
  }
}
