import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { useEffect } from "react";
import api from "./api";

function App() {
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await api.get("/csrf-cookie");
      } catch (error) {
        console.error("Failed to fetch CSRF cookie:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
