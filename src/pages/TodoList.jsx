import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../lib/todoApi";
import { getCache, setCache } from "../lib/cache";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TodoItem from "../components/TodoItems";
import TodoForm from "../components/TodoForm";
import Spinner from "../components/Spinner";
import styles from "../styles/TodoList.module.css";

const ITEMS_PER_PAGE = 10;

export default function TodoList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    initialData: getCache("todos"),
    onSuccess: (data) => setCache("todos", data),
  });

  const filteredTodos = useMemo(() => {
    return (todos ?? []).filter((todo) => {
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

  const paginatedTodos = useMemo(() => {
    return filteredTodos.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredTodos, currentPage]);

  const totalPages = useMemo(
    () => Math.ceil(filteredTodos.length / ITEMS_PER_PAGE),
    [filteredTodos.length]
  );

  if (isLoading) return <Spinner />;
  if (isError) return <p role="alert">Error: {error.message}</p>;

  return (
    <main className={styles.todoListContainer} role="main">
      <h1 tabIndex="0">Todo List</h1>

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
        {paginatedTodos.length === 0 ? (
          <p>No matching todos found.</p>
        ) : (
          paginatedTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
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
