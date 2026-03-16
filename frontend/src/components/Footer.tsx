import React from 'react';
import { Link } from 'react-router-dom';
import { DermoraLogo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="
      bg-primary/10 text-slate-700
      dark:bg-slate-900 dark:text-slate-300
      py-16 px-6 md:px-10
      border-t border-pink-600 dark:border-slate-800
      transition-colors duration-300
    ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-pink-600 dark:text-pink-700">
            <DermoraLogo className="size-6" />
            <h2 className="text-xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">Dermora</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Science-led skincare formulations designed to restore your skin's natural vitality. Dermatologist tested, consumer loved.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-900 dark:text-white">Explore</h4>
          <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
            <li><a className="hover:text-pink-600 dark:hover:text-pink-700 transition-colors" href="#">Our Story</a></li>
            <li><Link className="hover:text-pink-600 dark:hover:text-pink-700 transition-colors" to="/assessment">Skin Quiz</Link></li>
            <li><a className="hover:text-pink-600 dark:hover:text-pink-700 transition-colors" href="#">Clinical Trials</a></li>
            <li><a className="hover:text-pink-600 dark:hover:text-pink-700 transition-colors" href="#">Ingredients Glossary</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-900 dark:text-white">Help</h4>
          <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
            <li><a className="hover:text-pink-600 dark:hover:text-pink-700 transition-colors" href="#">Shipping &amp; Returns</a></li>
            <li><Link className="hover:text-pink-600 dark:hover:text-pink-700 transition-colors" to="/orders">Track Order</Link></li>
            <li><a className="hover:text-pink-600 dark:hover:text-pink-700 transition-colors" href="#">Contact Us</a></li>
            <li><a className="hover:text-pink-600 dark:hover:text-pink-700 transition-colors" href="#">FAQ</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-900 dark:text-white">Join the Community</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Subscribe for skincare tips and early access.</p>
          <div className="flex gap-2">
            <input
              className="bg-white dark:bg-slate-800 border border-pink-100 dark:border-slate-700 rounded-lg py-2 px-4 text-sm w-full focus:outline-none focus:ring-1 focus:ring-pink-600 dark:focus:ring-pink-700 text-slate-800 dark:text-white placeholder-slate-400"
              placeholder="Email address"
              type="email"
            />
            <button className="bg-pink-600 dark:bg-pink-700 text-white p-2 rounded-lg hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-pink-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
        <p>© 2024 Dermora Skincare. All rights reserved.</p>
        <div className="flex gap-8">
          <a className="hover:text-pink-600 dark:hover:text-pink-700 transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-pink-600 dark:hover:text-pink-700 transition-colors" href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
