import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Todo route testing', () => {
  beforeAll(async () => {
    //* Corriendo el servidor de pruebas antes de ejecutar todos los tests 
    await testServer.start();
  });

  afterAll(async () => {
    //* Cerrando el servidor de pruebas después de ejecutar todos los tests 
    testServer.close();
  });

  beforeEach(async () => {
     //* Borramos todos los 'todos' de la base de datos antes de cada test
    await prisma.todo.deleteMany();
  });

  const todo1 = { text: 'Hola Mundo 1' }
  const todo2 = { text: 'Hola Mundo 2' }

  test('should return TODOs api/todos', async () => {

    //* Agregando 2 todos de prueba a la base de datos
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });

    //? Esta validacion con supertest hace lo siguiente:
    //* - 'request()' recibe el router de express para probar(en este caso router de /api/todos)
    //* - Hace una peticion GET a la ruta /api/todos
    //* - Espera que el codigo de respuesta sea 200
    const { body } = await request(testServer.app)
      .get("/api/todos")
      .expect(200);
    
    //* Probando que el body de la respuesta sea un array
    expect(body).toBeInstanceOf(Array);
    //* Probando que el body de la respuesta tenga 2 elementos
    expect(body.length).toBe(2);
    //* Probando que el primer elemento del body sea el todo1
    expect(body[0].text).toBe(todo1.text);
    //* Probando que el segundo elemento del body sea el todo2
    expect(body[1].text).toBe(todo2.text);
  });

  test('should return a TODO api/todos/:id', async () => {
    //* Agregando 1 todo de prueba a la base de datos
    const todo = await prisma.todo.create({ data: todo1 });

    //* Validando /api/todos/:id
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    //* Probando que el body de la respuesta sea un objeto con las propiedades id y text 
    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
    });
  });

  test('should return a 404 NotFound api/todos/:id', async () => {
    const todoId = 999;
    //* Validando /api/todos/:id para un id que no existe
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(404);

    //* Probando que el body de la respuesta sea un objeto con la propiedad error 
    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });


  test('should return a new Todo api/todos', async() => {
    //* Validando /api/todos para crear un nuevo todo
    //* 'send()' envia el body de la solicitud POST 
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send(todo1)
      .expect(201);
    
    //* Probando que el body de la respuesta sea un objeto con las propiedades id y text 
    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
    });
  });


  test("should return a error if text is not present api/todos", async () => {
    //* Validando /api/todos para crear un nuevo todo con un body invalido
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send({})
      .expect(400);

    //* Probando que que la respuesta sea un objeto con la propiedad error
    expect(body).toEqual({ error: "Text property is required" });
  });

  test("should return a error if text is empty api/todos", async () => {
    //* Validando /api/todos para crear un nuevo todo con un body invalido
    const { body } = await request(testServer.app)
      .post("/api/todos")
      .send({text: ''})
      .expect(400);

    //* Probando que que la respuesta sea un objeto con la propiedad error
    expect(body).toEqual({ error: "Text property is required" });
  });

  test("should return an updated TODO api/todos/:id", async () => {
    //* Creando un todo de prueba en la base de datos para actualizarlo 
    const todo = await prisma.todo.create({ data: todo1 });

    //* Validando /api/todos/:id para actualizar un todo
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: "Hola Mundo UPDATE", completedAt: new Date("2023-10-21") })
      .expect(200);


    //* Probando que el body de la respuesta sea un objeto con las propiedades id, text y completedAt 
    expect(body).toEqual({
      id: expect.any(Number),
      text: "Hola Mundo UPDATE",
      completedAt: "2023-10-21T00:00:00.000Z",
    });

  });

  test('should return 404 if TODO not found', async () => {
    const todoId = 999;

    //* Validando /api/todos/:id para crear un nuevo todo con un id que no existe
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todoId}`)
      .send({ text: "Hola Mundo UPDATE", completedAt: new Date("2023-10-21") })
      .expect(404);

    //* Probando que el body de la respuesta sea un objeto con la propiedad error
    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });

  test('should return an updated TODO only the date', async () => {
    //* Creando un todo de prueba en la base de datos para actualizarlo
    const todo = await prisma.todo.create({ data: todo1 });

    //* Validando /api/todos/:id para actualizar solo el 'completedAt' de un todo pero no su 'text'
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: new Date("2023-10-21") })
      .expect(200);

    //* Probando que la respuesta sea un objeto con las propiedades id, text y completedAt
    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: "2023-10-21T00:00:00.000Z",
    });
  });

  test("hould return a error if completedAt is invalid api/todos", async () => {
    //* Creando un todo de prueba en la base de datos para actualizarlo
    const todo = await prisma.todo.create({ data: todo1 });

    //* Validando /api/todos/:id para actualizar un todo con un completedAt invalido
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: "sdfgh" })
      .expect(400);

    //* Probando que la respuesta sea un objeto con la propiedad error
    expect(body).toEqual({error: 'completedAt must be a valid date'});
  });

  test('should delete a TODO api/todos/:id', async () => {
    //* Creando un todo de prueba en la base de datos para eliminarlo
    const todo = await prisma.todo.create({ data: todo1 });

    //* Validando /api/todos/:id para eliminar un todo
    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);
    

    //* Probando que la respuesta sea el objeto eliminado
    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
    });
  });

  test("should return 404 if todo do not exist api/todos/:id", async () => {
    const todoId = 999;

    //* Validando /api/todos/:id para eliminar un todo con un id que no existe
    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todoId}`)
      .expect(404);


    //* Probando que la respuesta sea un objeto con la propiedad error
    expect(body).toEqual({ error: `Todo with id ${todoId} not found`,  });
  });

});