import React, { useState, useEffect } from 'react';
import { Flag, Eye, EyeOff, Check, X, AlertTriangle } from 'lucide-react';
import { apiClient } from '../lib/api-client';

interface Review {
  _id: string;
  userId: {
    name: string;
    email: string;
    profileImage?: string;
  };
  productId: {
    title: string;
    imageUrl?: string;
  };
  rating: number;
  comment: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  reportedCount: number;
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  isVisible: boolean;
  createdAt: string;
}

interface ModerationStats {
  totalReviews: number;
  pendingModeration: number;
  moderatedToday: number;
  reportedReviews: number;
  moderationBreakdown: Record<string, number>;
  sentimentBreakdown: Record<string, number>;
}

export default function ReviewModerationDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject' | 'flag' | 'hide'>('approve');
  const [moderationReason, setModerationReason] = useState('');

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [filter, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/reviews/admin/moderation?filter=${filter}&page=${page}&limit=20`);
      setReviews(response.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/reviews/admin/moderation/stats');
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleModerateReview = async (reviewId: string, action: string, reason?: string) => {
    try {
      await apiClient.post(`/api/reviews/admin/moderate/${reviewId}`, {
        action,
        reason: reason || moderationReason
      });
      
      fetchReviews();
      fetchStats();
      setModerationReason('');
    } catch (error) {
      console.error('Failed to moderate review:', error);
    }
  };

  const handleBulkModeration = async () => {
    if (selectedReviews.length === 0) return;

    try {
      await apiClient.post('/api/reviews/admin/bulk-moderate', {
        reviewIds: selectedReviews,
        action: moderationAction,
        reason: moderationReason
      });

      setSelectedReviews([]);
      setShowModerationModal(false);
      setModerationReason('');
      fetchReviews();
      fetchStats();
    } catch (error) {
      console.error('Failed to bulk moderate reviews:', error);
    }
  };

  const toggleReviewSelection = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'flagged': return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (loading && reviews.length === 0) {
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Moderation</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingModeration}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Moderated Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.moderatedToday}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reported Reviews</p>
                <p className="text-2xl font-bold text-red-600">{stats.reportedReviews}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Reviews' },
              { value: 'reported', label: 'Reported' },
              { value: 'low-rating', label: 'Low Rating' },
              { value: 'negative-sentiment', label: 'Negative' },
              { value: 'flagged', label: 'Flagged' },
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>

          {selectedReviews.length > 0 && (
            <button
              onClick={() => setShowModerationModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Moderate Selected ({selectedReviews.length})
            </button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <div key={review._id} className="p-6">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedReviews.includes(review._id)}
                  onChange={() => toggleReviewSelection(review._id)}
                  className="mt-1"
                />
                
                <div className="flex-shrink-0">
                  {review.userId.profileImage ? (
                    <img
                      src={review.userId.profileImage}
                      alt={review.userId.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">
                        {review.userId.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{review.userId.name}</h4>
                      {renderStars(review.rating)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment)}`}>
                        {review.sentiment}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.moderationStatus)}`}>
                        {review.moderationStatus}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {review.reportedCount > 0 && (
                        <span className="flex items-center text-red-600 text-sm">
                          <Flag className="w-4 h-4 mr-1" />
                          {review.reportedCount}
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{review.productId.title}</p>
                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleModerateReview(review._id, 'approve')}
                      className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleModerateReview(review._id, 'reject')}
                      className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleModerateReview(review._id, 'flag')}
                      className="flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
                    >
                      <Flag className="w-4 h-4 mr-1" />
                      Flag
                    </button>
                    <button
                      onClick={() => handleModerateReview(review._id, 'hide')}
                      className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <EyeOff className="w-4 h-4 mr-1" />
                      Hide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Moderation Modal */}
      {showModerationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Moderate Selected Reviews</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                <select
                  value={moderationAction}
                  onChange={(e) => setModerationAction(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="approve">Approve</option>
                  <option value="reject">Reject</option>
                  <option value="flag">Flag</option>
                  <option value="hide">Hide</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Optional reason for moderation..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModerationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkModeration}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Apply to {selectedReviews.length} Reviews
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}