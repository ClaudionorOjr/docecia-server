import { Entity } from 'src/core/entity';
import { Optional } from 'src/utils/optional';

export interface OrderProps {
  customerId: string;
  pickupLocal: boolean;
  addressId?: string;
  note?: string;
  payment: string;
  totalPriceInCents: number;
  createdAt: Date;
  deliveredAt?: Date;
  updatedAt?: Date;
  canceledAt?: Date;
}

export class Order extends Entity<OrderProps> {
  get customerId() {
    return this.props.customerId;
  }

  get payment() {
    return this.props.payment;
  }

  set payment(payment: string) {
    this.props.payment = payment;
    this.touch();
  }

  get totalPriceInCents() {
    return this.props.totalPriceInCents;
  }

  get pickupLocal() {
    return this.props.pickupLocal;
  }

  set pickupLocal(pickupLocal: boolean) {
    this.props.pickupLocal = pickupLocal;
    this.touch();
  }

  get addressId() {
    return this.props.addressId;
  }

  set addressId(addressId: string | undefined) {
    this.props.addressId = addressId;
    this.touch();
  }

  get deliveredAt() {
    return this.props.deliveredAt;
  }

  markAsDelivered() {
    this.props.deliveredAt = new Date();
    this.touch();
  }

  get note() {
    return this.props.note;
  }

  set note(note: string | undefined) {
    this.props.note = note;
    this.touch();
  }

  get status() {
    if (this.props.canceledAt) {
      return 'CANCELED';
    }

    if (!this.props.deliveredAt) {
      return 'PENDING';
    }

    return 'COMPLETED';
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get canceledAt() {
    return this.props.canceledAt;
  }

  cancel() {
    this.props.canceledAt = new Date();
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<OrderProps, 'createdAt'>, id?: string) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return order;
  }
}
