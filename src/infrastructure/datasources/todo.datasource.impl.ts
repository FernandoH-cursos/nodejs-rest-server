import { prisma } from "../../data/postgres";
import { CreateTodoDto, CustomError, TodoDatasource, TodoEntity, UpdateTodoDto } from "../../domain";

export class TodoDatasourceImpl implements TodoDatasource {
  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    //* Creando un nuevo todo en postgreSQL usando prisma
    const todo = await prisma.todo.create({ data: createTodoDto });

    return TodoEntity.fromObject(todo);
  }

  async getAll(): Promise<TodoEntity[]> {
    //* Obteniendo todos los todos de postgreSQL usando prisma
    const todos = await prisma.todo.findMany();

    return todos.map((todo) => TodoEntity.fromObject(todo));
  }

  async findById(id: number): Promise<TodoEntity> {
    //* Obteniendo un todo por id de postgreSQL usando prisma
    const todo = await prisma.todo.findFirst({ where: { id } });
    //* Validando que el todo exista con un error personalizado
    if (!todo) throw new CustomError(`Todo with id ${id} not found`,404);

    return TodoEntity.fromObject(todo);
  }

  async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    //* Validando todo por id para verificar si este existe para poder actualizarlo
    await this.findById(updateTodoDto.id);

    const updatedTodo = await prisma.todo.update({
      where: { id: updateTodoDto.id },
      data: updateTodoDto!.values,
    });

    return TodoEntity.fromObject(updatedTodo);
  }

  async deleteById(id: number): Promise<TodoEntity> {
    //* Validando todo por id para verificar si  este existe para poder eliminarlo
    await this.findById(id);

    const deleted = await prisma.todo.delete({ where: { id } });

    return TodoEntity.fromObject(deleted);
  }
}