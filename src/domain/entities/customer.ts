import { Optional } from 'src/types/optional';
import { Entity } from './entity';

interface CustomerProps {
  name: string;
  surname: string;
  email: string;
  passwordHash: string;
  phone: string;
  createdAt: Date;
  updatedAt?: Date | null;
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

  get passwordHash() {
    return this.props.passwordHash;
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<CustomerProps, 'createdAt'>, id?: string) {
    const customer = new Customer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return customer;
  }
}
