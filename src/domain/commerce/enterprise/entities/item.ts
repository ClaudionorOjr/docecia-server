import { Entity } from 'src/core/entity';
import { Optional } from 'src/utils/optional';

export interface ItemProps {
  productId: string;
  customerId: string;
  name: string;
  taste: string;
  quantity: number;
  unitPriceInCents: number;
  // ! POSSIVELMENTE SERÁ NECESSÁRIO RETIRAR ESSE ATRIBUTO 'available'
  available: boolean;
  orderId?: string;
}

export class Item extends Entity<ItemProps> {
  get productId() {
    return this.props.productId;
  }

  get customerId() {
    return this.props.customerId;
  }

  get name() {
    return this.props.name;
  }

  get taste() {
    return this.props.taste;
  }

  get quantity() {
    return this.props.quantity;
  }

  get unitPriceInCents() {
    return this.props.unitPriceInCents;
  }

  get available() {
    return this.props.available;
  }

  set available(available: boolean) {
    this.props.available = available;
  }

  get orderId() {
    return this.props.orderId;
  }

  set orderId(orderId: string | undefined) {
    this.props.orderId = orderId;
  }

  get subtotal() {
    return this.props.quantity * this.props.unitPriceInCents;
  }

  quantityDecrement() {
    --this.props.quantity;
  }

  quantityIncrement(quantity?: number) {
    if (!quantity) {
      ++this.props.quantity;
    } else {
      this.props.quantity += quantity;
    }
  }

  static create(props: Optional<ItemProps, 'available'>, id?: string) {
    const item = new Item({ ...props, available: props.available ?? true }, id);

    return item;
  }
}
