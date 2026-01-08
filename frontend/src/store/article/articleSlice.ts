import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Article } from "@/types";
import { articleService } from "./articleService";

interface ArticleState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
}

const initialState: ArticleState = {
  articles: [],
  loading: false,
  error: null,
  currentPage: 0,
  lastPage: 1,
  hasMore: true,
};

// Fetch articles with pagination
export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async ({
    page = 1,
    filters = {},
  }: {
    page?: number;
    filters?: Record<string, any>;
  }) => {
    return await articleService.getArticles(page, filters);
  },
);

// Create a new article
export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (article: Article) => {
    return await articleService.createArticle(article);
  },
);

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    resetArticles(state) {
      state.articles = [];
      state.currentPage = 0;
      state.lastPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ARTICLES
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        const { data, current_page, last_page } = action.payload;

        if (current_page === 1) {
          state.articles = data; // first page
        } else {
          state.articles = [...state.articles, ...data];
        }

        state.currentPage = current_page;
        state.lastPage = last_page;
        state.hasMore = current_page < last_page;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      // CREATE ARTICLE
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createArticle.fulfilled,
        (state, action: PayloadAction<Article>) => {
          state.loading = false;
          state.articles.unshift(action.payload);
        },
      )
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { resetArticles } = articleSlice.actions;
export default articleSlice.reducer;
