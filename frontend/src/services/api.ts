import axios from "axios";
import { STORAGE_KEYS } from "@/constants";

const API_HOST = import.meta.env.VITE_API_HOST;

// Set global defaults first (outside of axios.create)
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const api = axios.create({
  baseURL: API_HOST,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// Call this before any POST/PUT/DELETE request
export const getCsrfCookie = () => api.get("/sanctum/csrf-cookie");

// Add Bearer token automatically if user is logged in
api.interceptors.request.use(
  async (config) => {
    // Ensure CSRF cookie is set before protected requests
    if (["post", "put", "patch", "delete"].includes(config.method || "")) {
      await getCsrfCookie();
    }

    // Get user from localStorage
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (storedToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${storedToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    return Promise.reject(error);
  },
);

export default api;
