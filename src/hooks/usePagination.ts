import { useState, useMemo, useEffect } from "react";
import { Todo } from "@/types/todo";

const ITEMS_PER_PAGE = 10;

export function usePagination(data: Todo[]) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(data.length / ITEMS_PER_PAGE),
    [data.length]
  );

  // Effect to reset page when data changes and current page is no longer valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  };
}