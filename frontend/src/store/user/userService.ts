import api from "../../services/api";
import { User, UserPreferences } from "@/types";
import { STORAGE_KEYS } from "@/constants";

export const userService = {
  fetchUser: async (): Promise<User> => {
    const { data } = await api.get<User>("/api/me");
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
    return data;
  },

  updatePreferences: async (prefs: UserPreferences): Promise<User> => {
    const { data } = await api.patch<User>("/api/me/preferences", prefs);
    return data;
  },
};
