import { Order } from '@commerce/enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';

interface FetchAllOrdersUseCaseResponse {
  orders: Order[];
}

export class FetchAllOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<FetchAllOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.list();

    return { orders };
  }
}
