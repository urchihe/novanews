import api from "../../services/api";
import { Article } from "@/types";
import { STORAGE_KEYS } from "@/constants";

interface PaginatedArticles {
  data: Article[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const articleService = {
  getArticles: async (
    page = 1,
    filters: Record<string, any> = {},
  ): Promise<PaginatedArticles> => {
    console.log("filter", filters);

    const { data } = await api.get<PaginatedArticles>("/api/articles", {
      params: {
        page,
        ...filters,
      },
    });

    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(data.data));

    return data;
  },

  createArticle: async (article: Article): Promise<Article> => {
    const { data } = await api.post<Article>("/api/articles", article);
    return data;
  },
};
