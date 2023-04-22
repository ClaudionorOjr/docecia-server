import { Customer } from '@domain/entities/customer';
import { CustomersRepository } from '../customers-repository';

export class InMemoryCustomersRepository implements CustomersRepository {
  public customers: Customer[] = [];

  async create(customer: Customer) {
    this.customers.push(customer);
  }

  async findByEmail(email: string) {
    const customer = this.customers.find(
      (customer) => customer.email === email,
    );

    if (!customer) {
      return null;
    }

    return customer;
  }

  async findById(id: string) {
    const customer = this.customers.find((customer) => customer.id === id);

    if (!customer) {
      return null;
    }

    return customer;
  }
}
