import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Source } from "@/types";
import { sourceService } from "./sourceService";

interface SourceState {
  sources: Source[];
  loading: boolean;
  error: string | null;
}

const initialState: SourceState = {
  sources: [],
  loading: false,
  error: null,
};

// Async thunk to fetch sources
export const fetchSources = createAsyncThunk(
  "sources/fetchSources",
  async () => {
    return await sourceService.getAll();
  },
);

const sourceSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {
    clearSources(state) {
      state.sources = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSources.fulfilled,
        (state, action: PayloadAction<Source[]>) => {
          state.loading = false;
          state.sources = action.payload;
        },
      )
      .addCase(fetchSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load sources";
      });
  },
});

export const { clearSources } = sourceSlice.actions;
export default sourceSlice.reducer;
