import type { Todo, NewTodo, TodosApiResponse } from '@/types/index.js';

const BASE_URL = 'https://dummyjson.com/todos';

/**
 * The shape of a deleted Todo item from the API.
 */
export type DeletedTodo = Todo & {
  isDeleted: boolean;
  deletedOn: string;
};

/**
 * Fetches all todos.
 */
export const getAllTodos = async (): Promise<Todo[]> => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TodosApiResponse = await response.json();
    return data.todos; // DummyJSON wraps the array in a 'todos' property
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Fetches a single todo by its ID.
 */
export const getTodoById = async (id: number): Promise<Todo> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Todo with ID ${id} not found.`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch todo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Adds a new todo.
 */
export const addTodo = async (todoData: NewTodo): Promise<Todo> => {
  try {
    const response = await fetch(`${BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to add todo:", error);
    throw error;
  }
};

// Updates an existing todo. DummyJSON only supports updating the 'completed' status.

export const updateTodo = async (
  id: number,
  updateData: Partial<Pick<Todo, 'completed'>>,
): Promise<Todo> => {
  // According to DummyJSON docs, only 'completed' can be updated for todos.
  // We'll ensure our updateData reflects this, or adjust if the API changes.
  const payload = { completed: updateData.completed };
  if (typeof updateData.completed === 'undefined') {
    console.warn("UpdateTodo: 'completed' field is missing in updateData. API might not update anything.");
  }

  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to update todo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a todo by its ID.
 */
export const deleteTodo = async (id: number): Promise<DeletedTodo> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json(); // DummyJSON returns the "deleted" object
  } catch (error) {
    console.error(`Failed to delete todo with ID ${id}:`, error);
    throw error;
  }
};

// Example of fetching todos by userId, as per DummyJSON docs
/**
 * Fetches all todos for a specific user.
 
 */
export const getTodosByUserId = async (userId: number): Promise<Todo[]> => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TodosApiResponse = await response.json();
    return data.todos; // DummyJSON wraps the array in a 'todos' property
  } catch (error) {
    console.error(`Failed to fetch todos for user ID ${userId}:`, error);
    throw error;
  }
};
