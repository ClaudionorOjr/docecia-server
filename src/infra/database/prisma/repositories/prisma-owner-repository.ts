import { OwnerRepository } from '@account/application/repositories/owner-repository';
import { Owner } from '@account/enterprise/entities/owner';
import { PrismaOwnerMapper } from '../mappers/prisma-owner-mapper';
import { prisma } from '../prisma';

export class PrismaOwnerRepository implements OwnerRepository {
  async create(owner: Owner) {
    const rawOwner = PrismaOwnerMapper.toPrisma(owner);

    await prisma.owner.create({
      data: rawOwner,
    });
  }

  async findById(id: string) {
    const owner = await prisma.owner.findUnique({
      where: {
        id,
      },
    });

    if (!owner) {
      return null;
    }

    return PrismaOwnerMapper.toDomain(owner);
  }

  async findByEmail(email: string) {
    const owner = await prisma.owner.findUnique({
      where: {
        email,
      },
    });

    if (!owner) {
      return null;
    }

    return PrismaOwnerMapper.toDomain(owner);
  }

  async save(owner: Owner) {
    const rawOwner = PrismaOwnerMapper.toPrisma(owner);

    await prisma.owner.update({
      where: {
        id: rawOwner.id,
      },
      data: rawOwner,
    });
  }
}
