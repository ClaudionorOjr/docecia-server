import { UserAlreadyExistsError } from '@account/application/use-cases/errors/user-already-exists';
import { makeRegisterOwnerUseCase } from '@database/prisma/factories/make-register-owner-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function registerOwner(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerOwnerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerOwnerBodySchema.parse(request.body);

  try {
    const registerOwner = makeRegisterOwnerUseCase();

    await registerOwner.execute({ email, name, password });

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
