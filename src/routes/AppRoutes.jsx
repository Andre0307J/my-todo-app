import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import TodoList from "../pages/TodoList";
import TodoDetail from "../pages/TodoDetails";
import ErrorPage from "../pages/ErrorPage";
import ErrorTest from "../pages/ErrorTest";
import NotFound from "../pages/NotFound";

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
