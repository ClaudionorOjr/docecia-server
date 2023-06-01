import { Dessert } from '../../enterprise/enities/dessert';
import { DessertsRepository } from '../repositories/desserts-repository';

interface FetchAllDessertsUseCaseResponse {
  desserts: Dessert[];
}

export class FetchAllDessertsUseCase {
  constructor(private dessertsRepository: DessertsRepository) {}

  async execute(): Promise<FetchAllDessertsUseCaseResponse> {
    const desserts = await this.dessertsRepository.list();

    return { desserts };
  }
}
