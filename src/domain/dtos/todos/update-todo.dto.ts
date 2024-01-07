export class UpdateTodoDto {
  private constructor(
    public readonly id: number,
    public readonly text?: string,
    public readonly completedAt?: Date
  ) {}

  //* Obteniendo los valores formato objeto del dto 
  get values() {
    const returnObject: { [key: string]: any } = {};
    if (this.text) returnObject.text = this.text;
    if (this.completedAt) returnObject.completedAt = this.completedAt;

    return returnObject;
  }

  //* Dto para validar PUT /todos/:id
  static create(props: { [key: string]: any }): [string?, UpdateTodoDto?] {
    const { id,text, completedAt } = props;
    let newCompletedAt = completedAt;

    if(!id || isNaN(id)) return ["id must be a valid number"];

    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      //* Validando que el completedAt sea una fecha valida
      if (newCompletedAt.toString() === "Invalid Date")
        return ["completedAt must be a valid date"];
    }

    return [undefined, new UpdateTodoDto(id,text, completedAt)];
  }
}
