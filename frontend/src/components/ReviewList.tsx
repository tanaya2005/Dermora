import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { getProductReviews } from '../lib/api-client';

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  rating: number;
  comment: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  createdAt: string;
  helpfulCount: number;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  sentimentDistribution: Record<string, number>;
}

interface ReviewListProps {
  productId: string;
  refreshTrigger?: number;
}

export default function ReviewList({ productId, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getProductReviews(productId, {
        page: pageNum,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc'
      });

      if (reset) {
        setReviews(response.reviews || []);
      } else {
        setReviews(prev => [...prev, ...(response.reviews || [])]);
      }
      
      setStats(response.stats || null);
      setHasMore(response.pagination && response.pagination.page < response.pagination.pages);
      
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews. Please check if the backend server is running.');
      setReviews([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1, true);
    setPage(1);
  }, [productId, refreshTrigger]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage, false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    if (!stats) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating] || 0;
          const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center space-x-2 text-sm">
              <span className="w-8">{rating}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-gray-600">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>
      
      {stats && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(stats.averageRating), 'w-6 h-6')}
            <div className="text-sm text-gray-600 mt-2">
              Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div>
            <h4 className="font-medium mb-3">Rating Breakdown</h4>
            {renderRatingDistribution()}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {review.userId.profileImage ? (
                    <img
                      src={review.userId.profileImage}
                      alt={review.userId.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {review.userId.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{review.userId.name}</h4>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                          {formatDate(review.createdAt)}
                        </span>
                        {review.sentiment === 'positive' && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Positive
                          </span>
                        )}
                        {review.sentiment === 'negative' && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Negative
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-gray-700">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpfulCount})</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-gray-700">
                      <Flag className="w-4 h-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && reviews.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  );
}