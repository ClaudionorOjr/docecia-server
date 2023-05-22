import { Customer } from '@account/enterprise/entities/customer';
import { CustomersRepository } from '@account/application/repositories/customers-repository';

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

  async save(customer: Customer) {
    const customerIndex = this.customers.findIndex(
      (item) => item.id === customer.id,
    );

    this.customers[customerIndex] = customer;
  }
}
