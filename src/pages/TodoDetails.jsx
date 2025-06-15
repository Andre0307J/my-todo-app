import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDeleteTodo } from "../hooks/useDeleteTodo";
import Spinner from "../components/Spinner";
import TodoForm from "../components/TodoForm";
import styles from "../styles/TodoDetails.module.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchTodo } from "../lib/todoApi"; // Use your shared API function
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export default function TodoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: todo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => fetchTodo(id),
    enabled: !!id,
  });

  const { mutate: deleteTodo } = useDeleteTodo(id);
  
  const handleDelete = () => {
    deleteTodo(undefined, {
      onSuccess: () => {
        setShowDeleteModal(false);
        navigate("/");
      },
      onError: (error) => {
        console.error("Deletion failed:", error);
        alert(`Failed to delete todo: ${error.message}`);
      },
    });
  };

  if (isLoading) return <Spinner />;
  if (isError) {
    console.error("Fetching todo failed:", error);
    return (
      <div>
        <p>Error: {error.message}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.detail}>
      <h2>Todo Detail</h2>
      <p>
        <strong>ID:</strong> {todo.id}
      </p>
      <p>
        <strong>Todo:</strong> {todo.todo}
      </p>
      <p>
        <strong>Status:</strong> {todo.completed ? "✅ Completed" : "❌ Incomplete"}
      </p>
      <p>
        <strong>User ID:</strong> {todo.userId}
      </p>

      <div className={styles.actions}>
        <Button variant="outline" onClick={() => setShowEditModal(true)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
          Delete
        </Button>
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <TodoForm
            initialData={todo}
            onFormSubmitSuccess={() => {
              setShowEditModal(false); // Close modal after TodoForm's internal success
            }}
            onCancel={() => setShowEditModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <strong>{todo.todo}</strong>?
          </p>

          <div className={styles.actions}>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
