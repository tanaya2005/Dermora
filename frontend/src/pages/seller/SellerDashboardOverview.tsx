import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { getProducts } from '../../lib/api-client';
import { useAuth } from '../../hooks/useAuth';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, change, positive, icon, color, bgColor,
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
        <div className={`${color}`}>{icon}</div>
      </div>
      {change && (
        <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${positive ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300' : 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300'}`}>
          {positive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
          {change}
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </div>
  </div>
);

const statusConfig: Record<string, { label: string; classes: string }> = {
  PENDING: { label: 'Pending', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  PROCESSING: { label: 'Processing', classes: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  SHIPPED: { label: 'Shipped', classes: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  DELIVERED: { label: 'Completed', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300' },
};

// Mock data for demo purposes
const mockOrders = [
  { id: 'ORD-001', buyer: 'Priya Sharma', amount: 1299, status: 'DELIVERED', date: '2026-03-15', items: 2 },
  { id: 'ORD-002', buyer: 'Ananya Verma', amount: 849, status: 'PENDING', date: '2026-03-16', items: 1 },
  { id: 'ORD-003', buyer: 'Meera Nair', amount: 2150, status: 'PROCESSING', date: '2026-03-16', items: 3 },
  { id: 'ORD-004', buyer: 'Kavita Joshi', amount: 599, status: 'SHIPPED', date: '2026-03-17', items: 1 },
  { id: 'ORD-005', buyer: 'Sunita Rao', amount: 3400, status: 'CANCELLED', date: '2026-03-17', items: 4 },
];

const SellerDashboardOverview: React.FC = () => {
  const { user, apiRequest } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/api/seller/dashboard');
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentOrders = dashboardData?.recentOrders || [];

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Welcome Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{ background: 'linear-gradient(135deg, #5d2232 0%, #b8405f 60%, #d4567a 100%)' }}
      >
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-1 font-serif">
            Welcome back, {user?.name?.split(' ')[0] || 'Seller'}! 👋
          </h2>
          <p className="text-white/70 text-sm mb-5">
            Here's what's happening with your store today.
          </p>
          <Link
            to="/seller/products/add"
            className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-pink-50 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Product
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute right-16 -bottom-12 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute right-4 top-4 w-20 h-20 rounded-full bg-white/10" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Products"
          value={stats.totalProducts || 0}
          change="12%"
          positive
          icon={<Package className="w-6 h-6" />}
          color="text-primary"
          bgColor="bg-pink-100 dark:bg-pink-900/30"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          change="8%"
          positive
          icon={<ShoppingCart className="w-6 h-6" />}
          color="text-blue-600"
          bgColor="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          title="Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`}
          change="5%"
          positive
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-emerald-600"
          bgColor="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders || 0}
          change="2%"
          positive={false}
          icon={<ShoppingCart className="w-6 h-6" />}
          color="text-purple-600"
          bgColor="bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-pink-100/50 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
          <Link
            to="/seller/orders"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Buyer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Items</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => {
                  const status = statusConfig[order.status] || statusConfig.PENDING;
                  return (
                    <tr key={order._id} className="hover:bg-pink-50/30 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary">#{order.orderNumber}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{order.buyerId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{order.orderItems?.length || 0} items</td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.classes}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/seller/products/add"
          className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-pink-100/50 dark:border-slate-700 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Add Product</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">List a new skincare product</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary ml-auto transition-colors" />
        </Link>

        <Link
          to="/seller/orders"
          className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-pink-100/50 dark:border-slate-700 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">View Orders</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stats.pendingOrders || 0} orders pending</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary ml-auto transition-colors" />
        </Link>

        <Link
          to="/seller/analytics"
          className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-pink-100/50 dark:border-slate-700 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Analytics</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">View sales insights</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary ml-auto transition-colors" />
        </Link>
      </div>
    </div>
  );
};

export default SellerDashboardOverview;
