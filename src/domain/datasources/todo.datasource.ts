import { TodoEntity } from "../entities/todo.entity";
import { CreateTodoDto, UpdateTodoDto } from "../dtos";

export abstract class TodoDatasource{
  abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>;
  //TODO: Implementar paginacion 
  abstract getAll(): Promise<TodoEntity[]>;
  abstract findById(id: number): Promise<TodoEntity>;
  abstract updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
  abstract deleteById(id: number): Promise<TodoEntity>;
}