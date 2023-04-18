import { Prisma, User, Role } from '@prisma/client';
import { UsersRepository } from '../users-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryUsersRepository implements UsersRepository {

  public users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      surname: data.surname,
      email: data.email,
      password_hash: data.password_hash,
      role: Role.MEMBER
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
}