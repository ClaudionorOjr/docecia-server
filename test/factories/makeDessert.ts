import { faker } from '@faker-js/faker';
import { Dessert, DessertProps } from '@menu/enterprise/enities/dessert';

export function makeDessert(override: Partial<DessertProps> = {}, id?: string) {
  const dessert = Dessert.create(
    {
      name: faker.lorem.words(2),
      taste: faker.lorem.word(),
      amount: Number(faker.finance.amount(1, 10, 0)),
      unitPriceInCents: Number(faker.commerce.price(10, 60, 0)) * 100,
      ...override,
    },
    id,
  );

  return dessert;
}
