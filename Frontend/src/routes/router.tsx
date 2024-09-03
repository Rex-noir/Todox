import { createBrowserRouter, Navigate } from "react-router-dom";
import Todos from "@/Pages/Todo/Todos";
import { ViewProject } from "@/Pages/ViewProject";
import { TodayPage } from "@/Pages/Today";
import { Auth } from "@/Pages/Auth/Auth";
import { LoginPage } from "@/Pages/Auth/LoginPage";
import RegisterPage from "@/Pages/Auth/RegisterPage";
import { authRequired } from "@/utils/routeLoaders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/app"} />,
  },
  {
    path: "/app",
    element: <Todos />,
    loader: authRequired,
    children: [
      {
        path: "",
        element: <Navigate to={"/app/today"} />,
      },
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
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
      {
        path: "/auth/login",
        element: <LoginPage />,
      },
      {
        path: "/auth/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
