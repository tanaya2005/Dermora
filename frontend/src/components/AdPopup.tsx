import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Advertisement {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  targetAudience: string;
  priority: number;
}

interface AdPopupProps {
  isOpen: boolean;
  onClose: () => void;
  advertisement: Advertisement;
  onAdClick: (adId: string, redirectUrl: string) => void;
}

const AdPopup: React.FC<AdPopupProps> = ({ isOpen, onClose, advertisement, onAdClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleAdClick = () => {
    onAdClick(advertisement._id, advertisement.redirectUrl);
    handleClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-slate-700/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Advertisement Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={advertisement.imageUrl}
            alt={advertisement.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x200/e2e8f0/64748b?text=Advertisement';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Advertisement Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {advertisement.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            {advertisement.description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAdClick}
              className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Learn More
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Advertisement Label */}
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">
            Ad
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdPopup;