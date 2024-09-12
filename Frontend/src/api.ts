import axios, { isAxiosError } from "axios";
import { ApiResponse } from "./interfaces/types";
import { toast } from "sonner";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      const e = error.response?.data as ApiResponse;

      toast.error(e.message);
    }
  },
);
export default api;
