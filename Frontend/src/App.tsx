import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { useEffect } from "react";
import api from "./api";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

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
      <ThemeProvider defaultTheme="system" storageKey="todox-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;
