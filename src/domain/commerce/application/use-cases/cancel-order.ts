import { Order } from '@commerce/enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { CustomersRepository } from '@account/application/repositories/customers-repository';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { BagItemsRepository } from '../repositories/bag-items-repository';
import { DessertsRepository } from '@menu/application/repositories/desserts-repository';
import { NotAllowedError } from '@account/application/use-cases/errors/not-allowed-error';

interface CancelOrderUseCaseRequest {
  customerId: string;
  orderId: string;
}

interface CancelOrderUseCaseResponse {
  order: Order;
}

export class CancelOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private customersRepository: CustomersRepository,
    private bagItemsRepository: BagItemsRepository,
    private dessertsRepository: DessertsRepository,
  ) {}

  async execute({
    customerId,
    orderId,
  }: CancelOrderUseCaseRequest): Promise<CancelOrderUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId);
    const order = await this.ordersRepository.findById(orderId);
    const items = await this.bagItemsRepository.findManyByOrderId(orderId);

    if (!customer) {
      throw new ResourceNotFoundError();
    }

    if (!order) {
      throw new ResourceNotFoundError();
    }

    if (customerId !== order.customerId) {
      throw new NotAllowedError();
    }

    if (order.deliveredAt) {
      throw new NotAllowedError();
    }

    order.cancel();

    await this.ordersRepository.save(order);

    for await (const item of items) {
      const dessert = await this.dessertsRepository.findById(item.productId);

      if (dessert) {
        dessert.refundAmount(item.quantity);

        await this.dessertsRepository.save(dessert);
      }
    }

    return { order };
  }
}
