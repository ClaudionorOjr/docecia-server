import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterOwnerUseCase } from './register-owner';
import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository';
import { faker } from '@faker-js/faker';

let ownerRepository: InMemoryOwnerRepository;
let sut: RegisterOwnerUseCase;

describe('Register Owner Use Case', () => {
  beforeEach(() => {
    ownerRepository = new InMemoryOwnerRepository();
    sut = new RegisterOwnerUseCase(ownerRepository);
  });

  it('should be able to register owner', async () => {
    await sut.execute({
      name: faker.name.fullName({ sex: 'female' }),
      email: faker.internet.exampleEmail(),
      password: faker.random.alphaNumeric(6),
    });

    expect(ownerRepository.owner).toMatchObject({ id: expect.any(String) });
  });
});
