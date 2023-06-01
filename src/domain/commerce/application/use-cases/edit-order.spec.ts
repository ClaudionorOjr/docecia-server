import { beforeEach, describe, expect, it } from 'vitest';
import { EditOrderUseCase } from './edit-order';

import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-adresses-repository';

import { makeCustomer } from 'test/factories/make-customer';
import { makeOrder } from 'test/factories/make-order';
import { makeAddress } from 'test/factories/make-address';

import { ResourceNotFoundError } from '@account/application/use-cases/errors/resource-not-found-error';
import { NotAllowedError } from '@account/application/use-cases/errors/not-allowed-error';

let customersRepository: InMemoryCustomersRepository;
let ordersRepository: InMemoryOrdersRepository;
let addressesRepository: InMemoryAddressesRepository;
let sut: EditOrderUseCase;

describe('Edit Order Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    ordersRepository = new InMemoryOrdersRepository();
    addressesRepository = new InMemoryAddressesRepository();
    sut = new EditOrderUseCase(
      customersRepository,
      ordersRepository,
      addressesRepository,
    );
  });

  it('should be able to edit an order', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await addressesRepository.create(
      makeAddress({ customerId: 'customer-1' }, 'address-1'),
    );
    await ordersRepository.create(
      makeOrder(
        {
          customerId: 'customer-1',
          payment: 'CREDIT',
          pickupLocal: true,
          addressId: undefined,
        },
        'order-1',
      ),
    );

    await sut.execute({
      customerId: 'customer-1',
      orderId: 'order-1',
      payment: 'CASH',
      addressId: 'address-1',
    });

    expect(ordersRepository.orders).toEqual([
      expect.objectContaining({
        pickupLocal: false,
        addressId: 'address-1',
        payment: 'CASH',
      }),
    ]);
  });

  it('should not be able a non-existent customer to edit an order', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-1',
        payment: 'CASH',
        addressId: 'address-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a non-existent order', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-1',
        payment: 'CASH',
        addressId: 'address-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to edit another customer's order", async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await ordersRepository.create(
      makeOrder(
        {
          customerId: 'customer-2',
          payment: 'CREDIT',
          pickupLocal: true,
          addressId: undefined,
        },
        'order-1',
      ),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-1',
        payment: 'CASH',
        addressId: 'address-1',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit a completed or cancel order', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await ordersRepository.create(
      makeOrder(
        {
          customerId: 'customer-1',
          payment: 'CREDIT',
          pickupLocal: true,
          addressId: undefined,
          deliveredAt: new Date(),
        },
        'order-1',
      ),
    );
    await ordersRepository.create(
      makeOrder(
        {
          customerId: 'customer-1',
          payment: 'CREDIT',
          pickupLocal: true,
          addressId: undefined,
          canceledAt: new Date(),
        },
        'order-2',
      ),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-1',
        payment: 'CASH',
        addressId: 'address-1',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-2',
        payment: 'CASH',
        addressId: 'address-1',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit an order passing a non-existent address', async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await ordersRepository.create(
      makeOrder(
        {
          customerId: 'customer-1',
          payment: 'CREDIT',
          pickupLocal: true,
          addressId: undefined,
        },
        'order-1',
      ),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-1',
        payment: 'CASH',
        addressId: 'address-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to edit an order passing another customer's address", async () => {
    await customersRepository.create(await makeCustomer({}, 'customer-1'));
    await addressesRepository.create(
      makeAddress({ customerId: 'customer-2' }, 'address-1'),
    );
    await ordersRepository.create(
      makeOrder(
        {
          customerId: 'customer-1',
          payment: 'CREDIT',
          pickupLocal: true,
          addressId: undefined,
        },
        'order-1',
      ),
    );

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        orderId: 'order-1',
        payment: 'CASH',
        addressId: 'address-1',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
