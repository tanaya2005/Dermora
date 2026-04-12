import React from 'react';
import { Link } from 'react-router-dom';
import { DermoraLogo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="
      bg-secondary/50 text-slate-700
      dark:bg-slate-900 dark:text-slate-300
      py-16 px-6 md:px-10
      border-t border-slate-200 dark:border-slate-800
      transition-colors duration-300
    ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-accent">
            <DermoraLogo className="size-6" />
            <h2 className="text-xl font-display font-bold tracking-tight text-primary dark:text-secondary">Dermora</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Skincare, backed by science. Trusted by dermatologists. 
            Discover personalized routines powered by AI and expert recommendations.
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <span className="bg-success/20 text-success px-2 py-1 rounded-full text-xs font-medium">✓ Verified Sellers Only</span>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-primary dark:text-secondary">Explore</h4>
          <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
            <li><Link className="hover:text-accent transition-colors" to="/products">Shop Products</Link></li>
            <li><Link className="hover:text-accent transition-colors" to="/dermatologists">Dermatologists</Link></li>
            <li><Link className="hover:text-accent transition-colors" to="/skin-analysis">Skin Analysis</Link></li>
            <li><Link className="hover:text-accent transition-colors" to="/assessment">Skin Quiz</Link></li>
            <li><Link className="hover:text-accent transition-colors" to="/subscriptions">Dermora Pro</Link></li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-primary dark:text-secondary">Help & Support</h4>
          <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
            <li><a className="hover:text-accent transition-colors" href="#">Shipping & Returns</a></li>
            <li><Link className="hover:text-accent transition-colors" to="/orders">Track Order</Link></li>
            <li><a className="hover:text-accent transition-colors" href="#">Contact Us</a></li>
            <li><a className="hover:text-accent transition-colors" href="#">FAQ</a></li>
            <li><Link className="hover:text-accent transition-colors" to="/security">Security</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-primary dark:text-secondary">Join the Community</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Subscribe for skincare tips and early access to new products.</p>
          <div className="flex gap-2 mb-4">
            <input
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-4 text-sm w-full focus:outline-none focus:ring-1 focus:ring-accent text-slate-800 dark:text-white placeholder-slate-400"
              placeholder="Email address"
              type="email"
            />
            <button className="bg-accent text-white p-2 rounded-xl hover:bg-accent-dark transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          
          {/* Social Media */}
          <div className="flex space-x-3">
            <a href="#" className="w-8 h-8 bg-accent/20 text-accent rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
              📱
            </a>
            <a href="#" className="w-8 h-8 bg-accent/20 text-accent rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
              📺
            </a>
            <a href="#" className="w-8 h-8 bg-accent/20 text-accent rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
              💬
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
        <p>© 2024 Dermora Skincare. All rights reserved.</p>
        <div className="flex gap-8">
          <Link className="hover:text-accent transition-colors" to="/privacy-policy">Privacy Policy</Link>
          <Link className="hover:text-accent transition-colors" to="/terms-of-service">Terms of Service</Link>
          <Link className="hover:text-accent transition-colors" to="/security">Security</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
