import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { sellerDashboardData, sellerProducts, sellerOrders, subscriptionPlans } from '../../data/sellerData';
import { showToast } from '../../lib/toast';

const SellerDashboardNew: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleUpgrade = () => {
    showToast.success('Redirecting to upgrade page...');
  };

  const handleProductAction = (action: string, productName: string) => {
    showToast.success(`${action} ${productName}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading Seller Dashboard...</p>
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
            Seller Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your products, orders, and grow your business
          </p>
        </motion.div>

        {/* Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* My Products */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">📦</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary dark:text-secondary">{sellerDashboardData.products.totalListed}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Products Listed</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-primary dark:text-secondary mb-2">My Products</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>Stock Value: ₹{sellerDashboardData.products.totalStockValue.toLocaleString()}</div>
              <div>Pending Approval: {sellerDashboardData.products.pendingApproval}</div>
              <div className="text-accent">Low Stock: {sellerDashboardData.products.lowStockItems} items</div>
            </div>
          </div>

          {/* My Orders */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">🛒</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">{sellerDashboardData.orders.new}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">New Orders</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-primary dark:text-secondary mb-2">My Orders</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Processing: {sellerDashboardData.orders.processing}</div>
              <div>Shipped: {sellerDashboardData.orders.shipped}</div>
              <div>Delivered: {sellerDashboardData.orders.delivered}</div>
              <div className="text-accent">Returns: {sellerDashboardData.orders.returns}</div>
            </div>
          </div>

          {/* Revenue */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">💰</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success">₹{(sellerDashboardData.revenue.thisMonth / 1000).toFixed(0)}K</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">This Month</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-primary dark:text-secondary mb-2">Revenue</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>All Time: ₹{(sellerDashboardData.revenue.totalAllTime / 1000).toFixed(0)}K</div>
              <div className="text-accent">Pending Payout: ₹{sellerDashboardData.revenue.pendingPayout.toLocaleString()}</div>
            </div>
          </div>

          {/* Reviews & Performance */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">⭐</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary dark:text-secondary">{sellerDashboardData.reviews.avgRating}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Avg Rating</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-primary dark:text-secondary mb-2">Reviews</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>Total: {sellerDashboardData.reviews.totalReviews}</div>
              <div className="text-accent">Pending Response: {sellerDashboardData.reviews.pendingResponse}</div>
              <div className="text-success">Performance Score: {sellerDashboardData.performanceScore}/100</div>
            </div>
          </div>
        </motion.div>

        {/* Products & Orders Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* My Products Table */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-primary dark:text-secondary">My Products</h3>
              <button 
                onClick={() => handleProductAction('Add New Product', '')}
                className="btn-primary text-sm"
              >
                Add Product
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2">Product</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-center py-2">Stock</th>
                    <th className="text-center py-2">Status</th>
                    <th className="text-center py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.map((product) => (
                    <tr key={product.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-slate-500">{product.category}</div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-semibold">₹{product.price}</td>
                      <td className="py-3 text-center">
                        <span className={`font-semibold ${
                          product.stock === 0 ? 'text-accent' : 
                          product.stock < 10 ? 'text-yellow-600' : 'text-success'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.status === 'Active' ? 'bg-success/20 text-success' :
                          product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-accent/20 text-accent'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex justify-center space-x-1">
                          <button 
                            onClick={() => handleProductAction('Edit', product.name)}
                            className="text-xs px-2 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleProductAction('Delete', product.name)}
                            className="text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Recent Orders</h3>
            
            <div className="space-y-4">
              {sellerOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-secondary/50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <div className="font-medium text-sm">{order.id}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{order.customer}</div>
                    <div className="text-xs text-slate-500">{order.product} × {order.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{order.amount.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">{order.date}</div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'New' ? 'bg-accent/20 text-accent' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      order.status === 'Shipped' ? 'bg-primary/20 text-primary' :
                      order.status === 'Delivered' ? 'bg-success/20 text-success' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Subscription Plan Banner */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-accent to-accent-light text-white p-8 rounded-2xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="mb-6 lg:mb-0">
                <h3 className="text-2xl font-bold mb-2">Upgrade to Premium Seller</h3>
                <p className="opacity-90 mb-4">Get 2x visibility, advanced analytics, and priority support</p>
                <div className="text-sm opacity-80">
                  Current Plan: <span className="font-semibold">{subscriptionPlans.current}</span>
                </div>
              </div>
              <button 
                onClick={handleUpgrade}
                className="bg-white text-accent px-8 py-3 rounded-xl font-semibold hover:bg-secondary transition-colors"
              >
                Upgrade Now - ₹999/month
              </button>
            </div>
          </div>
        </motion.div>

        {/* Subscription Comparison */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Plan Comparison</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptionPlans.plans.map((plan, index) => (
              <div 
                key={plan.name}
                className={`p-6 rounded-2xl border-2 ${
                  plan.current 
                    ? 'border-success bg-success/5' 
                    : plan.popular 
                      ? 'border-accent bg-accent/5' 
                      : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-primary dark:text-secondary">{plan.name}</h4>
                    <div className="text-2xl font-bold text-accent">
                      {plan.price === 0 ? 'Free' : `₹${plan.price}/month`}
                    </div>
                  </div>
                  {plan.current && (
                    <span className="bg-success text-white px-3 py-1 rounded-full text-xs font-medium">
                      Current
                    </span>
                  )}
                  {plan.popular && (
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                      Popular
                    </span>
                  )}
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <span className="text-success">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {!plan.current && (
                  <button 
                    onClick={handleUpgrade}
                    className={`w-full py-2 px-4 rounded-xl font-medium transition-colors ${
                      plan.popular 
                        ? 'bg-accent text-white hover:bg-accent-dark' 
                        : 'border border-accent text-accent hover:bg-accent hover:text-white'
                    }`}
                  >
                    {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SellerDashboardNew;