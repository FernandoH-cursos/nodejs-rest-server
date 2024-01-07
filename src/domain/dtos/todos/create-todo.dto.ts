export class CreateTodoDto{

  private constructor(
    public readonly text: string,
  ) {}

  //* Dto para validar POST /todos 
  static create(props: {[key: string]: any}): [string?, CreateTodoDto?] {
    const { text } = props;

    //* Validando que el text se envie en el body 
    if (!text || text.length === 0) return ["Text property is required"];

    return [undefined, new CreateTodoDto(text)];
  }
}