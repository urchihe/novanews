import React, { useState, useEffect } from "react";
import { User } from "@/types";
import { UserPreferences } from "@/types";

interface NavbarProps {
  user: User | null;
  onSearch: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenPrefs: () => void;
  userPrefs: UserPreferences;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  onSearch,
  onOpenAuth,
  onLogout,
  onOpenPrefs,
  userPrefs,
}) => {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchInput);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, onSearch]);

  const hasActivePrefs = Boolean(
    userPrefs &&
    (userPrefs.categories?.length ||
      userPrefs.sources?.length ||
      userPrefs.authors?.length ||
      userPrefs.fromDate ||
      userPrefs.toDate),
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
              onClick={() => window.location.reload()}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-bolt text-white"></i>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">
                NovaNews
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 sm:mx-8">
            <form className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search world news..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Preferences always visible */}
            <button
              onClick={onOpenPrefs}
              className={`relative p-2 rounded-full transition-colors
                  ${
                    hasActivePrefs
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  }
                `}
              title={
                hasActivePrefs
                  ? "Filters applied (click to edit)"
                  : "Set your preferences"
              }
            >
              <i className="fa-solid fa-sliders"></i>

              {/* Active indicator dot */}
              {hasActivePrefs && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

            {user?.id ? (
              // Logged-in
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  className="hidden sm:block text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Logged-out
              <button
                onClick={onOpenAuth}
                className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
