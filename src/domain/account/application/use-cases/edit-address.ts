import { AddressesRepository } from '@account/application/repositories/addresses-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface EditAddressUseCaseRequest {
  addressId: string;
  customerId: string;
  street?: string;
  addressNumber?: number;
  city?: string;
  addressComplement?: string | null;
}

interface EditAddressUseCaseResponse {}

export class EditAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({
    addressId,
    customerId,
    street,
    addressNumber,
    city,
    addressComplement,
  }: EditAddressUseCaseRequest): Promise<EditAddressUseCaseResponse> {
    const address = await this.addressesRepository.findById(addressId);

    if (!address) {
      throw new ResourceNotFoundError();
    }

    if (customerId !== address.customerId) {
      throw new Error('Not allowed.');
    }

    address.street = street ?? address.street;
    address.addressNumber = addressNumber ?? address.addressNumber;
    address.city = city ?? address.city;
    address.addressComplement = addressComplement ?? address.addressComplement;

    await this.addressesRepository.save(address);
    return {};
  }
}
