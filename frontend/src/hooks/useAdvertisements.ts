import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';

interface Advertisement {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  targetAudience: string;
  priority: number;
}

export const useAdvertisements = (userType: 'guest' | 'signed_in' = 'guest') => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch advertisements
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/advertisements/active?userType=${userType}`);
        
        if (response.data.success) {
          setAdvertisements(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching advertisements:', err);
        setError('Failed to load advertisements');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [userType]);

  // Record impression
  const recordImpression = async (adId: string) => {
    try {
      await apiClient.post(`/api/advertisements/${adId}/impression`);
    } catch (err) {
      console.error('Error recording impression:', err);
    }
  };

  // Record click
  const recordClick = async (adId: string) => {
    try {
      await apiClient.post(`/api/advertisements/${adId}/click`);
    } catch (err) {
      console.error('Error recording click:', err);
    }
  };

  // Get current advertisement
  const getCurrentAd = (): Advertisement | null => {
    if (advertisements.length === 0) return null;
    return advertisements[currentAdIndex] || null;
  };

  // Move to next advertisement
  const nextAd = () => {
    if (advertisements.length > 0) {
      setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
    }
  };

  // Check if there are more ads to show
  const hasMoreAds = () => {
    return advertisements.length > 0 && currentAdIndex < advertisements.length - 1;
  };

  return {
    advertisements,
    currentAd: getCurrentAd(),
    isLoading,
    error,
    recordImpression,
    recordClick,
    nextAd,
    hasMoreAds,
    totalAds: advertisements.length
  };
};