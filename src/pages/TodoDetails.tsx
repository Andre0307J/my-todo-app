import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDeleteTodo } from "@/hooks/useDeleteTodo";
import Spinner from "@/components/Spinner";
import TodoForm from "@/components/TodoForm";
import { Button } from "@/components/ui/button";
import { getTodoById } from "@/lib/todoApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import styles from "@/styles/TodoDetails.module.css";

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
    refetch,
  } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => getTodoById(Number(id!)), // id is guaranteed to be a string by the `enabled` option
    enabled: !!id,
    staleTime: Infinity,
    refetchOnWindowFocus: false, // Prevents refetch on window focus for cached new items
  });

  const { mutate: deleteTodo } = useDeleteTodo();

  const handleDelete = () => {
    if (!id) {
      toast.error("Cannot delete: Todo ID is missing.");
      return;
    }

    deleteTodo(Number(id), {
      onSuccess: () => {
        setShowDeleteModal(false);
        navigate("/");
      },
      onError: (error) => {
        console.error("Deletion failed:", error);
        toast.error(`Failed to delete todo: ${error.message}`);
      },
    });
  };

  if (isLoading) return <Spinner />;
  if (isError) {
    console.error("Fetching todo failed:", error);
    return (
      <div>
        <p>Error: {error.message}</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!todo) return null; // Render nothing if todo is not yet available

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
