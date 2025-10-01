"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-5xl font-bold mb-4">Todo App</h1>
      <div className="p-8 rounded-lg bg-card border">
        <h2 className="text-md md:text-lg font-medium">
          Hi there! <br />
          <br />
          This is a Todo List application which you can use to manage your
          tasks.
        </h2>

        <div className="mt-4 text-sm md:text-lg font-medium">
          This project built on Next.js framework, Tailwind CSS, and ShadCN/ui
          components and <br />
          has a realtime chatting feature.
        </div>

        <div className="mt-4 text-sm md:text-lg font-medium">
          The tasks are fetched from the DummyJson API.
        </div>

        <div className="mt-4 text-sm md:text-lg font-medium">
          <p>Created by Ozomma Chukwuemeka Andre</p>
          <p>AltSchool ID: ALT/SOE/024/4767</p>
        </div>

        <div className="mt-8">
          <Link
            href="/todos"
            className="text-primary hover:underline font-semibold"
          >
            Go to Todo List
          </Link>
        </div>
      </div>
    </main>
  );
}
