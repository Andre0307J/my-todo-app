// Likely path: src/hooks/useDeleteTodo.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo as apiDeleteTodo } from "../lib/todoApi"; // Your API function

// The 'id' here is the ID of the todo to be deleted,
// passed when the hook is initialized in TodoDetails.jsx: useDeleteTodo(id)
export function useDeleteTodo(idToDelete) {
  const queryClient = useQueryClient();

  return useMutation({
    // The mutationFn calls the actual API delete function
    mutationFn: () => apiDeleteTodo(idToDelete),
    onSuccess: () => {
      // This is where the cache is updated for the 'todos' list
      queryClient.setQueryData(['todos'], (oldData) => {
        // IMPORTANT FIX: Ensure oldData is an array before filtering
        // If oldData is undefined or not an array, default to an empty array
        const oldTodosArray = Array.isArray(oldData) ? oldData : [];

        // Filter out the todo that was just deleted
        return oldTodosArray.filter((todo) => todo.id !== idToDelete);
      });
      // Note: The onSuccess passed from TodoDetails (e.g., to navigate)
      // will be handled by TanStack Query after this internal onSuccess.
    },
    onError: (error) => {
      // Handle or log the error appropriately
      console.error("Deletion failed in useDeleteTodo:", error);
      // We might re-throw or let the component's onError handle UI alerts
    },
  });
}
