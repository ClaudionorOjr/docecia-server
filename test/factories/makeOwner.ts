import { Owner, OwnerProps } from '@account/enterprise/entities/owner';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

export async function makeOwner(
  override: Partial<OwnerProps> = {},
  id?: string,
) {
  const owner = Owner.create(
    {
      name: faker.name.fullName({ sex: 'female' }),
      email: faker.internet.exampleEmail(),
      passwordHash: await hash(faker.random.alphaNumeric(6), 6),
      ...override,
    },
    id,
  );

  return owner;
}
