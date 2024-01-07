export class TodoEntity {
  constructor(
    public id: number,
    public text: string,
    public completedAt?: Date | null
  ) {}

  //? Getter que retorna un booleano si el todo esta completado o no
  get isCompleted() {
    return !!this.completedAt;
  }

  //? Devuelve el todo  leido en formato objeto como una entidad Todo
  public static fromObject = (object: { [key: string]: any }): TodoEntity => {
    const { id, text, completedAt } = object;
    if (!id) throw "Id is required"
    if (!text) throw "Text is required"

    let newCompletedAt;
    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      //* Validando que completedAt sea una fecha valida 
      if(isNaN(newCompletedAt.getTime())) throw "CompletedAt is not a valid date"
    }

    const todo = new TodoEntity(id, text, newCompletedAt);

    return todo;
  };
}
