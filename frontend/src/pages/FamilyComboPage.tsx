import React from "react";

import { Footer } from "../components/Footer";

export const FamilyComboPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-black">
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">
            Bundles & Subscriptions
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
            Family & Combo Plans
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Save up to 30% when you bundle Dermora essentials for yourself or
            your entire family. Flexible deliveries, maximum glow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Basic Combo */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col hover:border-primary/50 transition-colors shadow-sm">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">The Essentials Duo</h3>
              <p className="text-slate-500 text-sm h-10">
                Perfect for daily maintenance. Cleanser & Moisturizer.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-black">$45</span>
                <span className="text-slate-400 text-sm line-through">
                  $55 value
                </span>
              </div>
              <p className="text-primary text-sm font-bold mt-1">Save 18%</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-xl">
                  check_circle
                </span>
                Hydrating Oat Cleanser (250ml)
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-xl">
                  check_circle
                </span>
                Daily Barrier Cream (50ml)
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-xl">
                  check_circle
                </span>
                Free standard shipping
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
              Add to Cart
            </button>
          </div>

          {/* Premium Combo */}
          <div className="bg-primary text-white rounded-3xl p-8 border border-primary relative flex flex-col shadow-xl shadow-primary/20 transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Complete Routine</h3>
              <p className="text-white/80 text-sm h-10">
                The ultimate 4-step system for glowing, resilient skin.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-black">$98</span>
                <span className="text-white/60 text-sm line-through">
                  $130 value
                </span>
              </div>
              <p className="text-white font-bold mt-1 bg-white/20 inline-block px-2 py-0.5 rounded text-sm">
                Save 25%
              </p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-white text-xl">
                  check_circle
                </span>
                Hydrating Oat Cleanser (250ml)
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-white text-xl">
                  check_circle
                </span>
                Vitamin C Radiance Serum (30ml)
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-white text-xl">
                  check_circle
                </span>
                Daily Barrier Cream (50ml)
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-white text-xl">
                  check_circle
                </span>
                Mineral SPF 50 Shield (50ml)
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-white text-xl">
                  check_circle
                </span>
                Free express shipping
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-white text-primary font-bold shadow-lg hover:bg-slate-50 transition-all">
              Subscribe & Save
            </button>
          </div>

          {/* Family Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col hover:border-primary/50 transition-colors shadow-sm">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">The Family Pack</h3>
              <p className="text-slate-500 text-sm h-10">
                Supersized essentials designed to be shared by the whole family.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-black">$145</span>
                <span className="text-slate-400 text-sm line-through">
                  $210 value
                </span>
              </div>
              <p className="text-primary text-sm font-bold mt-1">Save 31%</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-xl">
                  check_circle
                </span>
                2x Gentle Body & Face Wash (500ml)
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-xl">
                  check_circle
                </span>
                2x Ultra Repair Lotion (500ml)
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-xl">
                  check_circle
                </span>
                1x Family Size SPF 50 (200ml)
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-xl">
                  check_circle
                </span>
                2x Free Dermora Travel Pouches
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
              Subscribe & Save
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
