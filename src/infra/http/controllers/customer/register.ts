import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaCustomersRepository } from '@infra/database/prisma/repositories/prisma-customers-repository';
import { RegisterUseCase } from '@domain/use-cases/register';
import { z } from 'zod';

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
    const prismaCustomersRepository = new PrismaCustomersRepository();
    const registerUseCase = new RegisterUseCase(prismaCustomersRepository);

    await registerUseCase.execute({
      name,
      surname,
      email,
      password,
      phone,
    });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
