import { useState, useEffect } from 'react';

export function useSkinQuizPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // Show popup every time the component mounts (user visits home page)
    // Add a small delay for better UX
    const timer = setTimeout(() => {
      setIsPopupOpen(true);
    }, 1500); // Show after 1.5 second delay

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  return {
    isPopupOpen,
    closePopup,
    openPopup
  };
}