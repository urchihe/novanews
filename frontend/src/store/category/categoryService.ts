import api from "@/src/services/api";
import { Category } from "@/types";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<{ data: Category[] }>("/api/categories");
    return data.data;
  },
};
