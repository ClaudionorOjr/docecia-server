import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { DessertsRepository } from '../repositories/desserts-repository';

interface ToggleAvailabilityUseCaseRequest {
  dessertId: string;
}

interface ToggleAvailabilityUseCaseResponse {}

export class ToggleAvailabilityUseCase {
  constructor(private dessertsRepository: DessertsRepository) {}

  async execute({
    dessertId,
  }: ToggleAvailabilityUseCaseRequest): Promise<ToggleAvailabilityUseCaseResponse> {
    const dessert = await this.dessertsRepository.findById(dessertId);

    if (!dessert) {
      throw new ResourceNotFoundError();
    }

    dessert.toggleAvailability();

    await this.dessertsRepository.save(dessert);

    return {};
  }
}
