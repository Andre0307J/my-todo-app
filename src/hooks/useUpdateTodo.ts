import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTodo } from '@/lib/todoApi.js';
import { toast } from 'react-hot-toast';
import type { Todo, TodosApiResponse } from '@/types/index.js';

type UpdateTodoPayload = {
  id: number;
  updates: Partial<Omit<Todo, 'id'>>;
};

interface UpdateTodoContext {
  previousTodos?: TodosApiResponse;
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, UpdateTodoPayload, UpdateTodoContext>({
    mutationFn: ({ id, updates }) => updateTodo(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previousTodos = queryClient.getQueryData<TodosApiResponse>(['todos']);

      queryClient.setQueryData<TodosApiResponse>(['todos'], (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          todos: oldData.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        };
      });

      return { previousTodos };
    },
    onSuccess: (updatedTodo) => {
      toast.success('Todo updated!');
      // We can also update the specific todo query cache if needed
      queryClient.setQueryData(['todo', String(updatedTodo.id)], updatedTodo);
    },
    onError: (error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
      toast.error(`Failed to update todo: ${error.message}`);
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', String(id)] });
    },
  });
}
