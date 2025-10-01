"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateTodo, Todo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EditTodoDialogProps {
  todo: Todo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTodoDialog({ todo, open, onOpenChange }: EditTodoDialogProps) {
  const queryClient = useQueryClient();
  const [todoText, setTodoText] = useState("");

  useEffect(() => {
    if (todo) {
      setTodoText(todo.todo);
    }
  }, [todo]);

  const { mutate: editTodo, isPending } = useMutation({
    mutationFn: updateTodo,
    onSuccess: (updatedTodo) => {
      // Manually update the cache to reflect the edit
      queryClient.setQueryData<Todo[]>(["todos"], (oldTodos = []) =>
        oldTodos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
      );
      toast.success("Todo updated successfully!");
      onOpenChange(false); // Close the modal
    },
    onError: (error) => {
      console.error("Failed to edit todo:", error);
      toast.error("Error: This todo could not be edited.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoText.trim() || !todo) return;

    editTodo({
      id: todo.id,
      todo: todoText,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit todo</DialogTitle>
          <DialogDescription>
            Make changes to your todo here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input id="todo" value={todoText} onChange={(e) => setTodoText(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}