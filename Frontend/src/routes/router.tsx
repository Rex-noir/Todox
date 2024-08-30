import { createBrowserRouter, Navigate } from "react-router-dom";
import { Todos } from "@/Pages/Todo/Todos";
import { ViewProject } from "@/Pages/ViewProject";

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
        path: "/app/:viewType/:projectId",
        element: <ViewProject />,
      },
      {
        path: "/app/:viewType",
        element: <ViewProject />,
      },
      {
        path: "/app/:viewType",
        element: <ViewProject />,
      },
    ],
  },
]);

export default router;
