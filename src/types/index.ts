export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

// The variables needed to create a new todo
export type NewTodo = Omit<Todo, "id">;

export interface TodosApiResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}
