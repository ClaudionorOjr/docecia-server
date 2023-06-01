import { CustomersRepository } from '@account/application/repositories/customers-repository';
import { OrdersRepository } from '../repositories/orders-repository';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { NotAllowedError } from '@account/application/use-cases/errors/not-allowed-error';
import { AddressesRepository } from '@account/application/repositories/addresses-repository';

interface EditOrderUseCaseRequest {
  customerId: string;
  orderId: string;
  pickupLocal?: boolean;
  addressId?: string;
  payment?: string;
  note?: string;
}

interface EditOrderUseCaseResponse {}

export class EditOrderUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private ordersRepository: OrdersRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    customerId,
    orderId,
    pickupLocal,
    addressId,
    payment,
    note,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId);
    const order = await this.ordersRepository.findById(orderId);

    if (!customer) {
      throw new ResourceNotFoundError();
    }

    if (!order) {
      throw new ResourceNotFoundError();
    }

    if (customerId !== order.customerId) {
      throw new NotAllowedError();
    }

    if (order.status !== 'PENDING') {
      throw new NotAllowedError();
    }

    if (addressId) {
      const address = await this.addressesRepository.findById(addressId);

      if (!address) {
        throw new ResourceNotFoundError();
      }

      if (customerId !== address.customerId) {
        throw new NotAllowedError();
      }

      order.addressId = addressId;
      order.pickupLocal = !order.pickupLocal;
    }

    if (pickupLocal) {
      order.pickupLocal = pickupLocal;
      order.addressId = undefined;
    }

    order.payment = payment ?? order.payment;
    order.note = note ?? order.note;

    await this.ordersRepository.save(order);

    return {};
  }
}
