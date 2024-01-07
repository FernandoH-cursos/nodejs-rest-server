import { Request, Response } from "express";
import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-todo.dto";
import { CreateTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";

export class TodosController {
  //* Dependencies Injection
  constructor(private readonly todoRepository: TodoRepository) { }

  //? Manejador de errores personalizado y error 500
  private handleError(res: Response, error: unknown) { 
    //* Si el error es de tipo 'CustomError' entonces se envia el status code y el mensaje del error 
    if (error instanceof CustomError) return res.status(error.statusCode).json({ error: error.message });

    //* Si el error no es de tipo 'CustomError' entonces se envia un status code 500 y el mensaje del error 
    return res.status(500).json({ error: 'Internal server error - check logs' });
  }
  

  //? Es buena practica no usar funciones asincronas en los controladores de express, mejor usar promesas 

  public getTodos = (req: Request, res: Response) => {
    //* Caso de uso para obtener todos los todos 
    new GetTodos(this.todoRepository)
      .execute()
      .then((todos) => res.json(todos))
      .catch((error) => this.handleError(res, error));
  
    
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    //* Caso de uso para obtener un todo por id 
    new GetTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public createTodo = (req: Request, res: Response) => {
    //* Validando el body de la solicitud POST
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    //* Caso de uso para crear un nuevo todo 
    new CreateTodo(this.todoRepository)
      .execute(createTodoDto!)
      .then((todo) => res.status(201).json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    //* Validando el body y parametro de la solicitud PUT
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    //* Caso de uso para actualizar un todo por id
    new UpdateTodo(this.todoRepository)
      .execute(updateTodoDto!)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    //* Caso de uso para eliminar un todo por id
    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };
}
