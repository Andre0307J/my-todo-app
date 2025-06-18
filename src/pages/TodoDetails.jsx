import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDeleteTodo } from "../hooks/useDeleteTodo";
import Spinner from "../components/Spinner";
import TodoForm from "../components/TodoForm";
import styles from "../styles/TodoDetails.module.css";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming this is your UI library
import { getTodoById } from "../lib/todoApi"; // Use the specific function for fetching a single todo
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
    queryFn: () => getTodoById(id),
    enabled: !!id,
    // For DummyJSON: If we have this specific todo in cache (especially new items
    // put there by TodoForm), trust it. A refetch for a newly "added" item
    // will likely result in a 404 from DummyJSON.
    // staleTime: Infinity means data in cache is considered fresh indefinitely
    // and won't be refetched unless invalidated or explicitly refetched.
    staleTime: Infinity,
    refetchOnWindowFocus: false, // Prevents refetch on window focus for cached new items
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
