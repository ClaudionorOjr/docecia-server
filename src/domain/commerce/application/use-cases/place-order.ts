import { BagItemsRepository } from '../repositories/bag-items-repository';
import { OrdersRepository } from '../repositories/orders-repository';
import { CustomersRepository } from '@account/application/repositories/customers-repository';
import { DessertsRepository } from '@menu/application/repositories/desserts-repository';
import { AddressesRepository } from '@account/application/repositories/addresses-repository';
import { Order } from '@commerce/enterprise/entities/order';
import { Item } from '@commerce/enterprise/entities/item';
import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';

interface PlaceOrderUseCaseRequest {
  customerId: string;
  payment: string;
  pickupLocal: boolean;
  addressId?: string;
  note?: string;
}

interface PlaceOrderUseCaseResponse {
  order: Order;
}

function totalPriceInCents(items: Item[]) {
  return items.reduce((accumulator, item) => {
    return accumulator + item.subtotal;
  }, 0);
}

export class PlaceOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private customersRepository: CustomersRepository,
    private bagItemsRepository: BagItemsRepository,
    private dessertsRepository: DessertsRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    customerId,
    payment,
    pickupLocal,
    addressId,
    note,
  }: PlaceOrderUseCaseRequest): Promise<PlaceOrderUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId);
    const items = await this.bagItemsRepository.findManyOpenItemsByCustomerId(
      customerId,
    );

    if (!customer) {
      throw new ResourceNotFoundError();
    }

    if (items.length === 0) {
      throw new ResourceNotFoundError();
    }

    let address;
    if (!pickupLocal) {
      address = await this.addressesRepository.findById(addressId!);

      if (!address) {
        throw new ResourceNotFoundError();
      }
    } else {
      addressId = undefined;
    }

    const order = Order.create({
      customerId,
      payment,
      pickupLocal,
      addressId,
      note,
      totalPriceInCents: totalPriceInCents(items),
    });

    const processedItems: Item[] = [];
    try {
      for await (const item of items) {
        const dessert = await this.dessertsRepository.findById(item.productId);

        if (!dessert || !dessert.available) {
          throw new ResourceNotFoundError();
        }

        if (dessert.amount < item.quantity) {
          throw new Error('Exceeded quantity.');
        }

        dessert.subtractAmount(item.quantity);
        await this.dessertsRepository.save(dessert);

        item.orderId = order.id;
        await this.bagItemsRepository.save(item);

        processedItems.push(item);
      }

      await this.ordersRepository.create(order);

      return { order };
    } catch (error) {
      /* 
        Funciona como um roolback.
        Desfaz as alterações nos outros itens que tiveram sucesso, caso algum dos itens da sacola retorne erro. 
      */
      for await (const item of processedItems) {
        const dessert = await this.dessertsRepository.findById(item.productId);

        if (dessert) {
          dessert.refundAmount(item.quantity);
          await this.dessertsRepository.save(dessert);
        }

        item.orderId = undefined;
        await this.bagItemsRepository.save(item);
      }

      return Promise.reject(error);
    }
  }
}
