import React, { useState, useEffect } from 'react';
import AdPopup from './AdPopup';
import { useAdvertisements } from '../hooks/useAdvertisements';
import { useAuth } from '../hooks/useAuth';

const AdManager: React.FC = () => {
  const { user } = useAuth();
  const userType = user ? 'signed_in' : 'guest';
  const { currentAd, recordImpression, recordClick, nextAd, hasMoreAds } = useAdvertisements(userType);
  
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownInitialAd, setHasShownInitialAd] = useState(false);

  // Show initial ad after a delay
  useEffect(() => {
    if (currentAd && !hasShownInitialAd) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        setHasShownInitialAd(true);
        recordImpression(currentAd._id);
      }, 3000); // Show ad after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [currentAd, hasShownInitialAd, recordImpression]);

  // Show subsequent ads periodically
  useEffect(() => {
    if (hasShownInitialAd && hasMoreAds()) {
      const interval = setInterval(() => {
        nextAd();
        if (currentAd) {
          setShowPopup(true);
          recordImpression(currentAd._id);
        }
      }, 60000); // Show next ad every 60 seconds

      return () => clearInterval(interval);
    }
  }, [hasShownInitialAd, hasMoreAds, nextAd, currentAd, recordImpression]);

  const handleAdClick = async (adId: string, redirectUrl: string) => {
    await recordClick(adId);
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (!currentAd) {
    return null;
  }

  return (
    <AdPopup
      isOpen={showPopup}
      onClose={handleClosePopup}
      advertisement={currentAd}
      onAdClick={handleAdClick}
    />
  );
};

export default AdManager;