import { AddressesRepository } from '@/repositories/addresses-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { Address } from '@prisma/client';

interface CreateAddressUseCaseRequest {
  user_id: string
  street: string
  address_number: number
  city: string
  address_complement?: string
}

interface CreateAddressUseCaseResponse {
  address: Address
}

export class CreateAddressUseCase {
  constructor(private addressesRepository: AddressesRepository, private usersRepository: UsersRepository) {}

  async execute({ user_id, street, address_number, city, address_complement }: CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new Error('Invalid user.');
    }

    const address = await this.addressesRepository.create({ user_id, street, address_number, city, address_complement });

    return { address };
  }
}