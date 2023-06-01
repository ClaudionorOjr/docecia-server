import { OrdersRepository } from '@commerce/application/repositories/orders-repository';
import { Order } from '@commerce/enterprise/entities/order';

export class InMemoryOrdersRepository implements OrdersRepository {
  public orders: Order[] = [];

  async create(order: Order) {
    this.orders.push(order);
  }

  async findById(id: string) {
    const order = this.orders.find((item) => item.id === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async findManyByCustomerId(customerId: string) {
    const orders = this.orders.filter((item) => item.customerId === customerId);

    return orders;
  }

  async findManyOpenOrdersByCustomerId(customerId: string) {
    const orders = this.orders.filter(
      (item) => item.customerId === customerId && item.status === 'PENDING',
    );

    return orders;
  }

  async list() {
    return this.orders;
  }

  async save(order: Order) {
    const orderIndex = this.orders.findIndex((item) => item.id === order.id);

    this.orders[orderIndex] = order;
  }
}
