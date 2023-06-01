import { Item } from '@commerce/enterprise/entities/item';
import { BagItemsRepository } from '../repositories/bag-items-repository';

interface FetchBagItemsUseCaseRequest {
  customerId: string;
}

interface FetchBagItemsUseCaseResponse {
  items: Item[];
}

export class FetchBagItemsUseCase {
  constructor(private bagItemsRepository: BagItemsRepository) {}

  async execute({
    customerId,
  }: FetchBagItemsUseCaseRequest): Promise<FetchBagItemsUseCaseResponse> {
    const items = await this.bagItemsRepository.findManyOpenItemsByCustomerId(
      customerId,
    );

    return { items };
  }
}
