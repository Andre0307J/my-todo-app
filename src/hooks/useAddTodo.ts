// This creates a Todo

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTodo } from '@/lib/todoApi.js';
import { toast } from 'react-hot-toast';
import type { Todo, NewTodo, TodosApiResponse } from '@/types/index.js';

interface AddTodoContext {
  previousTodos?: TodosApiResponse;
}

export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, NewTodo, AddTodoContext>({
    mutationFn: addTodo, // Using my shared API function here

    onMutate: async (newTodo: NewTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<TodosApiResponse>(['todos']);

      // Optimistically update to the new value
      queryClient.setQueryData<TodosApiResponse>(['todos'], (oldData) => {
        if (!oldData) {
          // If there's no existing data, we can't optimistically update.
          return undefined;
        }
        const newOptimisticTodo: Todo = {
          ...newTodo,
          id: Date.now(), // Assign a temporary, unique ID for the key
        };
        return {
          ...oldData,
          todos: [newOptimisticTodo, ...oldData.todos],
        };
      });

      // Return a context object with the snapshotted value
      return { previousTodos };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, _newTodo, context) => {
      // The context contains the snapshot of the data from before the mutation.
      if (context) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to add todo: ${errorMessage}`);
    },

    onSuccess: () => {
      toast.success('Todo added!');
    },
    onSettled: async () => {
      // After success or error, always refetch to ensure our data is in sync with the server.
      await queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
