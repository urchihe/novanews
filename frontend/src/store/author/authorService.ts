import api from "@/src/services/api";
import { Author } from "@/types";

export const authorService = {
  getAll: async (): Promise<Author[]> => {
    const { data } = await api.get<{ data: Author[] }>("/api/authors");
    return data.data;
  },
};
