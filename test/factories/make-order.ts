import { Order, OrderProps } from '@commerce/enterprise/entities/order';
import { faker } from '@faker-js/faker';

export function makeOrder(override: Partial<OrderProps> = {}, id?: string) {
  const order = Order.create(
    {
      customerId: faker.datatype.uuid(),
      payment: 'CREDIT',
      pickupLocal: false,
      totalPriceInCents: Number(faker.random.numeric(4)),
      addressId: faker.datatype.uuid(),
      note: faker.lorem.words(5),
      ...override,
    },
    id,
  );

  return order;
}
