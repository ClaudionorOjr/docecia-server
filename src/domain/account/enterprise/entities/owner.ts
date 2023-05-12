import { Entity } from 'src/core/entity';
import { Optional } from 'src/utils/optional';

export interface OwnerProps {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Owner extends Entity<OwnerProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash;
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

  static create(props: Optional<OwnerProps, 'createdAt'>, id?: string) {
    const owner = new Owner(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return owner;
  }
}
