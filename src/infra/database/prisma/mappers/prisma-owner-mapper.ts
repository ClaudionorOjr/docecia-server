import { Owner } from '@account/enterprise/entities/owner';
import { Owner as RawOwner } from '@prisma/client';

export class PrismaOwnerMapper {
  static toPrisma(owner: Owner) {
    return {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      password_hash: owner.passwordHash,
      created_at: owner.createdAt,
      updated_at: owner.updatedAt,
    };
  }

  static toDomain(rawOwner: RawOwner): Owner {
    return Owner.create(
      {
        name: rawOwner.name,
        email: rawOwner.email,
        passwordHash: rawOwner.password_hash,
        createdAt: rawOwner.created_at,
        updatedAt: rawOwner.updated_at,
      },
      rawOwner.id,
    );
  }
}
