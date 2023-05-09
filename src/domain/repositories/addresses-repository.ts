import { Address } from '@domain/entities/address';

export interface AddressesRepository {
  create(address: Address): Promise<void>;
  findById(id: string): Promise<Address | null>;
  findManyByCustomerId(customerId: string): Promise<Address[]>;
  save(address: Address): Promise<void>;
  delete(id: string): Promise<void>;
}
