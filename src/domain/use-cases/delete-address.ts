import { AddressesRepository } from '@domain/repositories/addresses-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

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
      throw new Error('Not allowed.');
    }

    await this.addressesRepository.delete(address.id);

    return {};
  }
}
