import { Entity } from 'src/core/entity';
import { Optional } from 'src/utils/optional';
import { Slug } from './value-objects/slug';

export interface DessertProps {
  name: string;
  taste: string;
  slug: Slug;
  unitPriceInCents: number;
  amount: number;
  available: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class Dessert extends Entity<DessertProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.props.slug = Slug.createFromNameAndTaste(name, this.props.taste);
    this.touch();
  }

  get taste() {
    return this.props.taste;
  }

  set taste(taste: string) {
    this.props.taste = taste;
    this.props.slug = Slug.createFromNameAndTaste(this.props.name, taste);
    this.touch();
  }

  get slug() {
    return this.props.slug;
  }

  get unitPriceInCents() {
    return this.props.unitPriceInCents;
  }

  set unitPriceInCents(unitPriceInCents: number) {
    this.props.unitPriceInCents = unitPriceInCents;
    this.touch();
  }

  get amount() {
    return this.props.amount;
  }

  set amount(amount: number) {
    this.props.amount = amount;
    this.touch();
  }

  get available() {
    return this.props.available;
  }

  // ! Reavaliar esse trecho do código do toggleAvailability
  // private set available(available: boolean) {
  //   this.props.available = available;
  // }

  toggleAvailability() {
    // this.available = !this.available;
    this.props.available = !this.props.available;
  }

  // ! Retornar nesse trecho do código para validar se está funcionando
  subtractAmount(amount: number) {
    this.props.amount -= amount;

    if (this.props.amount <= 0) {
      this.props.available = false;
    }
  }

  // ! Retornar nesse trecho do código para validar se está funcionando
  refundAmount(amount: number) {
    this.props.amount += amount;
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

  static create(
    props: Optional<DessertProps, 'createdAt' | 'slug' | 'available'>,
    id?: string,
  ) {
    const dessert = new Dessert(
      {
        ...props,
        slug:
          props.slug ?? Slug.createFromNameAndTaste(props.name, props.taste),
        available: props.available ?? true,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return dessert;
  }
}
