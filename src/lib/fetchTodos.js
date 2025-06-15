export async function fetchTodos() {
  const res = await fetch('https://dummyjson.com/todos');
  if (!res.ok) throw new Error('Failed to fetch todos');
  const data = await res.json();
  return data.todos; // The todos are inside the 'todos' property
}
