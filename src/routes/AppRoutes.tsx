import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// Lazily load page components for better performance
const MainLayout = lazy(() => import("@/layout/MainLayout"));
const TodoList = lazy(() => import("@/pages/TodoList"));
const TodoDetail = lazy(() => import("@/pages/TodoDetails"));
const ErrorPage = lazy(() => import("@/pages/ErrorPage"));
const ErrorTest = lazy(() => import("@/pages/ErrorTest"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <TodoList /> },
      { path: "todos/:id", element: <TodoDetail />, errorElement: <ErrorPage /> },
      { path: "error-test", element: <ErrorTest /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
