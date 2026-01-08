import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";
import { authService } from "./authService";
import { STORAGE_KEYS } from "@/constants";
import toast from "react-hot-toast";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null"),
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    payload: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.register(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);

export const logoutUser = createAsyncThunk("/api/logout", async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
        localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        toast.error(
          action.payload?.response?.data?.message || "Registration failed",
        );
        state.error = action.payload?.response?.data || null;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
        localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload?.response?.data?.message || "Login failed");
        state.error = action.payload?.response?.data || null;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
