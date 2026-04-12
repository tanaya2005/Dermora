import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ReviewForm from './ReviewForm';

interface PendingReview {
  orderId: string;
  productId: string;
  productTitle: string;
  orderDate: string;
}

interface PendingReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllReviewsCompleted: () => void;
}

export default function PendingReviewsModal({ isOpen, onClose, onAllReviewsCompleted }: PendingReviewsModalProps) {
  const { apiRequest } = useAuth();
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchPendingReviews();
    }
  }, [isOpen]);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/reviews/user/pending');
      setPendingReviews(response.pendingReviews || []);
      setCurrentReviewIndex(0);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load pending reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    // Move to next review or close modal
    const nextIndex = currentReviewIndex + 1;
    if (nextIndex < pendingReviews.length) {
      setCurrentReviewIndex(nextIndex);
    } else {
      // All reviews completed
      onAllReviewsCompleted();
      onClose();
    }
  };

  const handleSkipReview = () => {
    const nextIndex = currentReviewIndex + 1;
    if (nextIndex < pendingReviews.length) {
      setCurrentReviewIndex(nextIndex);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pendingReviews.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pending Reviews</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">No pending reviews! You're all caught up.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentReview = pendingReviews[currentReviewIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Complete Your Reviews</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Review {currentReviewIndex + 1} of {pendingReviews.length}</span>
            <span>Order Date: {new Date(currentReview.orderDate).toLocaleDateString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentReviewIndex + 1) / pendingReviews.length) * 100}%` }}
            />
          </div>
        </div>

        <ReviewForm
          productId={currentReview.productId}
          productTitle={currentReview.productTitle}
          orderId={currentReview.orderId}
          onReviewSubmitted={handleReviewSubmitted}
          onCancel={handleSkipReview}
        />
      </div>
    </div>
  );
}