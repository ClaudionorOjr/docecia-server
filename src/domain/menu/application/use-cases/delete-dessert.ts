import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { DessertsRepository } from '../repositories/desserts-repository';

interface DeleteDessertUseCaseRequest {
  dessertId: string;
}

interface DeleteDessertUseCaseResponse {}

export class DeleteDessertUseCase {
  constructor(private dessertsRepository: DessertsRepository) {}

  async execute({
    dessertId,
  }: DeleteDessertUseCaseRequest): Promise<DeleteDessertUseCaseResponse> {
    const dessert = await this.dessertsRepository.findById(dessertId);

    if (!dessert) {
      throw new ResourceNotFoundError();
    }

    await this.dessertsRepository.delete(dessertId);

    return {};
  }
}
