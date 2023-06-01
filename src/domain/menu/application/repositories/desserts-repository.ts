import { Dessert } from '../../enterprise/enities/dessert';

export interface DessertsRepository {
  create(dessert: Dessert): Promise<void>;
  findById(id: string): Promise<Dessert | null>;
  findManyAvailable(): Promise<Dessert[]>;
  list(): Promise<Dessert[]>;
  delete(id: string): Promise<void>;
  save(dessert: Dessert): Promise<void>;
}
