const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

// Helper function to map API response structure to your app's expected structure
const mapApiTodoToAppTodo = (apiTodo) => {
  if (!apiTodo) return null; // Handle cases where apiTodo might be null or undefined
  const { title, ...rest } = apiTodo; // Destructure to separate 'title'
  return {
    ...rest, // Spread other properties like id, userId, completed
    todo: title, // Map the API's 'title' field to your app's 'todo' field
  };
};

export async function addTodo(newTodoDataFromForm) {
  // newTodoDataFromForm comes from your form, e.g., { todo: "Task text", completed: false, userId: 1 }
  const res = await fetch(BASE_URL, { // POST to the base /todos endpoint
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: newTodoDataFromForm.todo, // Mapping app's 'todo' to API's 'title'
      completed: newTodoDataFromForm.completed,
      userId: newTodoDataFromForm.userId,
    }),
  });
  if (!res.ok) throw new Error('Failed to add todo');
  const addedApiTodo = await res.json(); // API returns the new todo with 'title'
  return mapApiTodoToAppTodo(addedApiTodo); // Map it back to your app's structure
}

export async function updateTodo(id, updatesFromForm) {
  // updatesFromForm from the form, e.g., { todo: "Updated text", completed: true }
  // Note: userId is not in updatesFromForm based on your TodoForm.jsx.
  // JSONPlaceholder is usually lenient and will update fields provided, keeping others.
  const payload = {
    title: updatesFromForm.todo, // Map your app's 'todo' to API's 'title'
    completed: updatesFromForm.completed,
    // id: id, // id is in the URL, usually not needed in PUT body for jsonplaceholder
    // userId: originalUserId // If API strictly required full resource, you'd need to fetch or pass original userId
  };

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  const updatedApiTodo = await res.json(); // API returns the "updated" todo with 'title'
  return mapApiTodoToAppTodo(updatedApiTodo); // Map it back to your app's structure
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete todo');
  // JSONPlaceholder returns {} on successful DELETE.
  // res.json() will parse it. TanStack Query handles cache invalidation.
  return res.json();
}

export async function fetchTodos() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch todos');
  const apiTodosArray = await res.json(); // API returns a direct array of todos, each with 'title'
  return apiTodosArray.map(mapApiTodoToAppTodo); // Map each todo in the array
}

export async function fetchTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Todo not found');
  const apiTodo = await res.json(); // API returns a single todo object with 'title'
  return mapApiTodoToAppTodo(apiTodo); // Map the single todo
}
