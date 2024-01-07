
//* 'Error' es una clase para errores personalizados de JS que ya existe, por eso no se importa 
export class CustomError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400
  ) {
    //* 'super' es para llamar al constructor de la clase padre, en este caso 'Error' 
    super(message);
  }
}