import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo as apiDeleteTodo } from "../lib/todoApi"; // Import the API function

export const useDeleteTodo = (todoIdToDelete) => {
  const queryClient = useQueryClient();

  return useMutation({
    // The mutationFn is responsible for making the API call.
    // It uses the `todoIdToDelete` that was passed when the hook was initialized.
    mutationFn: () => apiDeleteTodo(todoIdToDelete),

    // `onSuccess` is called after the mutationFn successfully completes.
    // `dataFromApi` is the response from `apiDeleteTodo` (the "deleted" todo object from DummyJSON).
    onSuccess: (dataFromApi) => {
      console.log("Todo successfully deleted via API:", dataFromApi);

      // --- Cache Management ---
      // It's good practice to update the cache after a successful mutation
      // to keep the UI in sync without necessarily waiting for a full refetch.

      // Option 1: Manually update the 'todos' list query cache.
      // This provides an immediate UI update by filtering out the deleted todo.
      queryClient.setQueryData(['todos'], (oldData) => {
        const oldTodosArray = Array.isArray(oldData) ? oldData : [];
        return oldTodosArray.filter(todo => todo.id !== todoIdToDelete);
      });

      // Option 2: Invalidate queries to trigger refetches.
      // This is simpler but might involve more network requests if not managed carefully.
      // queryClient.invalidateQueries({ queryKey: ['todos'] });

      // Remove the specific todo query from the cache if it exists (e.g., for a details view).
      queryClient.removeQueries({ queryKey: ['todo', todoIdToDelete] });

      // Note: The `onSuccess` callback provided to `mutate` in the component
      // (e.g., in TodoDetails.jsx for navigation) will be called *after* this.
    },
    onError: (error) => {
      console.error(`Error deleting todo with ID ${todoIdToDelete} from useDeleteTodo hook:`, error);
      // The `onError` callback provided to `mutate` in the component will also be called.
    },
  });
};