import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface SkinQuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SkinQuizPopup({ isOpen, onClose }: SkinQuizPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Wait for animation to complete
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose} // Close when clicking backdrop
    >
      <div 
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-600 text-lg">close</span>
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-700 to-teal-800 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-yellow-400 text-2xl">auto_awesome</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
            Ready for Your<br />
            <span className="text-teal-700">Best Skin Ever?</span>
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed text-sm">
            Our AI analysis takes just 90 seconds<br />
            to match you with your clinical<br />
            precision regimen.
          </p>

          {/* CTA Button */}
          <Link
            to="/assessment"
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-teal-700 to-teal-800 text-white font-semibold py-4 px-6 rounded-2xl hover:from-teal-800 hover:to-teal-900 transition-all duration-200 flex items-center justify-center gap-2 mb-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start My Assessment
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>

          {/* Maybe Later Button */}
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors text-sm"
          >
            Maybe Later
          </button>

          {/* Bottom Features */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                PRECISION MATCHING
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                2,400+ FORMULATIONS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}