import { OwnerRepository } from '@account/application/repositories/owner-repository';
import { Owner } from '@account/enterprise/entities/owner';

export class InMemoryOwnerRepository implements OwnerRepository {
  public owner: Owner | undefined;

  async create(owner: Owner) {
    this.owner = owner;
  }

  async findByEmail(email: string) {
    const owner = this.owner?.email === email ? this.owner : null;

    return owner;
  }

  async findById(id: string) {
    const owner = this.owner?.id === id ? this.owner : null;

    return owner;
  }

  async save(owner: Owner) {
    this.owner = owner;
  }
}
