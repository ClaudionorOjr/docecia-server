import { Entity } from '@/domain/entities/entity';
import { Optional } from '@/types/optional';

interface CustomerProps {
  name: string;
  surname: string;
  email: string;
  passwordHash: string;
  phone: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Customer extends Entity<CustomerProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get surname() {
    return this.props.surname;
  }

  set surname(surname: string) {
    this.props.surname = surname;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  get password_hash() {
    return this.props.passwordHash;
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<CustomerProps, 'createdAt'>, id?: string) {
    const customer = new Customer(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return customer;
  }
}
