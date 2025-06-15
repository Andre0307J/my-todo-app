import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteTodo(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },

    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData(["todos"]);

      queryClient.setQueryData(["todos"], (old) =>
        old
          ? { ...old, todos: old.todos.filter((t) => t.id !== Number(id)) }
          : old
      );

      return { previousTodos };
    },

    // On error, roll back
    onError: (err, _, context) => {
      queryClient.setQueryData(["todos"], context.previousTodos);
      toast.error("Delete failed");
    },

    // On success or settle, refetch
    onSuccess: () => toast.success("Todo deleted!"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
