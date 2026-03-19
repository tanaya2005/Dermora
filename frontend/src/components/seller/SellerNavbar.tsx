import React from 'react';
import { Menu, Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../ThemeContext';

interface SellerNavbarProps {
  onMenuClick: () => void;
  title: string;
}

export const SellerNavbar: React.FC<SellerNavbarProps> = ({ onMenuClick, title }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-pink-100 dark:border-slate-700/50 shadow-sm">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-pink-50"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-serif">{title}</h1>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right: Theme + Notifications + Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-primary transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="relative w-9 h-9 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-primary transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-gray-200 dark:border-slate-600 ml-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              {user?.name?.split(' ')[0] || 'Seller'}
            </p>
            <p className="text-xs text-gray-400">Seller</p>
          </div>
        </div>
      </div>
    </header>
  );
};
