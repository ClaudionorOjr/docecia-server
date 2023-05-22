import { CustomersRepository } from '@account/application/repositories/customers-repository';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { BagItemsRepository } from '../repositories/bag-items-repository';

interface DecrementBagItemUseCaseRequest {
  customerId: string;
  itemId: string;
}

interface DecrementBagItemUseCaseResponse {}

export class DecrementBagItemUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private bagItemsRepository: BagItemsRepository,
  ) {}

  async execute({
    customerId,
    itemId,
  }: DecrementBagItemUseCaseRequest): Promise<DecrementBagItemUseCaseResponse> {
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

    if (item.quantity > 1) {
      item.quantityDecrement();
    } else {
      await this.bagItemsRepository.remove(itemId);
    }

    await this.bagItemsRepository.save(item);

    return {};
  }
}
