import { createBrowserRouter, Navigate } from "react-router-dom";
import { Todos } from "@/Pages/Todo/Todos";
import { ViewProject } from "@/Pages/ViewProject";
import { TodayPage } from "@/Pages/Today";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/app",
    element: <Todos />,
    children: [
      {
        path: "/app/projects",
        element: <Navigate to={"/app/today"} />,
      },
      {
        path: "/app/projects/:projectId",
        element: <ViewProject />,
      },
      {
        path: "/app/today",
        element: <TodayPage />,
      },
      {
        path: "/app/important",
        element: <TodayPage />,
      },
    ],
  },
]);

export default router;
