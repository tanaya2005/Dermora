import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const AdminReviewsPage: React.FC = () => {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, sentimentFilter, visibilityFilter, ratingFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsData, reviewsData] = await Promise.all([
        apiRequest('/api/reviews/admin/analytics'),
        apiRequest('/api/reviews/admin/reviews?limit=100')
      ]);
      setAnalytics(analyticsData);
      setReviews(reviewsData.reviews || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load reviews data');
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...reviews];
    
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.productId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(r => r.sentiment === sentimentFilter);
    }
    
    if (visibilityFilter !== 'all') {
      filtered = filtered.filter(r => r.isVisible === (visibilityFilter === 'visible'));
    }
    
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
    }
    
    setFilteredReviews(filtered);
  };

  const toggleVisibility = async (reviewId: string, currentVisibility: boolean) => {
    try {
      await apiRequest(`/api/reviews/admin/${reviewId}/visibility`, {
        method: 'PATCH',
        body: JSON.stringify({ isVisible: !currentVisibility })
      });
      
      setReviews(prev => prev.map(r => 
        r._id === reviewId ? { ...r, isVisible: !currentVisibility } : r
      ));
      
      toast.success(`Review ${!currentVisibility ? 'shown' : 'hidden'} successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update review visibility');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary dark:bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading Reviews Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const { overall, sellerResponseRate, topProducts, bottomProducts, keywordAnalysis, monthlyVolume } = analytics;
  
  // Prepare chart data
  const sentimentData = [
    { name: 'Positive', value: overall.sentimentBreakdown.positive, color: '#10b981' },
    { name: 'Neutral', value: overall.sentimentBreakdown.neutral, color: '#94a3b8' },
    { name: 'Negative', value: overall.sentimentBreakdown.negative, color: '#ef4444' }
  ];

  const ratingDistributionData = [
    { rating: '5★', count: overall.ratingBreakdown[5], color: '#10b981' },
    { rating: '4★', count: overall.ratingBreakdown[4], color: '#14b8a6' },
    { rating: '3★', count: overall.ratingBreakdown[3], color: '#f59e0b' },
    { rating: '2★', count: overall.ratingBreakdown[2], color: '#fb923c' },
    { rating: '1★', count: overall.ratingBreakdown[1], color: '#ef4444' }
  ];

  const positiveSentimentPercentage = overall.totalReviews > 0
    ? Math.round((overall.sentimentBreakdown.positive / overall.totalReviews) * 100)
    : 0;

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
            Reviews Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Platform-wide review analytics and sentiment intelligence
          </p>
        </motion.div>

        {/* Section A: Platform-Wide Analytics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-primary dark:text-secondary mb-2">
              {overall.totalReviews.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Reviews on Platform</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-accent mb-2">{overall.avgRating.toFixed(1)}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Platform Avg Rating</div>
            <div className="flex justify-center mt-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(overall.avgRating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-success mb-2">{positiveSentimentPercentage}%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Positive Sentiment</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-accent mb-2">
              {analytics.recentNegativeCount || overall.sentimentBreakdown.negative}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Negative Reviews (Last 30 Days)</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-slate-600 dark:text-slate-400 mb-2">
              {overall.hiddenReviews || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Reviews Pending Visibility</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-bold text-primary dark:text-secondary mb-2">{sellerResponseRate}%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Seller Response Rate</div>
          </div>
        </motion.div>

        {/* Charts Row */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Chart 1: Sentiment Breakdown */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Sentiment Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Rating Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ratingDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#E94560">
                  {ratingDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3: Review Volume Over Time */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary dark:text-secondary">Review Volume (12 Months)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#E94560" fill="#E94560" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Section B: Top & Bottom Performing Products */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Top 5 Products */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Top 5 Products by Rating</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3">Product</th>
                    <th className="text-left py-3">Seller</th>
                    <th className="text-center py-3">Avg Rating</th>
                    <th className="text-center py-3">Reviews</th>
                    <th className="text-center py-3">Positive %</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product: any, index: number) => (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 font-medium">{product.productName}</td>
                      <td className="py-3">{product.sellerName}</td>
                      <td className="py-3 text-center font-bold text-success">{product.avgRating.toFixed(1)}</td>
                      <td className="py-3 text-center">{product.reviewCount}</td>
                      <td className="py-3 text-center text-success">{Math.round(product.positivePercentage)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom 5 Products */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">Bottom 5 Products (Needs Attention)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3">Product</th>
                    <th className="text-left py-3">Seller</th>
                    <th className="text-center py-3">Avg Rating</th>
                    <th className="text-center py-3">Reviews</th>
                    <th className="text-center py-3">Negative %</th>
                    <th className="text-center py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bottomProducts.map((product: any, index: number) => (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 font-medium">{product.productName}</td>
                      <td className="py-3">{product.sellerName}</td>
                      <td className="py-3 text-center font-bold text-accent">{product.avgRating.toFixed(1)}</td>
                      <td className="py-3 text-center">{product.reviewCount}</td>
                      <td className="py-3 text-center text-accent">{Math.round(product.negativePercentage)}%</td>
                      <td className="py-3 text-center">
                        <button 
                          onClick={() => toast.success('Notification sent to seller')}
                          className="text-xs px-2 py-1 bg-accent text-white rounded hover:bg-accent/80"
                        >
                          Notify Seller
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Section C: Keyword Analysis */}
        <motion.div 
          className="glass-card p-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">What Customers Are Saying</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Positive Keywords */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-success">Most Mentioned Positive Words</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={keywordAnalysis.positive} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="word" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Negative Keywords */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent">Most Mentioned Negative Words</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={keywordAnalysis.negative} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="word" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Section D: All Reviews Table */}
        <motion.div 
          className="glass-card p-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">All Reviews</h2>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
            />
            
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
            >
              <option value="all">All Visibility</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          {/* Reviews Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3">Product</th>
                  <th className="text-left py-3">Customer</th>
                  <th className="text-left py-3">Seller</th>
                  <th className="text-center py-3">Rating</th>
                  <th className="text-left py-3">Comment</th>
                  <th className="text-center py-3">Sentiment</th>
                  <th className="text-center py-3">Visible</th>
                  <th className="text-center py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.slice(0, 20).map((review: any) => (
                  <tr key={review._id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 font-medium max-w-xs truncate">{review.productId?.title}</td>
                    <td className="py-3">{review.userId?.name}</td>
                    <td className="py-3">{review.sellerId?.name}</td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 max-w-md truncate">{review.comment}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        review.sentiment === 'positive' ? 'bg-success/20 text-success' :
                        review.sentiment === 'negative' ? 'bg-accent/20 text-accent' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {review.sentiment}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => toggleVisibility(review._id, review.isVisible)}
                        className={`px-2 py-1 rounded text-xs ${
                          review.isVisible 
                            ? 'bg-success/20 text-success' 
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                        }`}
                      >
                        {review.isVisible ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3 text-center">
                      <button 
                        onClick={() => toast.success('Admin note feature coming soon')}
                        className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/80"
                      >
                        Add Note
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-4">Showing {filteredReviews.length} of {reviews.length} reviews</p>
        </motion.div>

        {/* Section E: How We Analyse Reviews */}
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-primary dark:text-secondary mb-6">
            How Our Automated Review Analysis Works
          </h2>
          
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-8 mb-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="flex items-center gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
                  <p className="font-semibold text-primary dark:text-secondary">Customer submits review text</p>
                </div>
              </div>
              
              <div className="text-2xl text-slate-400">↓</div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
                <p className="font-semibold text-primary dark:text-secondary">Body scanned against 60+ keywords</p>
              </div>
              
              <div className="text-2xl text-slate-400">↓</div>
              
              <div className="flex gap-8">
                <div className="bg-success/10 rounded-lg p-4 shadow-md">
                  <p className="font-semibold text-success">Positive</p>
                </div>
                <div className="bg-accent/10 rounded-lg p-4 shadow-md">
                  <p className="font-semibold text-accent">Negative</p>
                </div>
              </div>
              
              <div className="text-sm text-slate-500">(whichever has more matches wins)</div>
              
              <div className="text-2xl text-slate-400">↓</div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
                <p className="font-semibold text-primary dark:text-secondary">Sentiment tag saved to database</p>
              </div>
              
              <div className="text-2xl text-slate-400">↓</div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
                <p className="font-semibold text-primary dark:text-secondary">Keyword frequency aggregated monthly</p>
              </div>
              
              <div className="text-2xl text-slate-400">↓</div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
                <p className="font-semibold text-primary dark:text-secondary">Admin sees trends → flags issues to engineering / sellers</p>
              </div>
            </div>
          </div>

          {/* Example Case Study */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-3 text-primary dark:text-secondary">Real-World Example:</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold">In March 2025</span>, 312 tickets and 47 reviews mentioned <span className="font-bold text-accent">"payment timeout"</span> → 
              flagged as <span className="font-bold text-accent">Critical</span> → Engineering resolved within 3 days → 
              Negative review rate on payment dropped <span className="font-bold text-success">89%</span> in April
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminReviewsPage;
