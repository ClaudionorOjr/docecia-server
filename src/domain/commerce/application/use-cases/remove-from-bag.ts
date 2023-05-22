import { CustomersRepository } from '@account/application/repositories/customers-repository';
import { BagItemsRepository } from '../repositories/bag-items-repository';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';

interface RemoveFromBagUseCaseRequest {
  customerId: string;
  itemId: string;
}

interface RemoveFromBagUseCaseResponse {}

export class RemoveFromBagUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private bagItemsRepository: BagItemsRepository,
  ) {}

  async execute({
    customerId,
    itemId,
  }: RemoveFromBagUseCaseRequest): Promise<RemoveFromBagUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId);
    const item = await this.bagItemsRepository.findById(itemId);

    if (!customer) {
      throw new ResourceNotFoundError();
    }

    if (!item) {
      throw new ResourceNotFoundError();
    }

    if (customerId !== item.customerId) {
      throw new Error('Not allowed.');
    }

    await this.bagItemsRepository.remove(itemId);

    return {};
  }
}
