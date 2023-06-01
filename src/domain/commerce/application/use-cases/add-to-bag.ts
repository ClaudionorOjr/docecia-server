import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { Item } from '@commerce/enterprise/entities/item';
import { DessertsRepository } from '@menu/application/repositories/desserts-repository';
import { BagItemsRepository } from '../repositories/bag-items-repository';
import { CustomersRepository } from '@account/application/repositories/customers-repository';

interface AddToBagUseCaseRequest {
  customerId: string;
  dessertId: string;
  quantity: number;
}
interface AddToBagUseCaseResponse {}

export class AddToBagUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private bagItemsRepository: BagItemsRepository,
    private dessertsRepository: DessertsRepository,
  ) {}

  async execute({
    customerId,
    dessertId,
    quantity,
  }: AddToBagUseCaseRequest): Promise<AddToBagUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId);
    const dessert = await this.dessertsRepository.findById(dessertId);

    if (!customer) {
      throw new ResourceNotFoundError();
    }

    if (!dessert) {
      throw new ResourceNotFoundError();
    }

    if (!dessert.available) {
      throw new Error('Not available.');
    }

    if (quantity > dessert.amount) {
      throw new Error('Exceeded quantity.');
    }

    const itemAlreadyExistsInBag =
      await this.bagItemsRepository.findOpenItemByProductAndCustomerId(
        dessertId,
        customerId,
      );

    if (itemAlreadyExistsInBag) {
      if (itemAlreadyExistsInBag.quantity + quantity > dessert.amount) {
        throw new Error('Exceeded quantity.');
      }

      itemAlreadyExistsInBag.quantityIncrement(quantity);

      await this.bagItemsRepository.save(itemAlreadyExistsInBag);
    } else {
      const item = Item.create({
        customerId,
        productId: dessert.id,
        name: dessert.name,
        taste: dessert.taste,
        unitPriceInCents: dessert.unitPriceInCents,
        quantity,
      });

      await this.bagItemsRepository.add(item);
    }

    return {};
  }
}
