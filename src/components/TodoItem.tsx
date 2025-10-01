"use client";

import { Todo } from "@/lib/api";
import Link from "next/link";
import { MoreHorizontal, Trash2, Pencil, Eye, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  isHighlighted?: boolean;
}

export function TodoItem({ todo, onEdit, onToggle, onDelete, isHighlighted }: TodoItemProps) {
  // Stop link navigation when clicking on the dropdown trigger
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const cardClasses = [
    "bg-card text-card-foreground p-4 rounded-lg shadow h-full flex flex-col justify-between hover:shadow-md transition-all duration-300 relative border",
    isHighlighted ? "border-primary shadow-lg" : "border-transparent",
  ].join(" ");

  return (
    <div id={`todo-${todo.id}`} className={cardClasses} data-testid={`todo-item-${todo.id}`}>
      <Link href={`/todos/${todo.id}`} className="flex flex-col h-full">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
            {todo.id}
          </div>
          <p className={`flex-grow text-left font-semibold ${todo.completed ? "line-through text-gray-400" : ""}`}>
            {todo.todo}
          </p>
        </div>
        <div className="flex-grow"></div> {/* Spacer */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-4 pt-2 border-t">
          <span>Status: <span className={`font-bold ${todo.completed ? 'text-green-600' : 'text-yellow-600'}`}>{todo.completed ? "Completed" : "Pending"}</span></span>
          <span>User ID: {todo.userId}</span>
        </div>
      </Link>
      <div className="absolute top-2 right-2" onClick={handleDropdownClick}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onToggle(todo)}>
              {todo.completed ? (
                <><XCircle className="mr-2 h-4 w-4" /><span>Mark as Pending</span></>
              ) : (
                <><CheckCircle2 className="mr-2 h-4 w-4" /><span>Mark as Completed</span></>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onEdit(todo)}><Pencil className="mr-2 h-4 w-4" /><span>Edit</span></DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/todos/${todo.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete(todo)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /><span>Delete</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}