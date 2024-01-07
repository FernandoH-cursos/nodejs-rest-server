import express, { Router } from 'express'
import compression from 'compression';
import path from 'path';

interface Options{
  port: number;
  routes: Router;
  publicPath?: string;
}

export class Server{
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;


  constructor(options: Options) { 
    const {port,routes,publicPath = 'public'} = options;

    this.port = port;
    this.publicPath = publicPath;
    this.routes = routes;
  }

  async start() { 
    //* Middlewares
    this.app.use(express.json()); // body - raw - json
    this.app.use(express.urlencoded({ extended: true })); // body - x-www-form-urlencoded
    // Comprime las respuestas http para que sean más rápidas
    this.app.use(compression())
    
    //* Public Folder
    this.app.use(express.static(this.publicPath));

    //* Routes globales de Express
    this.app.use(this.routes);
    

    //* Servir SPA 
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname, `../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    });

    //* Corriendo el servidor de express y guardando su listener
    this.serverListener = this.app.listen(this.port, () => {
    console.log(`Server running at http://localhost:${this.port}`);
    })
  }

  public close() {
    this.serverListener.close();
  }
}