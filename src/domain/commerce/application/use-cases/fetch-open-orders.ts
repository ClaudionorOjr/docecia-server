import { Order } from '@commerce/enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';

interface FetchOpenOrdersUseCaseRequest {
  customerId: string;
}

interface FetchOpenOrdersUseCaseResponse {
  orders: Order[];
}

export class FetchOpenOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    customerId,
  }: FetchOpenOrdersUseCaseRequest): Promise<FetchOpenOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyOpenOrdersByCustomerId(
      customerId,
    );

    return { orders };
  }
}
