"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DeleteTodoDialog } from "@/components/DeleteTodoDialog";
import Spinner from "@/components/Spinner";
import { TodoItem } from "@/components/TodoItem";
import { AdvancedPagination } from "@/components/AdvancedPagination";
import { EditTodoDialog } from "@/components/EditTodoDialog";
import { AddTodoDialog } from "@/components/AddTodoDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTodos, Todo, updateTodo, deleteTodo } from "@/lib/api";

const PAGE_SIZE = 12;

export default function TodosClient() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageParams = new URLSearchParams(searchParams.toString());

  const currentPage = Number(pageParams.get("page")) || 1;
  const filter = pageParams.get("filter") || "all";

  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [highlightedTodoId, setHighlightedTodoId] = useState<number | null>(null);

  useEffect(() => {
    setHighlightedTodoId(Number(window.location.hash.replace("#todo-", "")));
  }, [searchParams]);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const {
    data: queryResponse,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["todos", currentPage, filter],
    queryFn: () =>
      getTodos({
        limit: PAGE_SIZE,
        skip: (currentPage - 1) * PAGE_SIZE,
      }),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (queryResponse?.todos) {
      queryResponse.todos.forEach((todo) => {
        queryClient.setQueryData(["todo", todo.id], todo);
      });
    }
  }, [queryResponse, queryClient]);

  // Scroll to highlighted todo
  useEffect(() => {
    if (highlightedTodoId) {
      const element = document.getElementById(`todo-${highlightedTodoId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedTodoId, queryResponse]);

  const todos = queryResponse?.todos;

  const filteredTodos = useMemo(() => {
    if (!todos) return [];

    let result = todos;

    if (filter !== "all") {
      result = result.filter((t) => t.completed === (filter === "completed"));
    }

    return result;
  }, [todos, filter]);

  const totalPages = queryResponse
    ? Math.ceil(queryResponse.total / PAGE_SIZE)
    : 0;

  const { mutate: toggleTodo } = useMutation<
    Todo,
    Error,
    { id: number; completed: boolean },
    { previousTodosResponse: Awaited<ReturnType<typeof getTodos>> | undefined }
  >({
    mutationFn: updateTodo,
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({
        queryKey: ["todos", currentPage, filter],
      });

      const previousTodosResponse =
        queryClient.getQueryData<Awaited<ReturnType<typeof getTodos>>>(
          ["todos", currentPage, filter]
        );

      queryClient.setQueryData(
        ["todos", currentPage, filter],
        (old: Awaited<ReturnType<typeof getTodos>> | undefined) =>
          !old
            ? undefined
            : {
                ...old,
                todos: old.todos.map((todo) =>
                  todo.id === updatedTodo.id
                    ? { ...todo, completed: updatedTodo.completed }
                    : todo
                ),
              }
      );

      return { previousTodosResponse };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(
        ["todos", currentPage, filter],
        context?.previousTodosResponse
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", currentPage, filter] });
    },
  });

  const { mutate: removeTodo } = useMutation<Todo, Error, number>({
    mutationFn: deleteTodo,
    onSuccess: () => {
      toast.success("Todo deleted successfully!");
      setTodoToDelete(null);

      // If the last item on a page is deleted, navigate to the previous page.
      if (filteredTodos.length === 1 && currentPage > 1) {
        router.push(
          `${pathname}?${createQueryString({ page: currentPage - 1 })}`
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: ["todos", currentPage, filter],
        });
      }
    },
    onError: (error) => {
      console.error("Failed to delete todo:", error);
      toast.error(
        "Error: This todo could not be deleted. (Newly created todos cannot be deleted from the mock API)."
      );
      setTodoToDelete(null);
    },
  });

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      removeTodo(todoToDelete.id);
    }
  };

  const handleToggleTodo = (todo: Todo) => {
    toggleTodo({ id: todo.id, completed: !todo.completed });
  };

  if (isLoading || (isFetching && !queryResponse?.todos.length)) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Spinner size="large" />
        <p className="text-muted-foreground">
          {currentPage > 1 ? "Fetching more Todos..." : "Fetching Todos..."}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-10 text-red-500">
        Error fetching todos.
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <Link href="/">
          <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
            My Todos
          </h1>
        </Link>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <Select
            value={filter}
            onValueChange={(newFilter) =>
              router.push(
                `${pathname}?${createQueryString({ filter: newFilter, page: 1 })}`
              )
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-full sm:w-auto">
            <AddTodoDialog />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTodos.map((todo) => (
          <TodoItem
            isHighlighted={todo.id === highlightedTodoId}
            key={todo.id}
            todo={todo}
            onEdit={setTodoToEdit}
            onToggle={handleToggleTodo}
            onDelete={setTodoToDelete}
          />
        ))}
      </div>
      <AdvancedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        createQueryString={createQueryString}
        pathname={pathname}
      />
      <DeleteTodoDialog
        todo={todoToDelete}
        open={!!todoToDelete}
        onOpenChange={() => setTodoToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
      <EditTodoDialog
        todo={todoToEdit}
        open={!!todoToEdit}
        onOpenChange={() => setTodoToEdit(null)}
      />
    </main>
  );
}
