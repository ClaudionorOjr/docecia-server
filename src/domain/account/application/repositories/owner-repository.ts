import { Owner } from '@account/enterprise/entities/owner';

export interface OwnerRepository {
  create(owner: Owner): Promise<void>;
  findById(id: string): Promise<Owner | null>;
  findByEmail(email: string): Promise<Owner | null>;
  save(owner: Owner): Promise<void>;
}
