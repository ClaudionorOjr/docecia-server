import { Dessert } from '../../enterprise/enities/dessert';
import { DessertsRepository } from '../repositories/desserts-repository';

interface CreateDessertUseCaseRequest {
  name: string;
  taste: string;
  unitPrice: number;
  amount: number;
}

interface CreateDessertUseCaseResponse {}

export class CreateDessertUseCase {
  constructor(private dessertsRepository: DessertsRepository) {}

  async execute({
    name,
    taste,
    amount,
    unitPrice,
  }: CreateDessertUseCaseRequest): Promise<CreateDessertUseCaseResponse> {
    const unitPriceInCents = unitPrice * 100;
    const dessert = Dessert.create({ name, taste, amount, unitPriceInCents });

    await this.dessertsRepository.create(dessert);

    return {};
  }
}
