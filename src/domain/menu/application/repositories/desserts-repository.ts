import { Dessert } from '../../enterprise/enities/dessert';

export interface DessertsRepository {
  create(dessert: Dessert): Promise<void>;
  findById(id: string): Promise<Dessert | null>;
  findAll(): Promise<Dessert[]>;
  findManyAvailable(): Promise<Dessert[]>;
  delete(id: string): Promise<void>;
  save(dessert: Dessert): Promise<void>;
}
