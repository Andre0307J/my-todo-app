import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "../styles/TodoForm.module.css";
import { addTodo, updateTodo } from "../lib/todoApi";

export default function TodoForm({
  initialData = {},
  onFormSubmitSuccess,
  onCancel,
}) {
  const [todo, setTodo] = useState("");
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState(1);
  const queryClient = useQueryClient();

  // Destructure initialData to get stable primitive values for the dependency array
  const {
    id: initialId,
    todo: initialTodoText,
    completed: initialCompleted,
    userId: initialUserId,
  } = initialData;

  useEffect(() => {
    if (initialId) {
      // Use the destructured initialId to check for edit mode
      // This condition is for "edit" mode or when initialData has content
      setTodo(initialTodoText || "");
      setCompleted(initialCompleted ?? false);
      setUserId(initialUserId ?? 1);
    } else {
      // This is for "add" mode (initialData is empty or has no .todo)
      setTodo("");
      setCompleted(false);
      setUserId(1);
    }
  }, [initialId, initialTodoText, initialCompleted, initialUserId]); // Now all dependencies are listed

  const addOrUpdateTodoMutation = useMutation({
    mutationFn: async (newOrUpdatedTodo) => {
      if (initialId) {
        // Use destructured initialId here as well for consistency
        return updateTodo(initialId, newOrUpdatedTodo);
      } else {
        return addTodo(newOrUpdatedTodo);
      }
    },
    // The `returnedTodoData` is what the `addTodo` or `updateTodo` function returns
    // after a successful API call. It should be the newly created or updated todo item.
    onSuccess: (returnedTodoData) => {
      // Manually update the TanStack Query cache to reflect the change immediately.
      // This is crucial for mock APIs like jsonplaceholder that don't persist changes.
      queryClient.setQueryData(['todos'], (oldData) => {
        // Ensure oldData is an array, default to empty array if undefined or not an array
        const oldTodosArray = Array.isArray(oldData) ? oldData : [];

        if (initialId) {
          // This was an update: replace the old item with the new one
          return oldTodosArray.map(todo =>
            todo.id === initialId ? returnedTodoData : todo
          );
        } else {
          // This was an add: prepend the new todo to the list
          return [returnedTodoData, ...oldTodosArray];
        }
      });

      // For mock APIs that don't persist, invalidating queries right after
      // a manual update can cause the UI to revert if the server returns the original list.
      // queryClient.invalidateQueries({ queryKey: ["todos"] });

      if (onFormSubmitSuccess) {
        onFormSubmitSuccess(); // Close modal or perform other actions
      }
    },
    onError: (error) => {
      console.error("Error saving todo:", error);
      alert(`Error: ${error.message}`); // Simple error feedback
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todo.trim()) return;
    // Ensure userId is a number when constructing todoData
    const todoData = {
      todo: todo.trim(),
      completed,
      userId: Number(userId) || 1,
    };
    addOrUpdateTodoMutation.mutate(todoData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>{initialData.id ? "Edit Todo" : "Add Todo"}</h3>

      <input
        className={styles.inputField}
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder="Enter todo"
        required
      />

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>

      <input
        className={styles.inputField}
        type="number"
        value={userId}
        min={1}
        onChange={(e) => setUserId(Number(e.target.value) || 1)} // Ensure userId is stored as a number
        placeholder="User ID"
        required
      />

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.save}
          disabled={addOrUpdateTodoMutation.isLoading}
        >
          {addOrUpdateTodoMutation.isLoading
            ? initialData.id
              ? "Updating..."
              : "Creating..."
            : initialData.id
            ? "Update"
            : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancel}
          disabled={addOrUpdateTodoMutation.isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
