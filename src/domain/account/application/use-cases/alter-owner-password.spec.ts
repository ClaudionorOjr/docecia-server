import { beforeEach, describe, expect, it } from 'vitest';
import { AlterOwnerPasswordUseCase } from './alter-owner-password';
import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository';
import { makeOwner } from 'test/factories/makeOwner';
import { compare, hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let ownerRepository: InMemoryOwnerRepository;
let sut: AlterOwnerPasswordUseCase;

describe('Alter Owner Password Use Case', () => {
  beforeEach(() => {
    ownerRepository = new InMemoryOwnerRepository();
    sut = new AlterOwnerPasswordUseCase(ownerRepository);
  });

  it('should be able to alter owner password', async () => {
    await ownerRepository.create(
      await makeOwner(
        {
          passwordHash: await hash('123456', 6),
        },
        'owner-1',
      ),
    );

    await sut.execute({
      ownerId: 'owner-1',
      password: '123456',
      newPassword: '123123',
    });

    const newPasswordHash = ownerRepository.owner?.passwordHash;

    const isNewPasswordHashed = await compare('123123', newPasswordHash!);

    expect(isNewPasswordHashed).toBeTruthy();
  });

  it('should not be able to alter password a non-existing owner', async () => {
    await expect(() =>
      sut.execute({
        ownerId: 'owner-1',
        password: '121212',
        newPassword: '122333',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to alter password when wrong password is passed', async () => {
    const owner = await makeOwner(
      {
        passwordHash: await hash('123456', 6),
      },
      'owner-1',
    );

    await ownerRepository.create(owner);

    await expect(() =>
      sut.execute({
        ownerId: 'owner-1',
        password: '121212',
        newPassword: '122333',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
