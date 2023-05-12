import { beforeEach, describe, expect, it } from 'vitest';
import { EditOwnerUseCase } from './edit-owner';
import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository';
import { makeOwner } from 'test/factories/makeOwner';

let ownerRepository: InMemoryOwnerRepository;
let sut: EditOwnerUseCase;

describe('Edit Owner Use Case', () => {
  beforeEach(() => {
    ownerRepository = new InMemoryOwnerRepository();
    sut = new EditOwnerUseCase(ownerRepository);
  });

  it('should be able to edit a owner data', async () => {
    await ownerRepository.create(await makeOwner({}, 'owner-1'));

    await sut.execute({ ownerId: 'owner-1', name: 'Joanne Doe' });

    expect(ownerRepository.owner).toMatchObject({ name: 'Joanne Doe' });
  });
});
