import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Author } from "@/types";
import { authorService } from "./authorService";

interface AuthorState {
  authors: Author[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthorState = {
  authors: [],
  loading: false,
  error: null,
};

// Async thunk to fetch authors
export const fetchAuthors = createAsyncThunk(
  "authors/fetchAuthors",
  async () => {
    return await authorService.getAll();
  },
);

const authorSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {
    clearAuthors(state) {
      state.authors = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAuthors.fulfilled,
        (state, action: PayloadAction<Author[]>) => {
          state.loading = false;
          state.authors = action.payload;
        },
      )
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load authors";
      });
  },
});

export const { clearAuthors } = authorSlice.actions;
export default authorSlice.reducer;
