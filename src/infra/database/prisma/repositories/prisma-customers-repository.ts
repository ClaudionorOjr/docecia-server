import { Customer } from '@account/enterprise/entities/customer';
import { CustomersRepository } from '@account/application/repositories/customers-repository';
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper';
import { prisma } from '@database/prisma/prisma';

export class PrismaCustomersRepository implements CustomersRepository {
  async create(customer: Customer) {
    const rawCustomer = PrismaCustomerMapper.toPrisma(customer);

    await prisma.customer.create({
      data: rawCustomer,
    });
  }

  async findByEmail(email: string) {
    const customer = await prisma.customer.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (!customer) {
      return null;
    }

    return PrismaCustomerMapper.toDomain(customer);
  }

  async findById(id: string) {
    const rawCustomer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!rawCustomer) {
      return null;
    }

    return PrismaCustomerMapper.toDomain(rawCustomer);
  }

  async save(customer: Customer) {
    const rawCustomer = PrismaCustomerMapper.toPrisma(customer);

    await prisma.customer.update({
      where: {
        id: rawCustomer.id,
      },
      data: rawCustomer,
    });
  }
}
