"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMemo } from "react";

interface AdvancedPaginationProps {
  currentPage: number;
  totalPages: number;
  createQueryString: (params: Record<string, string | number | null>) => string;
  pathname: string;
}

const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less, display all page numbers
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export function AdvancedPagination({
  currentPage,
  totalPages,
  createQueryString,
  pathname,
}: AdvancedPaginationProps) {
  const paginationRange = useMemo(
    () => generatePagination(currentPage, totalPages),
    [currentPage, totalPages]
  );

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`${pathname}?${createQueryString({ page: Math.max(1, currentPage - 1) })}`}
            className={currentPage === 1 ? "pointer-events-none text-muted-foreground" : ""}
          />
        </PaginationItem>
        {paginationRange.map((page, index) => {
          if (typeof page === "string") {
            return <PaginationEllipsis key={`ellipsis-${index}`} />;
          }
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={`${pathname}?${createQueryString({ page })}`}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href={`${pathname}?${createQueryString({ page: Math.min(totalPages, currentPage + 1) })}`}
            className={currentPage === totalPages ? "pointer-events-none text-muted-foreground" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

