import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { revenueOverview, revenueStreams, monthlyRevenueData, topSellers } from '../../data/revenueData';

const RevenueDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({
    totalRevenue: 0,
    gmv: 0,
    commission: 0,
    proSubscribers: 0,
    sellerSubscriptions: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Animate counters
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setAnimatedValues(prev => ({
          totalRevenue: Math.min(prev.totalRevenue + 15000, revenueOverview.totalMonthlyRevenue),
          gmv: Math.min(prev.gmv + 35000, revenueOverview.gmv),
          commission: Math.min(prev.commission + 5000, revenueOverview.commissionEarned),
          proSubscribers: Math.min(prev.proSubscribers + 12, revenueOverview.activeProSubscribers),
          sellerSubscriptions: Math.min(prev.sellerSubscriptions + 2, revenueOverview.activeSellerSubscriptions)
        }));
      }, 100);

      setTimeout(() => clearInterval(interval), 2000);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading Revenue Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-xl border border-primary/15 bg-white/80 dark:bg-slate-900/80 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Admin Dashboard
          </Link>
          <h1 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-2">
            Revenue Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Complete revenue analytics and business performance metrics
          </p>
        </motion.div>

        {/* Revenue Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Monthly Revenue</div>
            <div className="text-3xl font-bold text-success count-up">
              ₹{animatedValues.totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-success mt-1">+12.5% from last month</div>
          </div>

          <div className="glass-card p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">GMV</div>
            <div className="text-3xl font-bold text-primary dark:text-secondary count-up">
              ₹{animatedValues.gmv.toLocaleString()}
            </div>
            <div className="text-xs text-success mt-1">+8.3% growth</div>
          </div>

          <div className="glass-card p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Commission Earned (15%)</div>
            <div className="text-3xl font-bold text-accent count-up">
              ₹{animatedValues.commission.toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">15% of GMV</div>
          </div>

          <div className="glass-card p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Pro Subscribers</div>
            <div className="text-3xl font-bold text-primary dark:text-secondary count-up">
              {animatedValues.proSubscribers}
            </div>
            <div className="text-xs text-success mt-1">₹{revenueOverview.proSubscriberRevenue.toLocaleString()}/month</div>
          </div>

          <div className="glass-card p-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Seller Subscriptions</div>
            <div className="text-3xl font-bold text-primary dark:text-secondary count-up">
              {animatedValues.sellerSubscriptions}
            </div>
            <div className="text-xs text-success mt-1">₹{revenueOverview.sellerSubscriptionRevenue.toLocaleString()}/month</div>
          </div>
        </motion.div>

        {/* Revenue Stream Breakdown */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Pie Chart */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Revenue Stream Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueStreams}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="monthlyRevenue"
                  label={(entry: any) => `${entry.name}: ${entry.percentage}%`}
                >
                  {revenueStreams.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#E94560' : '#1A1A2E'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${value?.toLocaleString() || 0}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Revenue Trend */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Revenue vs Target</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`₹${value?.toLocaleString() || 0}`, '']} />
                <Bar dataKey="revenue" fill="#E94560" name="Actual Revenue" />
                <Bar dataKey="target" fill="#1A1A2E" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Stream Cards */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">Revenue Streams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {revenueStreams.map((stream, index) => (
              <motion.div
                key={stream.id}
                className="glass-card p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="text-4xl mb-4">{stream.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-primary dark:text-secondary">{stream.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{stream.description}</p>
                <div className="text-2xl font-bold text-accent mb-2">
                  ₹{stream.monthlyRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">per month</div>
                <div className="mt-3 bg-accent/20 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${stream.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{stream.percentage}% of total</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Sellers Payout Table */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Seller Payout Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3">Seller Name</th>
                  <th className="text-right py-3">Products Sold</th>
                  <th className="text-right py-3">GMV</th>
                  <th className="text-right py-3">Commission (15%)</th>
                  <th className="text-right py-3">Net Payout</th>
                  <th className="text-center py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((seller, index) => (
                  <motion.tr
                    key={seller.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                  >
                    <td className="py-4 font-medium text-primary dark:text-secondary">{seller.name}</td>
                    <td className="py-4 text-right">{seller.productsSold.toLocaleString()}</td>
                    <td className="py-4 text-right font-semibold">₹{seller.gmv.toLocaleString()}</td>
                    <td className="py-4 text-right text-accent font-semibold">₹{seller.commission.toLocaleString()}</td>
                    <td className="py-4 text-right font-semibold">₹{seller.netPayout.toLocaleString()}</td>
                    <td className="py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        seller.status === 'Paid' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-accent/20 text-accent'
                      }`}>
                        {seller.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
            <div>Showing top 10 sellers by GMV</div>
            <div className="flex space-x-4">
              <div>Total Payouts: <span className="font-semibold text-success">₹{topSellers.reduce((sum, seller) => sum + seller.netPayout, 0).toLocaleString()}</span></div>
              <div>Total Commission: <span className="font-semibold text-accent">₹{topSellers.reduce((sum, seller) => sum + seller.commission, 0).toLocaleString()}</span></div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default RevenueDashboard;
