import { FastifyReply, FastifyRequest } from 'fastify';
import { makeRegisterUseCase } from '@database/prisma/factories/make-register-use-case';
import { z } from 'zod';
import { UserAlreadyExistsError } from '@account/application/use-cases/errors/user-already-exists';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string(),
  });

  const { name, surname, email, password, phone } = registerBodySchema.parse(
    request.body,
  );

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      name,
      surname,
      email,
      password,
      phone,
    });

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
