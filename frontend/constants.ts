
import { NewsSource, NewsCategory } from './types';

export const SOURCES = [
  NewsSource.THE_GUARDIAN,
  NewsSource.NYT,
  NewsSource.BBC,
  NewsSource.NEWS_API,
  NewsSource.OPEN_NEWS
];

export const CATEGORIES = [
  NewsCategory.GENERAL,
  NewsCategory.TECHNOLOGY,
  NewsCategory.BUSINESS,
  NewsCategory.HEALTH,
  NewsCategory.SCIENCE,
  NewsCategory.SPORTS,
  NewsCategory.ENTERTAINMENT
];

export const STORAGE_KEYS = {
  USER: 'novanews_user',
  ARTICLES: 'novanews_articles',
  PREFERENCES: 'novanews_preferences',
  TOKEN: 'novanews_token',
};
