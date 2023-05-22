import { Item } from '@commerce/enterprise/entities/item';

export interface BagItemsRepository {
  add(item: Item): Promise<void>;
  findById(id: string): Promise<Item | null>;
  findByProductAndCustomerId(
    productId: string,
    customerId: string,
  ): Promise<Item | null>;
  remove(id: string): Promise<void>;
  save(item: Item): Promise<void>;
}
