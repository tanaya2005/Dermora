import React from 'react';
import { Link } from 'react-router-dom';
import SellerReviewsDashboard from '../components/SellerReviewsDashboard';

export default function SellerReviewsPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-black font-display min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="flex flex-1">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:flex w-64 flex-col border-r border-primary/10 bg-white dark:bg-background-dark p-4 gap-6">
            <div className="flex flex-col gap-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Seller Dashboard
              </p>
              <nav className="flex flex-col gap-1">
                <Link
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                  to="/seller/dashboard"
                >
                  <span className="material-symbols-outlined">dashboard</span>
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                  to="/seller/products"
                >
                  <span className="material-symbols-outlined">inventory_2</span>
                  <span className="text-sm font-medium">My Products</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                  to="/seller/orders"
                >
                  <span className="material-symbols-outlined">receipt_long</span>
                  <span className="text-sm font-medium">Orders</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"
                  to="/seller/reviews"
                >
                  <span className="material-symbols-outlined">star</span>
                  <span className="text-sm font-medium">Reviews</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-black tracking-tight">
                  My Product Reviews
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Monitor customer feedback and ratings for your products.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">notifications</span>
                  Review Alerts
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">insights</span>
                  View Insights
                </button>
              </div>
            </div>

            {/* Seller Reviews Dashboard */}
            <SellerReviewsDashboard />
          </main>
        </div>
      </div>
    </div>
  );
}