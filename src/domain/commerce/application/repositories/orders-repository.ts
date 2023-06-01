import { Order } from '@commerce/enterprise/entities/order';

export interface OrdersRepository {
  create(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findManyByCustomerId(customerId: string): Promise<Order[]>;
  findManyOpenOrdersByCustomerId(customerId: string): Promise<Order[]>;
  list(): Promise<Order[]>;
  save(order: Order): Promise<void>;
}
