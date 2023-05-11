import { Optional } from 'src/utils/optional';
import { Entity } from '../../../../core/entity';

export interface AddressProps {
  customerId: string;
  street: string;
  addressNumber: number;
  city: string;
  addressComplement?: string | null;
  createdAt: Date;
  updatedAt?: Date;
}

export class Address extends Entity<AddressProps> {
  get customerId() {
    return this.props.customerId;
  }

  get street() {
    return this.props.street;
  }

  set street(street: string) {
    this.props.street = street;
    this.touch();
  }

  get addressNumber() {
    return this.props.addressNumber;
  }

  set addressNumber(addressNumber: number) {
    this.props.addressNumber = addressNumber;
    this.touch();
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
    this.touch();
  }

  get addressComplement() {
    return this.props.addressComplement;
  }

  set addressComplement(addressComplement: string | undefined | null) {
    this.props.addressComplement = addressComplement;
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

  static create(props: Optional<AddressProps, 'createdAt'>, id?: string) {
    const address = new Address(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return address;
  }
}
