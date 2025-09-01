import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTodoFilters } from "@/hooks/useTodoFilters";
import { usePagination } from "@/hooks/usePagination";
import { getAllTodos } from "@/lib/todoApi";
import { getCache, setCache } from "@/lib/cache";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TodoItem from "@/components/TodoItems";
import TodoForm from "@/components/TodoForm";
import Spinner from "@/components/Spinner";
import { Todo } from "@/types/todo";
import styles from "@/styles/TodoList.module.css";

export default function TodoList() {
  const [showAddModal, setShowAddModal] = useState(false);

  const cachedTodos = getCache("todos");

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const data = await getAllTodos();
      setCache("todos", data);
      return data;
    },
    // Only use initialData if the cache is populated with a non-empty array.
    // If cache is empty (e.g. getCache("todos") returns [] or undefined),
    // initialData will be undefined, forcing getAllTodos to run.
    initialData: Array.isArray(cachedTodos) && cachedTodos.length > 0 ? cachedTodos : undefined,
    // For DummyJSON, make optimistic updates to the list "stick" longer
    // by preventing immediate refetches that would revert non-persisted changes.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredTodos,
  } = useTodoFilters(todos);

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(filteredTodos);

  if (isLoading) return <Spinner />;
  if (isError) return <p role="alert">Error: {error.message}</p>;

  return (
    <main className={styles.todoListContainer} role="main" tabIndex={-1}>
      <h1>Todo List</h1>

      <section className={styles.controls} aria-label="Todo Filters">
        <label htmlFor="searchInput" className="visually-hidden">
          Search Todos
        </label>
        <input
          id="searchInput"
          type="text"
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <label htmlFor="statusFilter" className="visually-hidden">
          Filter by Status
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </section>

      <section className={styles.addButtonWrapper} aria-label="Add Todo">
        <Button
          onClick={() => setShowAddModal(true)}
          className={styles.addButton}
        >
          ➕ Add Todo
        </Button>
      </section>

      <section className={styles.todoList} aria-label="Todo Items">
        {paginatedData.length === 0 ? (
          <p>No matching todos found.</p>
        ) : (
          paginatedData.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </section>

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageButton}
            aria-label="Previous Page"
          >
            &laquo; Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={
                page === currentPage ? styles.activePage : styles.pageButton
              }
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
            aria-label="Next Page"
          >
            Next &raquo;
          </button>
        </nav>
      )}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Todo</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new task to your todo list.
            </DialogDescription>
          </DialogHeader>
          <TodoForm
            // This function will be called by TodoForm AFTER successful submission and query invalidation
            onFormSubmitSuccess={() => {
              setShowAddModal(false);
            }}
            onCancel={() => setShowAddModal(false)}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
