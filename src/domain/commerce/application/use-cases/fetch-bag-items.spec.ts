import { beforeEach, describe, expect, it } from 'vitest';
import { FetchBagItemsUseCase } from './fetch-bag-items';

import { InMemoryBagItemsRepository } from 'test/repositories/in-memory-bag-items-repository';

import { makeItem } from 'test/factories/make-item';

let bagItemsRepository: InMemoryBagItemsRepository;
let sut: FetchBagItemsUseCase;

describe('Fetch Bag Items Use Case', () => {
  beforeEach(() => {
    bagItemsRepository = new InMemoryBagItemsRepository();
    sut = new FetchBagItemsUseCase(bagItemsRepository);
  });

  it('should be able to fetch bag items', async () => {
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', quantity: 1, productId: 'dessert-1' },
        'item-1',
      ),
    );
    await bagItemsRepository.add(
      makeItem(
        { customerId: 'customer-1', quantity: 1, productId: 'dessert-1' },
        'item-2',
      ),
    );
    await bagItemsRepository.add(makeItem({ customerId: 'customer-2' }));

    const { items } = await sut.execute({ customerId: 'customer-1' });

    expect(items).toHaveLength(2);
    expect(items).toEqual([
      expect.objectContaining({ customerId: 'customer-1' }),
      expect.objectContaining({ customerId: 'customer-1' }),
    ]);
  });
});
