import { app } from 'src/app';
import { register } from './register';

export async function customerRoutes() {
  app.post('/customers', register);
}
