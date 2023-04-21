import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
  name: string
  surname: string
  email: string
  password: string
  phone: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({name, surname, email, password, phone}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if(userWithSameEmail) {
      throw new Error('User already exists!');
    }

    const user = await this.usersRepository.create({name, surname, email, password_hash, phone});

    return {user};
  }
}