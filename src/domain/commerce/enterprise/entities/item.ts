import { Entity } from 'src/core/entity';

export interface ItemProps {
  productId: string;
  customerId: string;
  name: string;
  taste: string;
  quantity: number;
  unitPriceInCents: number;
  // orderId?: string;
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

  static create(props: ItemProps, id?: string) {
    const item = new Item(props, id);

    return item;
  }
}
