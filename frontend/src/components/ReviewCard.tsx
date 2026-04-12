import React, { useState } from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import StarRating from './StarRating';
import { useAuth } from '../hooks/useAuth';

interface ReviewCardProps {
  review: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      profileImage?: string;
    };
    rating: number;
    comment: string;
    photos: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    helpfulCount: number;
    isVerifiedPurchase: boolean;
    sellerReply?: string | null;
    sellerRepliedAt?: string | null;
    createdAt: string;
  };
  onHelpful?: (reviewId: string) => void;
  showProduct?: boolean;
  productInfo?: {
    title: string;
    imageUrl: string;
  };
}

const sentimentColors = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-yellow-100 text-yellow-800',
  negative: 'bg-red-100 text-red-800'
};

const sentimentLabels = {
  positive: '🟢 Positive',
  neutral: '🟡 Neutral',
  negative: '🔴 Needs Attention'
};

export default function ReviewCard({ review, onHelpful, showProduct, productInfo }: ReviewCardProps) {
  const { user } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleHelpful = async () => {
    if (hasVoted || !onHelpful) return;
    setHasVoted(true);
    onHelpful(review._id);
  };

  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      {/* Product Info (if shown) */}
      {showProduct && productInfo && (
        <div className="flex items-center space-x-3 pb-4 border-b">
          <img
            src={productInfo.imageUrl}
            alt={productInfo.title}
            className="w-12 h-12 object-cover rounded"
          />
          <div>
            <p className="font-medium text-sm">{productInfo.title}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            {review.userId.profileImage ? (
              <img
                src={review.userId.profileImage}
                alt={review.userId.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              getInitials(review.userId.name)
            )}
          </div>

          {/* User Info */}
          <div>
            <p className="font-medium">{review.userId.name.split(' ')[0]} {review.userId.name.split(' ')[1]?.[0]}.</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{formatDate(review.createdAt)}</span>
              {review.isVerifiedPurchase && (
                <>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Verified Purchase</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sentiment Badge */}
        <span className={`px-2 py-1 rounded text-xs font-medium ${sentimentColors[review.sentiment]}`}>
          {sentimentLabels[review.sentiment]}
        </span>
      </div>

      {/* Rating */}
      <div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="flex space-x-2 overflow-x-auto">
          {review.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Review photo ${index + 1}`}
              className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
              onClick={() => setSelectedPhoto(photo)}
            />
          ))}
        </div>
      )}

      {/* Helpful Button */}
      {onHelpful && (
        <div className="flex items-center space-x-4 pt-2">
          <button
            onClick={handleHelpful}
            disabled={hasVoted}
            className={`flex items-center space-x-2 text-sm ${
              hasVoted ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>
              {hasVoted ? 'Marked as helpful' : 'Helpful'} ({review.helpfulCount})
            </span>
          </button>
        </div>
      )}

      {/* Seller Reply */}
      {review.sellerReply && (
        <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mt-4">
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900 mb-1">Seller Response</p>
              <p className="text-gray-700 text-sm">{review.sellerReply}</p>
              {review.sellerRepliedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Replied on {formatDate(review.sellerRepliedAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Review photo"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
