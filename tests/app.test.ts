import { envs } from '../src/config/envs';
import { Server } from '../src/presentation/server';

//* Convirtiendo la clase Server en un mock 
jest.mock('../src/presentation/server');

describe('Testing App.ts', () => {

  test('should call server with arguments and start', async () => {
    //* Importando archivo app.ts para probarlo 
    await import('../src/app');

    //* Probando que la clase Server se haya instanciado una vez 
    expect(Server).toHaveBeenCalledTimes(1);
    //* Probando que la clase Server se haya instanciado con los argumentos correctos 
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      publicPath: envs.PUBLIC_PATH,
      routes: expect.any(Function),
    });
    //* Probando que la instancia de la clase Server haya llamado al método start() 
    expect(Server.prototype.start).toHaveBeenCalledTimes(1);
  });
});