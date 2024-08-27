import { Todos } from "@/Pages/Todos";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },

  {
    path: "/todos",
    element: <Todos />,
  },
]);

export default router;
