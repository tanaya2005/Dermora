import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { erpOverview, financialData, userManagementData, newUserRegistrations, userRoleDistribution } from '../../data/erpData';

const ERPDashboard: React.FC = () => {
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
          <p className="text-slate-600 dark:text-slate-400">Loading ERP Dashboard...</p>
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
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-2">
            ERP Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Enterprise Resource Planning - Complete business overview
          </p>
        </motion.div>

        {/* Module Cards - Entry Points */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/admin/revenue" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📊</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success">₹{(erpOverview.finance.revenue / 1000).toFixed(0)}L</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Revenue</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-2">Finance</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>Revenue ₹{(erpOverview.finance.revenue / 1000).toFixed(0)}L</div>
              <div>Expenses ₹{(erpOverview.finance.expenses / 1000).toFixed(0)}L</div>
              <div>Net Profit ₹{(erpOverview.finance.netProfit / 1000).toFixed(0)}L</div>
            </div>
          </Link>

          <Link to="/admin/scm" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📦</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">{erpOverview.inventory.totalSkus}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">SKUs</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-2">Inventory</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>{erpOverview.inventory.totalSkus} SKUs</div>
              <div>{erpOverview.inventory.lowStock} Low Stock</div>
              <div>{erpOverview.inventory.outOfStock} Out of Stock</div>
            </div>
          </Link>

          <Link to="/admin/users" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">👥</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary dark:text-secondary">{erpOverview.users.total.toLocaleString()}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Users</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-2">Users</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>{erpOverview.users.total.toLocaleString()} Total</div>
              <div>{erpOverview.users.newThisMonth} New (this month)</div>
              <div>{erpOverview.users.sellers} Sellers | {erpOverview.users.admins} Admins</div>
            </div>
          </Link>

          <Link to="/admin/orders" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🛒</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary dark:text-secondary">{erpOverview.orders.total.toLocaleString()}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Orders</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-2">Orders</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>{erpOverview.orders.total.toLocaleString()} Orders</div>
              <div>{erpOverview.orders.returns} Returns</div>
              <div>{erpOverview.orders.onTimePercentage}% On-Time</div>
            </div>
          </Link>

          <Link to="/admin/marketing" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🎯</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">{erpOverview.marketing.roas}x</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">ROAS</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-2">Marketing</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>ROAS {erpOverview.marketing.roas}x</div>
              <div>{erpOverview.marketing.newUsers.toLocaleString()} New Users</div>
              <div>₹{(erpOverview.marketing.attributedRevenue / 1000).toFixed(0)}L Attributed Revenue</div>
            </div>
          </Link>

          <Link to="/admin/consultants" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🩺</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary dark:text-secondary">{erpOverview.consultations.sessions}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Sessions</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-2">Consultations</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>{erpOverview.consultations.sessions} Sessions</div>
              <div>₹{erpOverview.consultations.revenue.toLocaleString()} Revenue</div>
              <div>{erpOverview.consultations.avgRating}★ Avg Rating</div>
            </div>
          </Link>

          <Link to="/admin/reviews" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">⭐</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">4.2</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Avg Rating</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-2">Reviews</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>354 Total Reviews</div>
              <div>87% Positive Sentiment</div>
              <div>78% Seller Response Rate</div>
            </div>
          </Link>

          <Link to="/admin/inventory" className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📋</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary dark:text-secondary">1,284</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Products</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-2">Inventory</h3>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div>1,284 Total Products</div>
              <div>23 Low Stock Items</div>
              <div>0 Out of Stock</div>
            </div>
          </Link>
        </motion.div>

        {/* Financial Module */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">Financial Module</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* P&L Summary */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">P&L Summary (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData.plSummary}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`₹${value?.toLocaleString() || 0}`, 'Revenue']} />
                  <Bar dataKey="mar" fill="#E94560" />
                  <Bar dataKey="feb" fill="#1A1A2E" />
                  <Bar dataKey="jan" fill="#16A085" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* GST & Payouts Summary */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">GST Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total Taxable Sales</span>
                    <span className="font-semibold">₹{financialData.gstSummary.totalTaxableSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">GST Collected (18%)</span>
                    <span className="font-semibold">₹{financialData.gstSummary.gstCollected.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">GST Payable</span>
                    <span className="font-semibold text-accent">₹{financialData.gstSummary.gstPayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Seller Payouts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total Disbursed</span>
                    <span className="font-semibold text-success">₹{financialData.sellerPayouts.totalDisbursed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Pending Payouts</span>
                    <span className="font-semibold text-accent">₹{financialData.sellerPayouts.pendingPayouts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Processing</span>
                    <span className="font-semibold">₹{financialData.sellerPayouts.processing.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Management */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">User Management</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Table */}
            <div className="lg:col-span-2 glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary dark:text-secondary">All Users</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm">
                    <option>All Roles</option>
                    <option>BUYER</option>
                    <option>SELLER</option>
                    <option>ADMIN</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Role</th>
                      <th className="text-left py-2">Join Date</th>
                      <th className="text-left py-2">Total Spend</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userManagementData.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-3">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'ADMIN' ? 'bg-accent/20 text-accent' :
                            user.role === 'SELLER' ? 'bg-success/20 text-success' :
                            user.role === 'DERMATOLOGIST' ? 'bg-primary/20 text-primary' :
                            'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">{user.joinDate}</td>
                        <td className="py-3 font-medium">₹{user.totalSpend.toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'Active' ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            {user.status === 'Active' ? (
                              <button className="text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30">
                                Suspend
                              </button>
                            ) : (
                              <button className="text-xs px-2 py-1 bg-success/20 text-success rounded hover:bg-success/30">
                                Activate
                              </button>
                            )}
                            {user.role === 'SELLER' && (
                              <button className="text-xs px-2 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30">
                                Verify
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">New Registrations</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={newUserRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#E94560" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">User Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={userRoleDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={(entry: any) => `${entry.role}: ${entry.count}`}
                    >
                      {userRoleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ERPDashboard;