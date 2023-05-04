import { Entity } from './entity';

interface AddressProps {
  customerId: string;
  street: string;
  addressNumber: number;
  city: string;
  addressComplement?: string | null;
}

export class Address extends Entity<AddressProps> {
  get customerId() {
    return this.props.customerId;
  }

  get street() {
    return this.props.street;
  }

  get addressNumber() {
    return this.props.addressNumber;
  }

  get city() {
    return this.props.city;
  }

  get addressComplement() {
    return this.props.addressComplement;
  }

  static create(props: AddressProps, id?: string) {
    const address = new Address(props, id);

    return address;
  }
}
