/* eslint-disable react-refresh/only-export-components */

import { getTodo, Todo } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

// Using Next.js global PageProps helper with route literal
export async function generateMetadata(
  props: PageProps<"/todos/[id]">
): Promise<Metadata> {
  const params = await props.params;
  if (!params?.id) {
    return { title: "Todo Not Found" };
  }

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const todoId = Number(id);

  if (isNaN(todoId)) {
    return { title: "Todo Not Found" };
  }

  try {
    const todo = await getTodo(todoId);
    return { title: `Todo: ${todo.todo}` };
  } catch {
    return { title: "Todo Not Found" };
  }
}

export default async function TodoPage(
  props: PageProps<"/todos/[id]">
) {
  const params = await props.params;

  if (!params?.id) {
    notFound();
  }

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const todoId = Number(id);

  if (isNaN(todoId)) {
    notFound();
  }

  let todo: Todo;
  try {
    todo = await getTodo(todoId);
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/todos" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to List
          </Link>
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md border">
        <h1 className="text-3xl font-bold mb-4">{todo.todo}</h1>
        <div className="flex items-center gap-4 text-lg">
          <span className="font-semibold">Status:</span>
          {todo.completed ? (
            <span className="flex items-center gap-2 text-green-600">
              <CheckCircle size={20} /> Completed
            </span>
          ) : (
            <span className="flex items-center gap-2 text-yellow-600">
              <XCircle size={20} /> Pending
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
