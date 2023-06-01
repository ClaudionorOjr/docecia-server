import { CustomersRepository } from '@account/application/repositories/customers-repository';
import { BagItemsRepository } from '../repositories/bag-items-repository';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { DessertsRepository } from '@menu/application/repositories/desserts-repository';
import { NotAllowedError } from '@account/application/use-cases/errors/not-allowed-error';

interface IncrementBagItemUseCaseRequest {
  customerId: string;
  itemId: string;
}

interface IncrementBagItemUseCaseResponse {}

export class IncrementBagItemUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private bagItemsRepository: BagItemsRepository,
    private dessertsRepository: DessertsRepository,
  ) {}

  async execute({
    customerId,
    itemId,
  }: IncrementBagItemUseCaseRequest): Promise<IncrementBagItemUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId);
    const item = await this.bagItemsRepository.findById(itemId);

    if (!customer) {
      throw new ResourceNotFoundError();
    }
    if (!item) {
      throw new ResourceNotFoundError();
    }

    if (customerId !== item.customerId) {
      throw new NotAllowedError();
    }

    const dessert = await this.dessertsRepository.findById(item.productId);

    if (!dessert) {
      throw new ResourceNotFoundError();
    }

    if (item.quantity >= dessert.amount) {
      throw new Error('Exceeded quantity.');
    }

    item.quantityIncrement();

    await this.bagItemsRepository.save(item);

    return {};
  }
}
