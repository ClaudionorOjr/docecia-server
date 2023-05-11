import { Customer } from '@account/enterprise/entities/customer';
import { Customer as RawCustomer } from '@prisma/client';

export class PrismaCustomerMapper {
  //* Convertando da camada de aplicação para a camada de banco de dados
  static toPrisma(customer: Customer) {
    return {
      id: customer.id,
      name: customer.name,
      surname: customer.surname,
      email: customer.email,
      password_hash: customer.passwordHash,
      phone: customer.phone,
      created_at: customer.createdAt,
      updated_at: customer.updatedAt,
    };
  }

  //* Convertando da camada de banco de dados para a camada de aplicação
  static toDomain(rawCustomer: RawCustomer): Customer {
    return Customer.create(
      {
        name: rawCustomer.name,
        surname: rawCustomer.surname,
        email: rawCustomer.email,
        passwordHash: rawCustomer.password_hash,
        phone: rawCustomer.phone,
        createdAt: rawCustomer.created_at,
        updatedAt: rawCustomer.updated_at,
      },
      rawCustomer.id,
    );
  }
}
