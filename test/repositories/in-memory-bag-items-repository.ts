import { BagItemsRepository } from '@commerce/application/repositories/bag-items-repository';
import { Item } from '@commerce/enterprise/entities/item';

export class InMemoryBagItemsRepository implements BagItemsRepository {
  // ! TALVEZ DEVA SER MELHOR ALTERAR O NOME DO ARRAY PARA NÃO GERAR CONFUSÃO
  public bag: Item[] = [];

  async add(item: Item) {
    this.bag.push(item);
  }

  async findById(id: string) {
    const item = this.bag.find((item) => item.id === id);

    if (!item) {
      return null;
    }

    return item;
  }

  async findManyByOrderId(orderId: string) {
    const items = this.bag.filter((item) => item.orderId === orderId);

    return items;
  }

  async findOpenItemByProductAndCustomerId(
    productId: string,
    customerId: string,
  ) {
    const product = this.bag.find(
      (item) =>
        item.productId === productId &&
        item.customerId === customerId &&
        !item.orderId,
    );

    if (!product) {
      return null;
    }

    return product;
  }

  async findManyOpenItemsByCustomerId(customerId: string) {
    const items = this.bag.filter(
      (item) => item.customerId === customerId && !item.orderId,
    );

    return items;
  }

  async remove(id: string) {
    const itemIndex = this.bag.findIndex((item) => item.id === id);

    this.bag.splice(itemIndex, 1);
  }

  async save(item: Item) {
    const itemIndex = this.bag.findIndex((bagItem) => item.id === bagItem.id);

    this.bag[itemIndex] = item;
  }
}
