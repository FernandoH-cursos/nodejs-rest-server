import { Server } from '../src/presentation/server';
import { envs } from '../src/config/envs';
import { AppRoutes } from '../src/presentation/routes';

//? Servidor que se va a utilizar para las pruebas de integracion con supertest(devuelve el router de express)
export const testServer = new Server({
  port: envs.PORT,
  routes: AppRoutes.routes
});