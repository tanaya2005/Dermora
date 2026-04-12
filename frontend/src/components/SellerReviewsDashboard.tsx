import React, { useState, useEffect } from 'react';
import { Star, AlertTriangle, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { getSellerReviewsDashboard } from '../lib/api-client';

interface SellerDashboardData {
  recentReviews: Array<{
    _id: string;
    productId: {
      title: string;
      imageUrl?: string;
    };
    userId: {
      name: string;
      profileImage?: string;
    };
    rating: number;
    comment: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    createdAt: string;
  }>;
  stats: {
    averageRating: number;
    totalReviews: number;
    negativeReviews: number;
    positiveReviews: number;
  };
  flaggedProducts: Array<{
    _id: string;
    title: string;
    averageRating: number;
    totalReviews: number;
    status: 'warning' | 'critical';
  }>;
}

export default function SellerReviewsDashboard() {
  const [data, setData] = useState<SellerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getSellerReviewsDashboard();
      setData(response);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-600">{error}</div>
        <button
          onClick={fetchDashboardData}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const positivePercentage = data.stats.totalReviews > 0 
    ? Math.round((data.stats.positiveReviews / data.stats.totalReviews) * 100)
    : 0;

  const negativePercentage = data.stats.totalReviews > 0
    ? Math.round((data.stats.negativeReviews / data.stats.totalReviews) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.stats.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="flex">
              {renderStars(Math.round(data.stats.averageRating))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.stats.totalReviews}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive Reviews</p>
              <p className="text-2xl font-bold text-green-600">
                {positivePercentage}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Negative Reviews</p>
              <p className="text-2xl font-bold text-red-600">
                {negativePercentage}%
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
            Recent Reviews
          </h3>
          
          {data.recentReviews.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No reviews yet. Keep promoting your products!
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {data.recentReviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {review.userId.profileImage ? (
                        <img
                          src={review.userId.profileImage}
                          alt={review.userId.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-medium">
                            {review.userId.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {review.userId.name}
                          </span>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            review.sentiment === 'positive' 
                              ? 'bg-green-100 text-green-800'
                              : review.sentiment === 'negative'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {review.sentiment}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">
                        {review.productId.title}
                      </p>
                      
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flagged Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            Products Needing Attention
          </h3>
          
          {data.flaggedProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-green-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              All your products are performing well!
            </div>
          ) : (
            <div className="space-y-4">
              {data.flaggedProducts.map((product) => (
                <div
                  key={product._id}
                  className={`p-4 rounded-lg border-l-4 ${
                    product.status === 'critical'
                      ? 'border-red-500 bg-red-50'
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{product.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.status === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      {renderStars(Math.round(product.averageRating))}
                      <span className="ml-1">{product.averageRating.toFixed(1)}</span>
                    </div>
                    <span>{product.totalReviews} reviews</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    {product.status === 'critical' 
                      ? 'Immediate attention required. Consider reviewing product quality or customer service.'
                      : 'Monitor closely. Consider reaching out to customers for feedback.'
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performance Alerts */}
      {(negativePercentage > 30 || data.stats.averageRating < 3.5) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-yellow-800 font-medium">Performance Alert</h4>
              <div className="text-yellow-700 text-sm mt-1">
                {negativePercentage > 30 && (
                  <p>• High percentage of negative reviews ({negativePercentage}%). Consider reviewing your products and customer service.</p>
                )}
                {data.stats.averageRating < 3.5 && (
                  <p>• Average rating is below 3.5. Focus on improving product quality and addressing customer concerns.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}