import "dotenv/config";
import {get} from 'env-var'; 

export const envs = {
  //* Puerto del servidor 
  PORT: get('PORT').required().asPortNumber(),
  //* Path de la carpeta /public para servir archivos estáticos 
  PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),
}