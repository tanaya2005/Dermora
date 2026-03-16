import React from 'react';
import { Link } from 'react-router-dom';
import { DermoraLogo } from './Logo';
import { useTheme } from '../ThemeContext';

export const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="fixed top-4 left-0 z-50 w-full px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-pink-200 shadow-[0_0_15px_var(--color-pink-100)] dark:border-primary/30 dark:shadow-[0_0_15px_rgba(212,86,122,0.2)] rounded-full px-6 py-3 transition-colors duration-300">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <DermoraLogo className="size-8" />
            <h2 className="text-2xl font-serif font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">Dermora</h2>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors" to="/products">Shop All</Link>
            <Link className="text-sm font-medium hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors" to="/assessment">Skin Quiz</Link>
            <Link className="text-sm font-medium hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors" to="/subscriptions">Subscriptions</Link>
            <Link className="text-sm font-medium hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors" to="/consult">Consult</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-primary/10 transition-colors flex items-center justify-center"
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 text-xl">search</span>
            <input className="w-64 bg-primary/5 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary dark:text-white transition-colors duration-300" placeholder="Search skincare..." />
          </div>
          <Link to="/mylist" className="p-2 rounded-full hover:bg-primary/10 transition-colors" aria-label="My List">
            <span className="material-symbols-outlined">favorite</span>
          </Link>
          <Link to="/cart" className="p-2 rounded-full hover:bg-primary/10 transition-colors relative" aria-label="My Cart">
            <span className="material-symbols-outlined">shopping_bag</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
          </Link>
          <Link to="/login" className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
