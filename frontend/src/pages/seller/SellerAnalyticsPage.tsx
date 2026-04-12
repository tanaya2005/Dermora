import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, ShoppingBag, Package, ArrowUpRight } from 'lucide-react';

// Mock data
const monthlyRevenue = [
  { month: 'Oct', revenue: 12400, orders: 24 },
  { month: 'Nov', revenue: 18600, orders: 36 },
  { month: 'Dec', revenue: 31200, orders: 58 },
  { month: 'Jan', revenue: 24800, orders: 47 },
  { month: 'Feb', revenue: 28900, orders: 52 },
  { month: 'Mar', revenue: 35100, orders: 68 },
];

const topProducts = [
  { name: 'Hydra-Glow Serum', sales: 142, revenue: 18458 },
  { name: 'SPF 50 Sunscreen', sales: 98, revenue: 8302 },
  { name: 'Retinol Night Cream', sales: 76, revenue: 13676 },
  { name: 'Niacinamide Toner', sales: 65, revenue: 4545 },
  { name: 'Gentle Foam Cleanser', sales: 53, revenue: 2914 },
];

const categoryData = [
  { name: 'Serums', value: 38 },
  { name: 'Sunscreens', value: 26 },
  { name: 'Moisturizers', value: 20 },
  { name: 'Cleansers', value: 10 },
  { name: 'Treatments', value: 6 },
];

import { useAuth } from '../../AuthContext';

const COLORS = ['#d4567a', '#b8405f', '#8f3349', '#c77d9e', '#e89bb5'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-pink-100 dark:border-slate-700 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }} className="font-medium">
            {entry.name === 'revenue' ? `₹${entry.value.toLocaleString('en-IN')}` : entry.value}
            {' '}<span className="text-gray-400 font-normal text-xs capitalize">{entry.name}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SellerAnalyticsPage: React.FC = () => {
  const { apiRequest } = useAuth();
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'searched' | 'purchased' | 'addedToCart' | 'clicked'>('purchased');

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiRequest('/api/seller/analytics');
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [apiRequest]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No analytics data available</p>
          <p className="text-sm text-gray-400 mt-2">Start selling products to see your analytics</p>
        </div>
      </div>
    );
  }

  const { summary, monthlyRevenue = [], topProducts, categoryData = [] } = analytics;

  return (
    <div className="space-y-7">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: 'Total Searches',
            value: summary?.totalSearches || 0,
            icon: <ArrowUpRight className="w-5 h-5 text-emerald-600" />,
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          },
          {
            label: 'Total Clicks',
            value: summary?.totalClicks || 0,
            icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
            bg: 'bg-blue-100 dark:bg-blue-900/30',
          },
          {
            label: 'Add to Cart',
            value: summary?.totalAddToCart || 0,
            icon: <Package className="w-5 h-5 text-primary" />,
            bg: 'bg-pink-100 dark:bg-pink-900/30',
          },
          {
            label: 'Total Purchases',
            value: summary?.totalPurchases || 0,
            icon: <ShoppingBag className="w-5 h-5 text-emerald-600" />,
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-pink-100/50 dark:border-slate-700 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
              {kpi.icon}
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Area Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Revenue Over Time</h3>
            <p className="text-sm text-gray-400">Monthly revenue for the past 6 months</p>
          </div>
        </div>
        {monthlyRevenue.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4567a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#d4567a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5d5e0" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#d4567a" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: '#d4567a', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#b8405f' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            No revenue data available yet
          </div>
        )}
      </div>

      {/* Orders Bar Chart + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Orders Bar */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Orders per Month</h3>
          <p className="text-sm text-gray-400 mb-5">Number of orders received each month</p>
          {monthlyRevenue.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5d5e0" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#d4567a" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-400 text-sm">
              No order data available yet
            </div>
          )}
        </div>

        {/* Category Pie */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Sales by Category</h3>
          <p className="text-sm text-gray-400 mb-4">Revenue distribution across categories</p>
          {categoryData.length > 0 ? (
            <>
              <div className="h-40 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1.5">
                {categoryData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                      <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              No category data available
            </div>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-pink-100/50 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Top Performing Products</h3>
            <p className="text-sm text-gray-400">Products with highest engagement and sales</p>
          </div>
          <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-xl">
            {(['purchased', 'searched', 'addedToCart', 'clicked'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white dark:bg-slate-600 text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab === 'addedToCart' ? 'Added to Cart' : tab}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Searches</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clicks</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Add to Cart</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Purchases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {topProducts && topProducts[activeTab] && topProducts[activeTab].length > 0 ? (
                topProducts[activeTab].map((product: any) => (
                  <tr key={product._id} className="hover:bg-pink-50/20 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        {product.imageUrl && (
                          <img src={product.imageUrl} alt={product.title} className="w-10 h-10 object-cover rounded-lg" />
                        )}
                        <span>{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 dark:text-gray-300">{product.searchCount || 0}</td>
                    <td className="px-6 py-3.5 text-gray-600 dark:text-gray-300">{product.clickCount || 0}</td>
                    <td className="px-6 py-3.5 text-gray-600 dark:text-gray-300">{product.addToCartCount || 0}</td>
                    <td className="px-6 py-3.5 font-semibold text-gray-900 dark:text-white">{product.purchaseCount || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    No products found in this category
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalyticsPage;
