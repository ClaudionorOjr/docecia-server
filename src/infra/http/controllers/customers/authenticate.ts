import { FastifyReply, FastifyRequest } from 'fastify';
import { makeAuthenticateUseCase } from '@database/prisma/factories/make-authenticate-use-case';
import { z } from 'zod';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { customer } = await authenticateUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: customer.id,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: customer.id,
          expiresIn: '7d',
        },
      },
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
