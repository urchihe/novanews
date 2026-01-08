import api from "@/src/services/api";
import { Source } from "@/types";

export const sourceService = {
  getAll: async (): Promise<Source[]> => {
    const { data } = await api.get<{ data: Source[] }>("/api/sources");
    return data.data;
  },
};
