import {UserAlreadyExistsError} from '@/use-case/errors/user-already-exists-error';
import {FastifyRequest, FastifyReply} from 'fastify'
import {z} from 'zod';
import {RegisterUseCase} from '@/use-case/register';
import {PrismaUsersRepository} from '@/repositories/implementations/prisma-users-repository';

export async function RegisterController(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  
  const {name, email, password} = registerBodySchema.parse(request.body);
  
  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)
    
    await registerUseCase.execute({
      name,
      email,
      password,
    })
    
  }catch(err) {
    if(err instanceof UserAlreadyExistsError) {
      return reply.status(409).send()
    }
    return reply.status(500).send() // TODO: fix-me
  }
  
  return reply.status(201).send()
}
