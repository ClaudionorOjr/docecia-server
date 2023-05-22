import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateOwnerUseCase } from './authenticate-owner';
import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository';
import { makeOwner } from 'test/factories/make-owner';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let ownerRepository: InMemoryOwnerRepository;
let sut: AuthenticateOwnerUseCase;

describe('Authenticate Owner Use Case', () => {
  beforeEach(() => {
    ownerRepository = new InMemoryOwnerRepository();
    sut = new AuthenticateOwnerUseCase(ownerRepository);
  });

  it('should be able to authenticate owner', async () => {
    await ownerRepository.create(
      await makeOwner({
        email: 'joannedoe@example.com',
        passwordHash: await hash('123456', 6),
      }),
    );

    const { owner } = await sut.execute({
      email: 'joannedoe@example.com',
      password: '123456',
    });

    expect(owner).toMatchObject({ id: expect.any(String) });
  });

  it('should not be able to authenticate owner with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'joannedoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate owner with wrong password', async () => {
    await ownerRepository.create(
      await makeOwner({
        email: 'joannedoe@example.com',
        passwordHash: await hash('123456', 6),
      }),
    );

    await expect(() =>
      sut.execute({
        email: 'joannedoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
