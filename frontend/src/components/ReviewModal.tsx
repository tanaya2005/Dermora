import React, { useState } from 'react';
import { X, Star, Upload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ReviewModalProps {
  productId: string;
  productName: string;
  productImage: string;
  orderId: string;
  onSuccess: () => void;
  onClose: () => void;
}

const RATING_LABELS = {
  1: 'Terrible',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent'
};

export default function ReviewModal({
  productId,
  productName,
  productImage,
  orderId,
  onSuccess,
  onClose
}: ReviewModalProps) {
  const { apiRequest } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (photos.length + files.length > 5) {
      setErrors({ ...errors, photos: 'Maximum 5 photos allowed' });
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach(file => {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        setErrors({ ...errors, photos: 'Only JPEG, PNG, and WebP images are allowed' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photos: 'Each photo must be less than 5MB' });
        return;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setPhotos([...photos, ...validFiles]);
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
    setErrors({ ...errors, photos: '' });
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(photoPreviews[index]);
    
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Review text is required';
    } else if (comment.length < 20) {
      newErrors.comment = 'Review must be at least 20 characters';
    } else if (comment.length > 2000) {
      newErrors.comment = 'Review must be 2000 characters or less';
    }

    if (photos.length === 0) {
      newErrors.photos = 'At least one photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('orderId', orderId);
      formData.append('rating', rating.toString());
      formData.append('comment', comment.trim());
      
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      await apiRequest('/api/reviews', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set Content-Type with boundary
      });

      // Clean up object URLs
      photoPreviews.forEach(url => URL.revokeObjectURL(url));

      onSuccess();
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to submit review' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = rating > 0 && comment.length >= 20 && photos.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Write a Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <img
              src={productImage}
              alt={productName}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-medium">{productName}</h3>
              <p className="text-sm text-gray-500">Verified Purchase</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2 font-medium">
                {RATING_LABELS[rating as keyof typeof RATING_LABELS]}
              </p>
            )}
            {errors.rating && (
              <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? How has it worked for your skin?"
              maxLength={2000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              {comment.length}/2000 {comment.length < 20 && '(minimum 20 characters)'}
            </p>
            {errors.comment && (
              <p className="text-sm text-red-600 mt-1">{errors.comment}</p>
            )}
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos <span className="text-red-500">*</span> (1-5 photos required)
            </label>
            
            {/* Photo Previews */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-3">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {photos.length < 5 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG, PNG, or WebP (max 5MB each)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            )}
            
            {errors.photos && (
              <p className="text-sm text-red-600 mt-1">{errors.photos}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
