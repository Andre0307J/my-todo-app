import { Suspense } from "react";
import TodosClient from "./TodosClient";
import Spinner from "@/components/Spinner";
import { Chat } from "@/components/Chat";

export default function TodosPage() {
  return (
    <>
      <main className="container mx-auto py-8 px-4">
        <Suspense fallback={<div className="flex justify-center items-center h-96"><Spinner size="large" /></div>}>
          <TodosClient />
        </Suspense>
      </main>
      <Chat />
    </>
  );
}