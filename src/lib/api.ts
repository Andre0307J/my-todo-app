import axios from "axios";
import { cache } from "react";

// Define the type for a single Todo item
export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

// Define the type for the API response which contains the todos array
interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

// Function to fetch all todos from the DummyJSON API
export const getTodos = async ({
  limit,
  skip,
  q,
  filter, // eslint-disable-line @typescript-eslint/no-unused-vars
}: {
  limit: number;
  skip: number;
  q?: string;
  filter?: string;
}): Promise<TodosResponse> => {
  if (q) {
    // Use the dedicated and faster search endpoint.
    // IMPORTANT: The search endpoint does NOT support pagination. It returns all matches.
    // We must fetch all results and then apply pagination on the client-side.
    const searchUrl = `https://dummyjson.com/todos/search?q=${encodeURIComponent(
      q
    )}`;
    const { data: searchData } = await axios.get<TodosResponse>(searchUrl);

    return {
      // Manually apply pagination to the search results.
      todos: searchData.todos.slice(skip, skip + limit),
      total: searchData.todos.length, // The total is the count of all matched items.
      skip: skip,
      limit: limit,
    };
  }

  // For non-search queries, use the paginated endpoint
  const url = `https://dummyjson.com/todos?limit=${limit}&skip=${skip}`;
  // The main /todos endpoint does NOT support filtering by status.
  // This logic is now handled on the client in `filteredTodos`.
  // We keep the `filter` parameter in the function signature for query key uniqueness
  // but we do not use it to construct the URL here.

  const { data: paginatedData } = await axios.get<TodosResponse>(url);
  return paginatedData;
};

// Function to fetch a single todo by its ID
export const getTodo = cache(async (id: number): Promise<Todo> => {
  const { data } = await axios.get<Todo>(
    `https://dummyjson.com/todos/${id.toString()}`
  );
  return data;
});

// Function to update a todo (e.g., toggle its 'completed' status)
export const updateTodo = async (
  updatedTodo: Partial<Todo> & { id: number }
): Promise<Todo> => {
  const { id, ...payload } = updatedTodo;
  const { data } = await axios.put<Todo>(
    `https://dummyjson.com/todos/${id}`,
    payload, // Send only the fields to be updated (e.g., { todo: 'new text' })
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
};

// Type for the data sent when creating a new todo
export interface NewTodoPayload {
  todo: string;
  completed: boolean;
  userId: number; // DummyJSON requires a userId
}

// Function to add a new todo
export const addTodo = async (newTodo: NewTodoPayload): Promise<Todo> => {
  const { data } = await axios.post<Todo>(
    `https://dummyjson.com/todos/add`,
    newTodo,
    { headers: { "Content-Type": "application/json" } }
  );
  // The API returns the new todo with an ID, but it's a mock.
  return data;
};

// Function to delete a todo
export const deleteTodo = async (id: number): Promise<Todo> => {
  const { data } = await axios.delete<Todo>(
    `https://dummyjson.com/todos/${id}`
  );
  return data;
};
