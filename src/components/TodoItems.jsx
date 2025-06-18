import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "../styles/TodoItem.module.css";
import { FaUser, FaCheckCircle, FaTrash } from "react-icons/fa";
import { updateTodo, deleteTodo as apiDeleteTodo } from "../lib/todoApi"; // Import API functions

export default function TodoItem({ todo }) {
  const queryClient = useQueryClient();

  const toggleCompleteMutation = useMutation({
    mutationFn: () =>
      updateTodo(todo.id, { completed: !todo.completed }),
    onSuccess: (updatedTodoFromServer) => {
      // Update the cache for the 'todos' list
      queryClient.setQueryData(['todos'], (oldData) => {
        const oldTodosArray = Array.isArray(oldData) ? oldData : [];
        return oldTodosArray.map((item) =>
          item.id === todo.id ? updatedTodoFromServer : item
        );
      });
      // Also update the cache for the individual todo item if it exists
      queryClient.setQueryData(['todo', String(todo.id)], updatedTodoFromServer);
    },
    onError: (error) => {
      console.error("Error updating todo:", error);
      alert(`Failed to update todo: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiDeleteTodo(todo.id),
    onSuccess: () => {
      const todoIdStr = String(todo.id);
      queryClient.setQueryData(['todos'], (oldData) => {
        const oldTodosArray = Array.isArray(oldData) ? oldData : [];
        return oldTodosArray.filter((item) => String(item.id) !== todoIdStr);
      });
      queryClient.removeQueries({ queryKey: ['todo', todoIdStr] });
    },
    onError: (error) => {
      console.error("Error deleting todo:", error);
      alert(`Failed to delete todo: ${error.message}`);
    },
  });

  const handleToggleComplete = (e) => {
    e.preventDefault(); // Prevent link navigation when clicking checkbox
    e.stopPropagation(); // Stop event from bubbling up to the Link
    toggleCompleteMutation.mutate();
  };

  const handleDelete = (e) => {
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
          disabled={toggleCompleteMutation.isLoading}
        >
          {toggleCompleteMutation.isLoading ? "..." : (todo.completed ? "Undo" : "Complete")}
        </button>
        <button
          onClick={handleDelete}
          className={`${styles.actionButton} ${styles.deleteButton}`}
          aria-label="Delete todo"
          disabled={deleteMutation.isLoading}
        >
          {deleteMutation.isLoading ? "..." : <FaTrash />}
        </button>
      </div>
    </div>
  );
}
