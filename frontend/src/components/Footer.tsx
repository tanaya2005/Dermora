import React from 'react';
import { Link } from 'react-router-dom';
import { DermoraLogo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 px-6 md:px-10 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary">
            <DermoraLogo className="size-6" />
            <h2 className="text-xl font-serif font-bold tracking-tight text-white">Dermora</h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Science-led skincare formulations designed to restore your skin's natural vitality. Dermatologist tested, consumer loved.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white">Explore</h4>
          <ul className="flex flex-col gap-3 text-sm text-slate-400">
            <li><a className="hover:text-primary transition-colors" href="#">Our Story</a></li>
            <li><Link className="hover:text-primary transition-colors" to="/assessment">Skin Quiz</Link></li>
            <li><a className="hover:text-primary transition-colors" href="#">Clinical Trials</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Ingredients Glossary</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white">Help</h4>
          <ul className="flex flex-col gap-3 text-sm text-slate-400">
            <li><a className="hover:text-primary transition-colors" href="#">Shipping &amp; Returns</a></li>
            <li><Link className="hover:text-primary transition-colors" to="/orders">Track Order</Link></li>
            <li><a className="hover:text-primary transition-colors" href="#">Contact Us</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white">Join the Community</h4>
          <p className="text-slate-400 text-sm mb-4">Subscribe for skincare tips and early access.</p>
          <div className="flex gap-2">
            <input className="bg-slate-800 border-none rounded-lg py-2 px-4 text-sm w-full focus:ring-1 focus:ring-primary" placeholder="Email address" type="email" />
            <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/80">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2024 Dermora Skincare. All rights reserved.</p>
        <div className="flex gap-8">
          <a className="hover:text-white" href="#">Privacy Policy</a>
          <a className="hover:text-white" href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
