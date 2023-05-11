import { MakeCreateAddressUseCase } from '@database/prisma/factories/make-create-address-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function createAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createAddressBodySchema = z.object({
    city: z.string(),
    street: z.string(),
    addressNumber: z.number(),
    addressComplement: z.string().optional(),
  });

  const { city, street, addressNumber, addressComplement } =
    createAddressBodySchema.parse(request.body);

  const createAddressUseCase = MakeCreateAddressUseCase();

  try {
    await createAddressUseCase.execute({
      city,
      street,
      addressNumber,
      addressComplement,
      customerId: request.user.sub,
    });

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
