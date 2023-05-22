import { DessertsRepository } from '@menu/application/repositories/desserts-repository';
import { Dessert } from '@menu/enterprise/enities/dessert';

export class InMemoryDessertsRepository implements DessertsRepository {
  public desserts: Dessert[] = [];

  async create(dessert: Dessert) {
    this.desserts.push(dessert);
  }

  async findById(id: string) {
    const dessert = this.desserts.find((item) => item.id === id);

    if (!dessert) {
      return null;
    }

    return dessert;
  }

  async findAll() {
    return this.desserts;
  }

  async findManyAvailable() {
    const desserts = this.desserts.filter((item) => item.available === true);

    return desserts;
  }

  async delete(id: string) {
    const dessertIndex = this.desserts.findIndex((item) => item.id === id);

    this.desserts.splice(dessertIndex, 1);
  }

  async save(dessert: Dessert) {
    const dessertIndex = this.desserts.findIndex(
      (item) => item.id === dessert.id,
    );

    this.desserts[dessertIndex] = dessert;
  }
}
