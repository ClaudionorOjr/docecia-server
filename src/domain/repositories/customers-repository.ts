import { Customer } from '@/domain/entities/customer';

export interface CustomersRepository {
  create(customer: Customer): Promise<Customer>;
  findByEmail(email: string): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>;
}
