import { STORAGE_KEYS } from "../../constants";
import { User, Article, UserPreferences } from "../../types";

/** Save user separately */
export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/** Get user */
export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

/** Save auth token separately */
export const saveToken = (token: string) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/** Get auth token */
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/** Remove token and user */
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/** Save articles */
export const saveArticles = (articles: Article[]) => {
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
};

/** Get articles */
export const getArticles = (): Article[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
  return data ? JSON.parse(data) : [];
};

/** Update user preferences and persist */
export const updatePreferences = (prefs: UserPreferences) => {
  const user = getUser();
  if (user) {
    const updatedUser = { ...user, preferences: prefs };
    saveUser(updatedUser);
    return updatedUser;
  }
  return null;
};
