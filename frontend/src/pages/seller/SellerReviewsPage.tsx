import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, TrendingDown, Minus, MessageSquare, AlertTriangle, Search, Filter, Eye, Reply as ReplyIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import StarRating from '../../components/StarRating';
import ReviewCard from '../../components/ReviewCard';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Analytics {
  overall: {
    avgRating: number;
    totalReviews: number;
    sentimentBreakdown: {
      positive: number;
      neutral: number;
      negative: number;
    };
    ratingBreakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  byProduct: Array<{
    productId: string;
    productName: string;
    avgRating: number;
    reviewCount: number;
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
    topKeywords: string[];
  }>;
  monthlyTrend: Array<{
    month: string;
    avgRating: number;
    count: number;
  }>;
  recentNegative: any[];
  responseRate: number;
}

export default function SellerReviewsPage() {
  const { apiRequest } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    productId: '',
    sentiment: '',
    rating: '',
    search: '',
    sortBy: 'createdAt'
  });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingReview, setViewingReview] = useState<any | null>(null);
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
    fetchReviews();
    fetchSellerProducts();
  }, [filters, page]);

  const fetchSellerProducts = async () => {
    try {
      const data = await apiRequest('/api/products/seller');
      setSellerProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch seller products:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await apiRequest('/api/reviews/seller/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: filters.sortBy,
        order: 'desc',
        ...(filters.productId && { productId: filters.productId }),
        ...(filters.sentiment && { sentiment: filters.sentiment }),
        ...(filters.rating && { rating: filters.rating })
      });
      const data = await apiRequest(`/api/reviews/seller/reviews?${params}`);
      setReviews(data.reviews);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;

    try {
      await apiRequest(`/api/reviews/${reviewId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ reply: replyText })
      });
      setReplyingTo(null);
      setReplyText('');
      fetchReviews();
      fetchAnalytics();
    } catch (error) {
      console.error('Failed to post reply:', error);
    }
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sentimentData = [
    { name: 'Positive', value: analytics.overall.sentimentBreakdown.positive, color: '#10B981' },
    { name: 'Neutral', value: analytics.overall.sentimentBreakdown.neutral, color: '#F59E0B' },
    { name: 'Negative', value: analytics.overall.sentimentBreakdown.negative, color: '#EF4444' }
  ];

  const getTrendIcon = (product: any) => {
    const positivePercent = (product.sentiment.positive / product.reviewCount) * 100;
    const negativePercent = (product.sentiment.negative / product.reviewCount) * 100;
    
    if (positivePercent >= 70) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (negativePercent >= 40) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getSentimentBadge = (sentiment: string) => {
    const badges = {
      positive: 'bg-green-100 text-green-800',
      neutral: 'bg-yellow-100 text-yellow-800',
      negative: 'bg-red-100 text-red-800'
    };
    return badges[sentiment as keyof typeof badges] || badges.neutral;
  };

  const getSentimentEmoji = (sentiment: string) => {
    const emojis = {
      positive: '🟢',
      neutral: '🟡',
      negative: '🔴'
    };
    return emojis[sentiment as keyof typeof emojis] || '⚪';
  };

  const needsAttention = analytics?.recentNegative.filter(r => !r.sellerReply).length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage and respond to customer reviews</p>
      </div>

      {/* Section A - Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Overall Rating Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Overall Rating</p>
              <p className="text-4xl font-bold text-yellow-900 mb-2">
                {analytics.overall.avgRating.toFixed(1)} ★
              </p>
              <div className="mt-1">
                <StarRating rating={analytics.overall.avgRating} size="sm" />
              </div>
            </div>
            <Star className="w-14 h-14 text-yellow-400 fill-yellow-400 opacity-50" />
          </div>
        </div>

        {/* Total Reviews Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Reviews</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {analytics.overall.totalReviews}
              </p>
              <p className="text-sm text-gray-500">All time</p>
            </div>
            <MessageSquare className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        {/* Response Rate Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Response Rate</p>
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {analytics.responseRate}%
              </p>
              <p className="text-sm text-gray-500">
                {Math.round((analytics.responseRate / 100) * analytics.overall.totalReviews)} replied
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        {/* Needs Attention Card */}
        <div className={`border-2 rounded-xl p-6 shadow-sm ${
          needsAttention > 0 
            ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${needsAttention > 0 ? 'text-red-800' : 'text-gray-600'}`}>
                Needs Attention
              </p>
              <p className={`text-4xl font-bold mb-2 ${needsAttention > 0 ? 'text-red-900' : 'text-gray-900'}`}>
                {needsAttention}
              </p>
              <p className={`text-sm ${needsAttention > 0 ? 'text-red-700' : 'text-gray-500'}`}>
                Negative, no reply
              </p>
            </div>
            <AlertTriangle className={`w-12 h-12 ${needsAttention > 0 ? 'text-red-500' : 'text-gray-400'} opacity-70`} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Donut Chart */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Overall Sentiment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col space-y-2 mt-4">
            {sentimentData.map((item) => {
              const percentage = analytics.overall.totalReviews > 0 
                ? Math.round((item.value / analytics.overall.totalReviews) * 100) 
                : 0;
              return (
                <div key={item.name} className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Rating Trend */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Monthly Rating Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                domain={[0, 5]} 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'avgRating') return [value.toFixed(1), 'Avg Rating'];
                  return [value, name];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgRating"
                stroke="#3B82F6"
                strokeWidth={3}
                name="Avg Rating"
                dot={{ fill: '#3B82F6', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10B981"
                strokeWidth={2}
                name="Review Count"
                dot={{ fill: '#10B981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section B - Product Performance Table */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">How each product is performing</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Sort by:</span>
            <select className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Avg Rating</option>
              <option>Review Count</option>
              <option>Negative Count</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Avg Rating
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Positive
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Neutral
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Negative
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Top Keywords
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.byProduct.map((product) => {
                const positivePercent = Math.round((product.sentiment.positive / product.reviewCount) * 100);
                const neutralPercent = Math.round((product.sentiment.neutral / product.reviewCount) * 100);
                const negativePercent = Math.round((product.sentiment.negative / product.reviewCount) * 100);
                
                return (
                  <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0"></div>
                        <span className="text-sm font-medium text-gray-900 line-clamp-2">
                          {product.productName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {product.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-medium text-gray-900">{product.reviewCount}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {positivePercent}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {neutralPercent}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {negativePercent}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.topKeywords.slice(0, 3).map((keyword, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium border border-blue-200">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getTrendIcon(product)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => {
                          setFilters({ ...filters, productId: product.productId });
                          setPage(1);
                        }}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        View Reviews
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Negative Reviews Alert */}
      {needsAttention > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Needs Your Attention</h3>
              <p className="text-amber-800 mb-4">
                {needsAttention} negative {needsAttention === 1 ? 'review hasn\'t' : 'reviews haven\'t'} received a response yet.
              </p>
              <div className="space-y-3">
                {analytics.recentNegative.filter(r => !r.sellerReply).slice(0, 5).map((review) => (
                  <div key={review._id} className="bg-white border rounded p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-sm font-medium">{review.productId?.title}</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                      </div>
                      <button
                        onClick={() => setReplyingTo(review._id)}
                        className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Reply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section C - Reviews Table */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">All Reviews</h3>
          
          {/* Clear Filters */}
          {(filters.productId || filters.sentiment || filters.rating) && (
            <button
              onClick={() => setFilters({ productId: '', sentiment: '', rating: '', search: '', sortBy: 'createdAt' })}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by keyword in review..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Product Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Product</label>
            <select
              value={filters.productId}
              onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Products</option>
              {sellerProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sentiment Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sentiment</label>
            <select
              value={filters.sentiment}
              onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="positive">🟢 Positive</option>
              <option value="neutral">🟡 Neutral</option>
              <option value="negative">🔴 Negative</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Star Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="5">★★★★★ (5 Stars)</option>
              <option value="4">★★★★☆ (4 Stars)</option>
              <option value="3">★★★☆☆ (3 Stars)</option>
              <option value="2">★★☆☆☆ (2 Stars)</option>
              <option value="1">★☆☆☆☆ (1 Star)</option>
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {reviews.length} of {totalPages * 10} reviews
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Most Recent</option>
              <option value="rating">Lowest Rated</option>
              <option value="sellerReply">Unanswered First</option>
            </select>
          </div>
        </div>

        {/* Reviews Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reviews found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sentiment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900 line-clamp-1">
                        {review.productId?.title || 'Unknown Product'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">
                        {review.userId?.name || 'Anonymous'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentBadge(review.sentiment)}`}>
                        {getSentimentEmoji(review.sentiment)} {review.sentiment}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-700 line-clamp-2 max-w-md">
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {review.sellerReply ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Replied
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setViewingReview(review)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </button>
                        {!review.sellerReply && (
                          <button
                            onClick={() => setReplyingTo(review._id)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                          >
                            <ReplyIcon className="w-3 h-3 mr-1" />
                            Reply
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Section D - Negative Reviews Alert Panel */}
      {needsAttention > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 shadow-md">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-amber-900 mb-2">Needs Your Attention</h3>
              <p className="text-amber-800 font-medium mb-4">
                <span className="text-2xl font-bold">{needsAttention}</span> negative {needsAttention === 1 ? 'review hasn\'t' : 'reviews haven\'t'} received a response yet.
              </p>
              <div className="space-y-3">
                {analytics.recentNegative.filter(r => !r.sellerReply).slice(0, 5).map((review) => (
                  <div key={review._id} className="bg-white border-2 border-amber-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-red-500 fill-red-500" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-gray-300" />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {review.productId?.title}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">By:</span> {review.userId?.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2 italic">
                          "{review.comment}"
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setReplyingTo(review._id);
                          setViewingReview(review);
                        }}
                        className="flex-shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                      >
                        Reply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review View Modal */}
      {viewingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Review Details</h3>
              <button
                onClick={() => {
                  setViewingReview(null);
                  setReplyingTo(null);
                  setReplyText('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Product Info */}
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{viewingReview.productId?.title}</h4>
                  <p className="text-sm text-gray-600">
                    Reviewed by {viewingReview.userId?.name} on {formatDate(viewingReview.createdAt)}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Rating</label>
                <div className="flex items-center space-x-2">
                  <StarRating rating={viewingReview.rating} size="md" />
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentBadge(viewingReview.sentiment)}`}>
                    {getSentimentEmoji(viewingReview.sentiment)} {viewingReview.sentiment}
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Review</label>
                <p className="text-gray-900 leading-relaxed">{viewingReview.comment}</p>
              </div>

              {/* Photos */}
              {viewingReview.photos && viewingReview.photos.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Photos</label>
                  <div className="grid grid-cols-3 gap-2">
                    {viewingReview.photos.map((photo: string, index: number) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Seller Reply Section */}
              {viewingReview.sellerReply ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="text-sm font-semibold text-blue-900 block mb-2">Your Reply</label>
                  <p className="text-gray-900">{viewingReview.sellerReply}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Replied on {formatDate(viewingReview.sellerRepliedAt)}
                  </p>
                </div>
              ) : replyingTo === viewingReview._id ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <label className="text-sm font-semibold text-gray-900 block mb-2">Write Your Reply</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Reply professionally to this customer..."
                    rows={4}
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">{replyText.length}/1000 characters</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReply(viewingReview._id)}
                        disabled={!replyText.trim()}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(viewingReview._id)}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reply to this Review
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inline Reply Modal (for table) */}
      {replyingTo && !viewingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Reply to Review</h3>
            </div>
            <div className="p-6">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply professionally to this customer..."
                rows={5}
                maxLength={1000}
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">{replyText.length}/1000 characters</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReply(replyingTo)}
                    disabled={!replyText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
