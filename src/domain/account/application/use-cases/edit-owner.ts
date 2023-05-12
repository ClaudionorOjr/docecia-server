import { OwnerRepository } from '../repositories/owner-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface EditOwnerUseCaseRequest {
  ownerId: string;
  name: string;
}

interface EditOwnerUseCaseResponse {}

export class EditOwnerUseCase {
  constructor(private ownerRepository: OwnerRepository) {}

  async execute({
    ownerId,
    name,
  }: EditOwnerUseCaseRequest): Promise<EditOwnerUseCaseResponse> {
    const owner = await this.ownerRepository.findById(ownerId);

    if (!owner) {
      throw new ResourceNotFoundError();
    }

    owner.name = name;

    await this.ownerRepository.save(owner);
    return {};
  }
}
