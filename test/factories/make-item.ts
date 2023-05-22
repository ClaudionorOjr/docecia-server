import { Item, ItemProps } from '@commerce/enterprise/entities/item';
import { faker } from '@faker-js/faker';

export function makeItem(override: Partial<ItemProps> = {}, id?: string) {
  const item = Item.create(
    {
      customerId: faker.datatype.uuid(),
      name: faker.lorem.words(2),
      productId: faker.datatype.uuid(),
      quantity: Number(faker.random.numeric()),
      taste: faker.lorem.word(),
      unitPriceInCents: Number(faker.commerce.price(6, 20, 0)) * 100,
      ...override,
    },
    id,
  );

  return item;
}
