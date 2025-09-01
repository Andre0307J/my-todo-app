import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "@/styles/TodoItem.module.css";
import { FaUser, FaCheckCircle, FaTrash } from "react-icons/fa";
import { updateTodo, deleteTodo as apiDeleteTodo } from "@/lib/todoApi.js"; // Import API functions

// Define the shape of a Todo item for type safety
type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

// Define the types for the component's props
interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const queryClient = useQueryClient();

  const toggleCompleteMutation = useMutation<Todo, Error>({
    mutationFn: () =>
      updateTodo(todo.id, { completed: !todo.completed }),
    onSuccess: (updatedTodoFromServer) => {
      // Update the cache for the 'todos' list
      queryClient.setQueryData<Todo[]>(['todos'], (oldData) => {
        const oldTodosArray = oldData ?? [];
        return oldTodosArray.map((item) =>
          item.id === todo.id ? updatedTodoFromServer : item
        );
      });
      // Also update the cache for the individual todo item if it exists
      queryClient.setQueryData<Todo>(['todo', String(todo.id)], updatedTodoFromServer);
    },
    onError: (error: Error) => {
      console.error("Error updating todo:", error);
      alert(`Failed to update todo: ${error.message}`);
    },
  });

  const deleteMutation = useMutation<unknown, Error>({
    mutationFn: () => apiDeleteTodo(todo.id),
    onSuccess: () => {
      const todoIdStr = String(todo.id);
      queryClient.setQueryData<Todo[]>(['todos'], (oldData) => {
        const oldTodosArray = oldData ?? [];
        return oldTodosArray.filter((item) => String(item.id) !== todoIdStr);
      });
      queryClient.removeQueries({ queryKey: ['todo', todoIdStr] });
    },
    onError: (error: Error) => {
      console.error("Error deleting todo:", error);
      alert(`Failed to delete todo: ${error.message}`);
    },
  });

  const handleToggleComplete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation when clicking checkbox
    e.stopPropagation(); // Stop event from bubbling up to the Link
    toggleCompleteMutation.mutate();
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event from bubbling up to the Link
    if (window.confirm(`Are you sure you want to delete "${todo.todo}"?`)) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className={`${styles.card} ${todo.completed ? styles.completedCard : ''}`}>
      <Link to={`/todos/${todo.id}`} className={styles.cardLink}>
        <div className={styles.todoContent}>
          <h3>{todo.todo}</h3>
          <p>
            <strong>ID:</strong> {todo.id}
          </p>
          <p className={styles.flexRow}>
            <FaCheckCircle color={todo.completed ? "green" : "#ddd"} />
            <strong> Status:</strong> {todo.completed ? "Completed" : "Incomplete"}
          </p>
          <p className={styles.flexRow}>
            <FaUser /> <strong>User ID:</strong> {todo.userId}
          </p>
        </div>
      </Link>
      <div className={styles.actions}>
        <button
          onClick={handleToggleComplete}
          className={`${styles.actionButton} ${styles.toggleButton}`}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          disabled={toggleCompleteMutation.isPending}
        >
          {toggleCompleteMutation.isPending ? "..." : (todo.completed ? "Undo" : "Complete")}
        </button>
        <button
          onClick={handleDelete}
          className={`${styles.actionButton} ${styles.deleteButton}`}
          aria-label="Delete todo"
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "..." : <FaTrash />}
        </button>
      </div>
    </div>
  );
}
