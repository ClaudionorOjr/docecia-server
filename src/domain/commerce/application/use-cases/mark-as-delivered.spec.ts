import { beforeEach, describe, expect, it } from 'vitest';
import { MarkAsDeliveredUseCase } from './mark-as-delivered';

import { InMemoryOwnerRepository } from 'test/repositories/in-memory-owner-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';

import { makeOwner } from 'test/factories/make-owner';
import { makeOrder } from 'test/factories/make-order';

import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';

let ownerRepository: InMemoryOwnerRepository;
let ordersRepository: InMemoryOrdersRepository;
let sut: MarkAsDeliveredUseCase;
describe('Mark as Delivered Use Case', () => {
  beforeEach(() => {
    ownerRepository = new InMemoryOwnerRepository();
    ordersRepository = new InMemoryOrdersRepository();
    sut = new MarkAsDeliveredUseCase(ownerRepository, ordersRepository);
  });

  it('should be able to mark an order as delivered', async () => {
    await ownerRepository.create(await makeOwner({}, 'owner-1'));
    await ordersRepository.create(makeOrder({}, 'order-1'));

    await sut.execute({ ownerId: 'owner-1', orderId: 'order-1' });

    expect(ordersRepository.orders).toEqual([
      expect.objectContaining({ deliveredAt: expect.any(Date) }),
    ]);
  });

  it('should not be able a non-existent owner to mark an order as delivered', async () => {
    await expect(() =>
      sut.execute({ ownerId: 'owner-1', orderId: 'order-1' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to mark a non-existent order as delivered', async () => {
    await ownerRepository.create(await makeOwner({}, 'owner-1'));

    await expect(() =>
      sut.execute({ ownerId: 'owner-1', orderId: 'order-1' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
