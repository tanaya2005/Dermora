import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { scmOverview, orderLifecycle, lowStockAlerts, sellerPerformance, deliveryAnalytics } from '../../data/scmData';

const SCMDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading SCM Dashboard...</p>
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
          <h1 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-2">
            Supply Chain Management Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Complete supply chain analytics and inventory management
          </p>
        </motion.div>

        {/* SCM Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-primary dark:text-secondary mb-2">{scmOverview.activeSellers}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Sellers</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">{scmOverview.totalSkus.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total SKUs</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">{scmOverview.monthlyOrders.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Monthly Orders</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">{scmOverview.onTimeDelivery}%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">On-Time Delivery</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-primary dark:text-secondary mb-2">{scmOverview.avgFulfillment}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg Fulfillment (days)</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">{scmOverview.returnRate}%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Return Rate</div>
          </div>
        </motion.div>

        {/* Order Lifecycle Funnel */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">Order Lifecycle Pipeline</h2>
          
          <div className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {orderLifecycle.map((stage, index) => (
                <motion.div
                  key={stage.stage}
                  className="text-center relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div 
                    className="w-full h-24 rounded-xl flex flex-col items-center justify-center text-white font-bold mb-2"
                    style={{ backgroundColor: stage.color }}
                  >
                    <div className="text-2xl">{stage.count.toLocaleString()}</div>
                    <div className="text-xs opacity-90">{stage.stage}</div>
                  </div>
                  
                  {/* Arrow */}
                  {index < orderLifecycle.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              <div className="grid grid-cols-3 gap-4">
                <div>Fulfillment Rate: <span className="font-semibold text-success">98.8%</span></div>
                <div>Delivery Success: <span className="font-semibold text-success">94.2%</span></div>
                <div>Return Rate: <span className="font-semibold text-accent">4.1%</span></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Low Stock Alerts & Seller Performance */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Low Stock Alerts */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-primary dark:text-secondary">Low Stock Alerts</h3>
              <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                {lowStockAlerts.filter(item => item.status === 'Critical').length} Critical
              </span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {lowStockAlerts.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-secondary/50 dark:bg-slate-800 rounded-xl">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.productName}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{item.seller}</div>
                  </div>
                  <div className="text-center mx-4">
                    <div className="font-bold text-lg">{item.currentStock}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">/ {item.threshold}</div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Critical' ? 'bg-accent/20 text-accent' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Performance */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Top Seller Performance</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {sellerPerformance.slice(0, 8).map((seller, index) => (
                <div key={seller.id} className="flex items-center justify-between p-3 bg-secondary/50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{seller.sellerName}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">{seller.ordersFulfilled} orders</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-success">{seller.onTimePercentage}%</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">On-time</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-primary dark:text-secondary">{seller.performanceScore}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Delivery Analytics */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">Delivery Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Delivery Time Distribution */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Delivery Time Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={deliveryAnalytics.deliveryTimeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                    label={(entry: any) => `${entry.timeframe}: ${entry.percentage}%`}
                  >
                    {deliveryAnalytics.deliveryTimeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Geographic Performance */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Geographic Performance</h3>
              <div className="space-y-4">
                {deliveryAnalytics.geographicData.map((city, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{city.city}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{city.orders.toLocaleString()} orders</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-success">{city.deliveryTime} days</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">avg delivery</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-secondary/30 dark:bg-slate-800 rounded-xl">
                <div className="text-sm font-medium mb-2">Coverage Map</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  🔴 Mumbai (highest volume) • 🟡 Delhi • 🟢 Bangalore • 🔵 Chennai • 🟣 Pune
                </div>
              </div>
            </div>

            {/* Return Reasons */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Return Reasons</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={deliveryAnalytics.returnReasons}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="reason" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#E94560" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4 space-y-2">
                {deliveryAnalytics.returnReasons.map((reason, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{reason.reason}</span>
                    <span className="font-semibold">{reason.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full Seller Performance Table */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Complete Seller Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3">Seller Name</th>
                  <th className="text-right py-3">Orders Fulfilled</th>
                  <th className="text-right py-3">On-Time %</th>
                  <th className="text-right py-3">Return Rate</th>
                  <th className="text-center py-3">Rating</th>
                  <th className="text-center py-3">Performance Score</th>
                </tr>
              </thead>
              <tbody>
                {sellerPerformance.map((seller, index) => (
                  <motion.tr
                    key={seller.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                  >
                    <td className="py-4 font-medium text-primary dark:text-secondary">{seller.sellerName}</td>
                    <td className="py-4 text-right">{seller.ordersFulfilled.toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <span className={`font-semibold ${seller.onTimePercentage >= 95 ? 'text-success' : seller.onTimePercentage >= 90 ? 'text-yellow-600' : 'text-accent'}`}>
                        {seller.onTimePercentage}%
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`font-semibold ${seller.returnRate <= 3 ? 'text-success' : seller.returnRate <= 5 ? 'text-yellow-600' : 'text-accent'}`}>
                        {seller.returnRate}%
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center items-center space-x-1">
                        <span className="font-semibold">{seller.rating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        seller.performanceScore >= 90 ? 'bg-success/20 text-success' :
                        seller.performanceScore >= 80 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-accent/20 text-accent'
                      }`}>
                        {seller.performanceScore}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SCMDashboard;