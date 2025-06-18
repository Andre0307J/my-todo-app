import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTodo } from '../lib/todoApi';
import toast from 'react-hot-toast';

export function useUpdateTodo(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates) => updateTodo(id, updates),
    onSuccess: () => {
      toast.success('Todo updated!');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
    },
    onError: (error) => {
      toast.error(`Failed to update todo: ${error.message}`);
    },
  });
}
