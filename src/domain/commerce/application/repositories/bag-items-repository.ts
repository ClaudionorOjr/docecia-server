import { Item } from '@commerce/enterprise/entities/item';

export interface BagItemsRepository {
  add(item: Item): Promise<void>;
  findById(id: string): Promise<Item | null>;
  findManyByOrderId(orderId: string): Promise<Item[]>;
  findOpenItemByProductAndCustomerId(
    productId: string,
    customerId: string,
  ): Promise<Item | null>;
  findManyOpenItemsByCustomerId(customerId: string): Promise<Item[]>;
  remove(id: string): Promise<void>;
  save(item: Item): Promise<void>;
}
