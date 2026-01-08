import api from "../../services/api";
import { User } from "@/types";
import { STORAGE_KEYS } from "@/constants";

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<User> => {
    const { data: user } = await api.post<User>("/api/register", data);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  login: async (data: { email: string; password: string }): Promise<User> => {
    const { data: user } = await api.post<User>("/api/login", data);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  logout: async () => {
    return await api.post("/api/logout");
  },
};
