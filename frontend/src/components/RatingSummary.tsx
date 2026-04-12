import React from 'react';
import StarRating from './StarRating';

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  onFilterByRating?: (rating: number | null) => void;
  selectedRating?: number | null;
}

export default function RatingSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
  onFilterByRating,
  selectedRating
}: RatingSummaryProps) {
  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  const ratingLevels = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>

      <div className="flex items-start space-x-8">
        {/* Overall Rating */}
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={averageRating} size="lg" />
          <p className="text-sm text-gray-600 mt-2">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1 space-y-2">
          {ratingLevels.map((rating) => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution] || 0;
            const percentage = getPercentage(count);
            const isSelected = selectedRating === rating;

            return (
              <button
                key={rating}
                onClick={() => onFilterByRating && onFilterByRating(isSelected ? null : rating)}
                className={`w-full flex items-center space-x-3 group ${
                  onFilterByRating ? 'hover:bg-gray-50 cursor-pointer' : ''
                } ${isSelected ? 'bg-blue-50' : ''} rounded p-1 transition-colors`}
              >
                {/* Star Label */}
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <svg
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      rating === 5 ? 'bg-green-500' :
                      rating === 4 ? 'bg-teal-500' :
                      rating === 3 ? 'bg-yellow-500' :
                      rating === 2 ? 'bg-orange-500' :
                      'bg-red-500'
                    } transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Percentage and Count */}
                <div className="flex items-center space-x-2 w-32 text-sm">
                  <span className="font-medium text-gray-700 w-10 text-right">
                    {percentage}%
                  </span>
                  <span className="text-gray-500">
                    ({count} {count === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Reset */}
      {selectedRating && onFilterByRating && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => onFilterByRating(null)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
