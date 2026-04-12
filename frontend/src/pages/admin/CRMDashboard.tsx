import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  crmMetrics, 
  ticketCategories, 
  sentimentData, 
  customerReviews, 
  npsDistribution, 
  loyaltyProgram, 
  customerSegments, 
  criticalAlert 
} from '../../data/crmData';

const CRMDashboard: React.FC = () => {
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
          <p className="text-slate-600 dark:text-slate-400">Loading CRM Dashboard...</p>
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
            CRM Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Customer Relationship Management & Feedback Intelligence System
          </p>
        </motion.div>

        {/* CRM Metrics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-success mb-2">{crmMetrics.npsScore}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">NPS Score</div>
            <div className="mt-2 bg-success/20 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: `${crmMetrics.npsScore}%` }}></div>
            </div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-accent mb-2">{crmMetrics.totalTickets.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Feedback Tickets</div>
            <div className="text-xs text-slate-500 mt-1">This Month</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-primary dark:text-secondary mb-2">{crmMetrics.averageRating}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Average Review Rating</div>
            <div className="flex justify-center mt-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(crmMetrics.averageRating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-success mb-2">{crmMetrics.repeatPurchaseRate}%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Repeat Purchase Rate</div>
            <div className="text-xs text-success mt-1">+5% from last month</div>
          </div>
        </motion.div>

        {/* Additional Metrics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-primary dark:text-secondary mb-2">₹{crmMetrics.customerLifetimeValue.toLocaleString()}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Customer Lifetime Value</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">{crmMetrics.churnRate}%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Churn Rate</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">{crmMetrics.resolutionTime}h</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg Resolution Time</div>
          </div>
        </motion.div>

        {/* Critical Alert */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-accent to-accent-light text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🚨</div>
                <div>
                  <h3 className="text-xl font-bold">CRITICAL ALERT</h3>
                  <p className="opacity-90">{criticalAlert.ticketCount} tickets flagged for {criticalAlert.type}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{criticalAlert.percentage}%</div>
                <div className="text-sm opacity-90">of all tickets</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Status: {criticalAlert.status}</span>
                <span className="text-sm">Assigned to Engineering Team</span>
              </div>
              
              <div className="grid grid-cols-5 gap-4 text-center text-sm">
                {criticalAlert.timeline.map((item, index) => (
                  <div key={index} className={`p-2 rounded ${item.status === 'resolved' ? 'bg-success/20' : 'bg-white/10'}`}>
                    <div className="font-medium">{item.date}</div>
                    <div className="text-xs opacity-80">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Automated Ticket Analysis System */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-secondary mb-6">
            Automated Feedback Intelligence System
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ticket Categories */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Ticket Categories</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketCategories} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#E94560" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Analysis */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Sentiment Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Customer Reviews Table */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Customer Reviews</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3">Customer</th>
                    <th className="text-left py-3">Product</th>
                    <th className="text-center py-3">Rating</th>
                    <th className="text-left py-3">Review</th>
                    <th className="text-center py-3">Sentiment</th>
                    <th className="text-center py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customerReviews.map((review) => (
                    <tr key={review.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 font-medium">{review.customerName}</td>
                      <td className="py-3">{review.product}</td>
                      <td className="py-3 text-center">
                        <div className="flex justify-center text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 max-w-xs truncate">{review.reviewText}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          review.sentiment === 'Positive' ? 'bg-success/20 text-success' :
                          review.sentiment === 'Negative' ? 'bg-accent/20 text-accent' :
                          'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}>
                          {review.sentiment}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          review.status === 'Replied' ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'
                        }`}>
                          {review.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* NPS Survey & Customer Segments */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* NPS Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">NPS Score Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={npsDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="score" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1A1A2E" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
              <div>
                <div className="font-semibold text-accent">Detractors (0-6)</div>
                <div>22%</div>
              </div>
              <div>
                <div className="font-semibold text-slate-600">Passives (7-8)</div>
                <div>33%</div>
              </div>
              <div>
                <div className="font-semibold text-success">Promoters (9-10)</div>
                <div>45%</div>
              </div>
            </div>
          </div>

          {/* Loyalty Program */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Loyalty Program Dashboard</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Coins Issued</span>
                <span className="font-semibold">{loyaltyProgram.totalCoinsIssued.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Coins Redeemed</span>
                <span className="font-semibold">{loyaltyProgram.totalCoinsRedeemed.toLocaleString()}</span>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Members by Tier</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                      <span>Bronze</span>
                    </span>
                    <span className="font-semibold">{loyaltyProgram.membersByTier.bronze.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                      <span>Silver</span>
                    </span>
                    <span className="font-semibold">{loyaltyProgram.membersByTier.silver}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span>Gold</span>
                    </span>
                    <span className="font-semibold">{loyaltyProgram.membersByTier.gold}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Customer Segments */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Customer Segments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3">Segment</th>
                  <th className="text-right py-3">Count</th>
                  <th className="text-right py-3">Avg Order Value</th>
                  <th className="text-left py-3">Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                {customerSegments.map((segment, index) => (
                  <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 font-medium">{segment.segment}</td>
                    <td className="py-3 text-right">{segment.count}</td>
                    <td className="py-3 text-right font-semibold">₹{segment.avgOrderValue.toLocaleString()}</td>
                    <td className="py-3">{segment.recommendedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CRMDashboard;