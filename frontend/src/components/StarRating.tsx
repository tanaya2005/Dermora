import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRatingChange
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = React.useState(0);

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => {
        const isFilled = star <= (interactive ? (hoveredRating || rating) : rating);
        const isPartial = !isFilled && star - 0.5 <= rating;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform focus:outline-none`}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => handleClick(star)}
          >
            {isPartial ? (
              <div className="relative">
                <Star className={`${sizeClasses[size]} text-gray-300`} />
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star className={`${sizeClasses[size]} text-yellow-400 fill-current`} />
                </div>
              </div>
            ) : (
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            )}
          </button>
        );
      })}
      {showNumber && (
        <span className="text-sm font-medium text-gray-700 ml-2">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
