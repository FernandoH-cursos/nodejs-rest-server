import { Router } from "express";
import { TodosController } from "./controller";
import { TodoDatasourceImpl } from "../../infrastructure/datasources/todo.datasource.impl";

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();

    //* Datasource de Todo 
    const datasource = new TodoDatasourceImpl();
    const todoController = new TodosController(datasource);

    router.get("/", todoController.getTodos);
    router.get("/:id", todoController.getTodoById);

    router.post("/", todoController.createTodo);
    router.put("/:id", todoController.updateTodo);

    router.delete("/:id", todoController.deleteTodo);

    return router;
  }
}
