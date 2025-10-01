"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addTodo, Todo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function AddTodoDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [todoText, setTodoText] = useState("");

  const { mutate: createTodo, isPending } = useMutation({
    mutationFn: addTodo,
    onSuccess: (newTodo) => {
      // Manually update the cache to include the new todo
      // This avoids refetching, which would fail with the mock API
      queryClient.setQueryData<Todo[]>(["todos"], (oldTodos = []) => [
        newTodo,
        ...oldTodos,
      ]);
      toast.success("Todo added successfully!");
      setTodoText(""); // Clear the input
      setOpen(false); // Close the modal
    },
    onError: (error) => {
      // You can add a toast notification here for the user
      console.error("Failed to add todo:", error);
      toast.error("Failed to add todo.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoText.trim()) return;

    createTodo({
      todo: todoText,
      completed: false,
      userId: 5, // DummyJSON requires a userId, let's use a static one
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Todo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new todo</DialogTitle>
          <DialogDescription>
            What do you need to get done?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input id="todo" value={todoText} onChange={(e) => setTodoText(e.target.value)} placeholder="e.g. Buy milk" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>{isPending ? "Adding..." : "Add Todo"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}