import { OwnerRepository } from '@account/application/repositories/owner-repository';
import { OrdersRepository } from '../repositories/orders-repository';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';

interface MarkAsDeliveredUseCaseRequest {
  ownerId: string;
  orderId: string;
}

interface MarkAsDeliveredUseCaseReseponse {}

export class MarkAsDeliveredUseCase {
  constructor(
    private ownerRepository: OwnerRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    ownerId,
    orderId,
  }: MarkAsDeliveredUseCaseRequest): Promise<MarkAsDeliveredUseCaseReseponse> {
    const owner = await this.ownerRepository.findById(ownerId);
    const order = await this.ordersRepository.findById(orderId);

    if (!owner) {
      throw new ResourceNotFoundError();
    }

    if (!order) {
      throw new ResourceNotFoundError();
    }

    order.markAsDelivered();
    await this.ordersRepository.save(order);

    return {};
  }
}
