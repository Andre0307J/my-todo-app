import { useState, useMemo } from "react";
import { Todo } from "@/types/todo";

export function useTodoFilters(todos: Todo[] | undefined) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTodos = useMemo(() => {
    if (!todos) return [];

    return todos.filter((todo) => {
      const matchesSearch = todo.todo
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && todo.completed) ||
        (statusFilter === "incomplete" && !todo.completed);

      return matchesSearch && matchesStatus;
    });
  }, [todos, searchTerm, statusFilter]);

  return { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredTodos };
}