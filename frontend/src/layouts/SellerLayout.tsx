import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SellerSidebar } from '../components/seller/SellerSidebar';
import { SellerNavbar } from '../components/seller/SellerNavbar';

const pageTitles: Record<string, string> = {
  '/seller/dashboard': 'Dashboard Overview',
  '/seller/products': 'My Products',
  '/seller/products/add': 'Add Product',
  '/seller/orders': 'Orders',
  '/seller/analytics': 'Analytics',
  '/seller/profile': 'Profile & Settings',
};

export const SellerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes('/seller/products/edit/')) return 'Edit Product';
    return pageTitles[location.pathname] || 'Seller Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-[#fef6f8] dark:bg-slate-900">
      <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area - pushed right on desktop */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <SellerNavbar
          onMenuClick={() => setSidebarOpen(true)}
          title={getTitle()}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
