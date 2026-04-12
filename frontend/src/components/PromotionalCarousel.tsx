import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Gift, Stethoscope, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const promotions = [
  {
    id: 1,
    title: '🎉 First Consultation FREE!',
    subtitle: 'Get expert dermatologist advice at zero cost',
    description: 'Book your first consultation with our certified dermatologists absolutely free. No hidden charges!',
    cta: 'Book Now',
    link: '/dermatologists',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    icon: <Stethoscope className="w-12 h-12" />,
  },
  {
    id: 2,
    title: '✨ Free Skin Assessment!',
    subtitle: 'Discover your perfect skincare routine',
    description: 'Take our AI-powered skin assessment and get personalized product recommendations for FREE!',
    cta: 'Start Assessment',
    link: '/skin-analysis',
    gradient: 'from-purple-500 via-indigo-500 to-blue-500',
    icon: <Sparkles className="w-12 h-12" />,
  },
  {
    id: 3,
    title: '🎁 Free Dermat Consultation!',
    subtitle: 'On orders worth ₹3,500 or 3+ orders',
    description: 'Shop for ₹3,500 or place 3 orders and unlock a FREE consultation with our expert dermatologists!',
    cta: 'Shop Now',
    link: '/products',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    icon: <Gift className="w-12 h-12" />,
  },
  {
    id: 4,
    title: '🛍️ Special Offer!',
    subtitle: 'Exclusive deals on premium skincare',
    description: 'Get up to 30% off on dermatologist-recommended products. Limited time offer!',
    cta: 'Explore Deals',
    link: '/products',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    icon: <ShoppingCart className="w-12 h-12" />,
  },
];

const PromotionalCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return promotions.length - 1;
      if (next >= promotions.length) return 0;
      return next;
    });
  };

  const currentPromo = promotions[currentIndex];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[400px] sm:h-[350px] rounded-3xl overflow-hidden shadow-2xl">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className={`absolute inset-0 bg-gradient-to-r ${currentPromo.gradient} flex items-center justify-center cursor-grab active:cursor-grabbing`}
            >
              <div className="max-w-5xl mx-auto px-8 py-12 text-center text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-6 flex justify-center"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                    {currentPromo.icon}
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
                >
                  {currentPromo.title}
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl sm:text-2xl font-semibold mb-3 text-white/90"
                >
                  {currentPromo.subtitle}
                </motion.p>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-base sm:text-lg mb-8 max-w-2xl mx-auto text-white/80"
                >
                  {currentPromo.description}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    to={currentPromo.link}
                    className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                  >
                    {currentPromo.cta} →
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Quick Info Cards Below Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
              First Consultation FREE
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Expert dermatologist advice at no cost
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
              Free Skin Assessment
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered personalized recommendations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
              Unlock Free Consultation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              On ₹3,500+ orders or 3 total orders
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalCarousel;
