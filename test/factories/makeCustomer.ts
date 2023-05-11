import { Customer, CustomerProps } from '@account/enterprise/entities/customer';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

export async function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: string,
) {
  const customer = Customer.create(
    {
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      email: faker.internet.exampleEmail(),
      passwordHash: await hash(faker.random.alphaNumeric(), 6),
      phone: faker.phone.number('(##) 9####-####'),
      ...override,
    },
    id,
  );

  return customer;
}
