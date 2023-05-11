import { Dessert } from '../../enterprise/enities/dessert';
import { DessertsRepository } from '../repositories/desserts-repository';

interface FetchAvailableDessertsResponse {
  desserts: Dessert[];
}

export class FetchAvailableDesserts {
  constructor(private dessertsRepository: DessertsRepository) {}

  async execute(): Promise<FetchAvailableDessertsResponse> {
    const desserts = await this.dessertsRepository.findManyAvailable();

    return { desserts };
  }
}
