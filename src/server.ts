import { app } from './app';
import { env } from './env';

app
  .listen({
    // * Torna a aplicação acessível a front-ends que estejam consumindo a aplicação.
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('Server Running 🚀');
  });
