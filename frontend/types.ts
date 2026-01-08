
export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  source: string;
  category: string;
  publishedAt: string;
  urlToImage: string;
  url: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  sources: string[];
  categories: string[];
  authors: string[];
  fromDate: string;
  toDate: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export enum NewsSource {
  THE_GUARDIAN = 'The Guardian',
  NYT = 'New York Times',
  BBC = 'BBC News',
  NEWS_API = 'NewsAPI.org',
  OPEN_NEWS = 'OpenNews'
}

export enum NewsCategory {
  GENERAL = 'General',
  TECHNOLOGY = 'Technology',
  BUSINESS = 'Business',
  HEALTH = 'Health',
  SCIENCE = 'Science',
  SPORTS = 'Sports',
  ENTERTAINMENT = 'Entertainment'
}

export interface Source {
  id: number;
  name: string;
  slug?: string;
}

export interface Author {
  id: number;
  name: string;
  slug?: string;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

