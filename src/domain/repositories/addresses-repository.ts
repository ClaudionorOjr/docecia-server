import { Address } from '@domain/entities/address';

export interface AddressesRepository {
  create(address: Address): Promise<void>;
}
