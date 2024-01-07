import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from '../../domain/dtos/todos/create-todo.dto';
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo.dto';
import { TodoRepository } from "../../domain";

export class TodosController {
  //* Dependencies Injection
  constructor(
    private readonly todoRepository: TodoRepository,
  ) {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await this.todoRepository.getAll();

    res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

   try {
     const todo = await this.todoRepository.findById(id);
     res.json(todo);
   } catch (error) {
     //* Error 404 es cuando no se encuentra el recurso solicitado
     res.status(404).json({ error });
   }

  };

  public createTodo = async (req: Request, res: Response) => {
    //* Validando el body de la solicitud POST 
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    const todo = await this.todoRepository.create(createTodoDto!);
    res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    //* Validando el body y parametro de la solicitud PUT 
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id, });
    if(error) return res.status(400).json({ error });

    const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);
    res.json(updatedTodo);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const deletedTodo = await this.todoRepository.deleteById(id);
    res.json(deletedTodo);
  
  };
}
