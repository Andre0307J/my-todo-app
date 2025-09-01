import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteTodo as apiDeleteTodo, type DeletedTodo } from "@/lib/todoApi.js";
import type { TodosApiResponse } from "@/types/index.js";

interface DeleteTodoContext {
  previousTodos?: TodosApiResponse;
}

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<DeletedTodo, Error, number, DeleteTodoContext>({
    mutationFn: apiDeleteTodo,

    // When `mutate` is called, this will run first
    onMutate: async (todoIdToDelete) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<TodosApiResponse>([
        "todos",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<TodosApiResponse>(["todos"], (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          todos: oldData.todos.filter((todo) => todo.id !== todoIdToDelete),
        };
      });

      // Also remove the specific todo query from the cache if it exists
      queryClient.removeQueries({ queryKey: ["todo", todoIdToDelete] });

      // Return a context object with the snapshotted value
      return { previousTodos };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, _todoIdToDelete, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
      toast.error(`Failed to delete todo: ${err.message}`);
    },

    onSuccess: (dataFromApi) => {
      toast.success(`Todo "${dataFromApi.todo}" deleted!`);
    },

    // Always refetch after error or success to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};