import { Dessert } from '../../enterprise/enities/dessert';
import { DessertsRepository } from '../repositories/desserts-repository';

interface FetchAllDessertsResponse {
  desserts: Dessert[];
}

export class FetchAllDesserts {
  constructor(private dessertsRepository: DessertsRepository) {}

  async execute(): Promise<FetchAllDessertsResponse> {
    const desserts = await this.dessertsRepository.findAll();

    return { desserts };
  }
}
