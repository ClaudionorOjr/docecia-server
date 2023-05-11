import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { DessertsRepository } from '../repositories/desserts-repository';

interface EditDessertUseCaseRequest {
  dessertId: string;
  name?: string;
  taste?: string;
  unitPrice?: number;
  amount?: number;
}

interface EditDessertUseCaseResponse {}

export class EditDessertUseCase {
  constructor(private dessertsRepository: DessertsRepository) {}

  async execute({
    dessertId,
    name,
    taste,
    amount,
    unitPrice,
  }: EditDessertUseCaseRequest): Promise<EditDessertUseCaseResponse> {
    const dessert = await this.dessertsRepository.findById(dessertId);

    if (!dessert) {
      throw new ResourceNotFoundError();
    }

    const unitPriceInCents = unitPrice ? unitPrice * 100 : unitPrice;

    dessert.name = name ?? dessert.name;
    dessert.taste = taste ?? dessert.taste;
    dessert.unitPriceInCents = unitPriceInCents ?? dessert.unitPriceInCents;
    dessert.amount = amount ?? dessert.amount;

    await this.dessertsRepository.save(dessert);

    return {};
  }
}
