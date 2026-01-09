import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/src/store';
import { Form } from "antd";

import Layout from '@/src/components/Layout';
import Navbar from '@/src/components/Navbar';
import ArticleCard from '@/src/components/ArticleCard';
import AuthModal from '@/src/components/AuthModal';
import PreferenceCenter from '@/src/components/PreferenceCenter';

import { UserPreferences } from './types';
import { loginUser, logoutUser, registerUser, clearAuth } from '@/src/store/auth/authSlice';
import { fetchUser, updatePreferences, clearUser } from '@/src/store/user/userSlice';
import { fetchArticles, resetArticles } from '@/src/store/article/articleSlice';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [form] = Form.useForm();

  const authUser = useSelector((state: RootState) => state.auth.user);
  const user = useSelector((state: RootState) => state.user.user);
  const { articles = [], currentPage, hasMore, loading: articlesLoading } = useSelector(
    (state: RootState) => state.articles
  );

  const [showAuth, setShowAuth] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const [categories, setCategories] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  

  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
  sources: [],
  categories: [],
  authors: [],
  fromDate: null,
  toDate: null,
});

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(resetArticles());
    dispatch(clearAuth());
    dispatch(fetchArticles({page: 1, filters: {}}));
  }, []);

  /** Infinite scroll */
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading &&
      hasMore
    ) {
      dispatch(fetchArticles({page: currentPage + 1, filters: {
        keyword: searchQuery || undefined,
        ...userPrefs,
      },} ));
    }
  }, [dispatch, articlesLoading, currentPage, hasMore, userPrefs]);

  /** Watch search query and filters to auto-fetch articles */
 useEffect(() => {
  dispatch(resetArticles());
  const filters = {
    keyword: searchQuery || undefined,
    ...userPrefs,
  };

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined)
  );

  dispatch(
    fetchArticles({
      page: 1,
      filters: cleanFilters,
    })
  );
}, [
  dispatch,
  searchQuery,
  categories,
  sources,
  authors,
  fromDate,
  toDate,
  userPrefs,
]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /** Auth handlers */
  const handleLogin = (email: string, password: string) => {
    setLoading(true);
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        dispatch(fetchUser());
        setShowAuth(false)
        form.resetFields();
        setLoading(false);
      }).catch((err) => {
        console.log("Login error:", err);
        setLoading(false);
      });
  };

  const handleRegistration = (
  email: string, 
  name: string, 
  password: string, 
  confirmPassword: string
) => {
  setLoading(true);
  dispatch(registerUser({ name, email, password, password_confirmation: confirmPassword }))
    .unwrap()
    .then(() => {
      dispatch(fetchUser());
      setShowAuth(false)
      form.resetFields();
    })
    .catch((err) => {
      setLoading(false);
      console.error("Registration error:", err);
    });
};
  const handleLogout = () => {
    dispatch(logoutUser()).unwrap()
    .then(() => {
      dispatch(fetchUser());
      dispatch(clearAuth());
      dispatch(clearUser())
    });
  };

  /** Preferences */
  const handleSavePrefs = (prefs: UserPreferences) => {
    dispatch(updatePreferences(prefs))
      .unwrap()
      .then(() => {
        dispatch(fetchUser());
        setShowPrefs(false);
      });
  };

  useEffect(() => {
  
  setUserPrefs({
    sources: user?.preferences?.sources ?? [],
    categories: user?.preferences?.categories ?? [],
    authors: user?.preferences?.authors ?? [],
    fromDate: user?.preferences?.from_date ?? null,
    toDate: user?.preferences?.to_date ?? null,
  });
}, [user]);

  const handleApplyFilters = (data) => {
    setCategories(data.category);
    setSources(data.sources);
    setAuthors(data.authors);
    setFromDate(data.fromDate);
    setToDate(data.toDate);
  }

  return (
    <Layout
      navbar={
        <Navbar
          user={user || authUser}
          onSearch={setSearchQuery}
          onOpenAuth={() => setShowAuth(true)}
          onLogout={handleLogout}
          onOpenPrefs={() => setShowPrefs(true)}
          userPrefs={userPrefs}
        />
      }
    >
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold">
          {user ? `Welcome, ${user.name}` : 'Stay Informed.'}
        </h1>
      </header>

     {!articlesLoading && !articles.length ? (
      <div className="text-center py-20">
        <span className="text-gray-500">No articles found</span>
      </div>
    ) : articles.length ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
        {articlesLoading && (
          <div className="col-span-full text-center py-8">
            <span className="text-gray-500">Loading more articles...</span>
          </div>
        )}
      </div>
    ) : (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold">Loading articles...</h3>
      </div>
    )}
      {showAuth && (
        <AuthModal
          form={form}
          onClose={() => {
          setShowAuth(false)
          dispatch(clearAuth());
          }}
          loading={loading}
          onLogin={handleLogin}
          onRegistration={handleRegistration}
        />
      )}

      {showPrefs && (
        <PreferenceCenter
          preferences={userPrefs}
          user={user}
          onSave={handleSavePrefs}
          onClose={() => setShowPrefs(false)}
          onApplyFilter={handleApplyFilters}
          setUserPrefs={setUserPrefs}
        />
      )}
    </Layout>
  );
};

export default App;
