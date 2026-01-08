import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import articleReducer from "./article/articleSlice";
import sourceSlice from "./source/sourceSlice";
import authorSlice from "./author/authorSlice";
import categorySlice from "./category/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    articles: articleReducer,
    authors: authorSlice,
    sources: sourceSlice,
    categories: categorySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
