import { Order } from '@commerce/enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';

interface HistoryCustomerOrdersUseCaseRequest {
  customerId: string;
}

interface HistoryCustomerOrdersUseCaseResponse {
  orders: Order[];
}

export class HistoryCustomerOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    customerId,
  }: HistoryCustomerOrdersUseCaseRequest): Promise<HistoryCustomerOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByCustomerId(customerId);

    return { orders };
  }
}
