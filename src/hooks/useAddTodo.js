// This creates a Todo

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTodo } from '../lib/todoApi';
import toast from 'react-hot-toast';

export function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTodo, // Using my shared API function here

    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData(['todos']);

      queryClient.setQueryData(['todos'], (old) =>
        old
          ? {
              ...old,
              todos: [
                { ...newTodo, id: Date.now() }, // Temporary ID
                ...old.todos,
              ],
            }
          : old
      );

      return { previousTodos };
    },

    onError: (err, _, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
      toast.error('Add failed');
    },

    onSuccess: () => toast.success('Todo added!'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
