import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DermoraLogo } from './Logo';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className={`fixed top-4 left-0 z-50 w-full px-6 md:px-10 transition-all duration-300 ${
      isScrolled ? 'top-0 px-0' : ''
    }`}>
      <div className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 ${
        isScrolled 
          ? 'navbar-blur border-b border-slate-200 dark:border-slate-700 rounded-none px-8 py-4' 
          : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-full px-6 py-3'
      }`}>
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <DermoraLogo className="size-8" />
            <h2 className="text-2xl font-display font-bold tracking-tight text-primary dark:text-secondary transition-colors duration-300">Dermora</h2>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-accent dark:text-slate-300 dark:hover:text-accent transition-colors" to="/products">Shop All</Link>
            <Link className="text-sm font-medium hover:text-accent dark:text-slate-300 dark:hover:text-accent transition-colors" to="/dermatologists">Dermatologists</Link>
            <Link className="text-sm font-medium hover:text-accent dark:text-slate-300 dark:hover:text-accent transition-colors" to="/skin-analysis">Skin Analysis</Link>
            <Link className="text-sm font-medium hover:text-accent dark:text-slate-300 dark:hover:text-accent transition-colors" to="/assessment">Skin Quiz</Link>
            <Link className="text-sm font-medium hover:text-accent dark:text-slate-300 dark:hover:text-accent transition-colors" to="/subscriptions">Dermora Pro</Link>
            {user?.role === 'SELLER' && (
              <Link className="text-sm font-medium hover:text-accent dark:text-slate-300 dark:hover:text-accent transition-colors" to="/seller/dashboard-new">My Store</Link>
            )}
            {user?.role === 'DERMATOLOGIST' && (
              <Link className="text-sm font-medium hover:text-accent dark:text-slate-300 dark:hover:text-accent transition-colors" to="/dermatologist/dashboard">My Practice</Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link className="text-sm font-medium hover:text-accent dark:text-slate-300 dark:hover:text-accent transition-colors" to="/admin">Admin</Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-accent/10 transition-colors flex items-center justify-center"
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-accent/60 text-xl">search</span>
            <input className="w-64 bg-secondary/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-accent dark:text-white transition-colors duration-300" placeholder="Search skincare..." />
          </div>
          {user && user.role === 'BUYER' && (
            <>
              <Link to="/mylist" className="p-2 rounded-full hover:bg-accent/10 transition-colors" aria-label="My List">
                <span className="material-symbols-outlined">favorite</span>
              </Link>
              <Link to="/cart" className="p-2 rounded-full hover:bg-accent/10 transition-colors relative" aria-label="My Cart">
                <span className="material-symbols-outlined">shopping_bag</span>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
              </Link>
              <Link to="/orders" className="p-2 rounded-full hover:bg-accent/10 transition-colors" aria-label="Orders">
                <span className="material-symbols-outlined">receipt_long</span>
              </Link>
            </>
          )}
          
          {user ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-accent/10 transition-colors"
                aria-label="Logout"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="p-2 rounded-full hover:bg-accent/10 transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
