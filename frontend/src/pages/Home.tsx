import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AdManager from '../components/AdManager';
import SkinQuizPopup from '../components/SkinQuizPopup';
import PromotionalCarousel from '../components/PromotionalCarousel';
import { useSkinQuizPopup } from '../hooks/useSkinQuizPopup';
import { showToast } from '../lib/toast';
import { apiClient } from '../lib/api-client';

interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  averageRating?: number;
}

export default function Home() {
  const { isPopupOpen, closePopup } = useSkinQuizPopup();
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [counters, setCounters] = useState({
    brands: 0,
    products: 0,
    customers: 0,
    rating: 0
  });

  // Animated counters
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCounters(prev => ({
          brands: Math.min(prev.brands + 1, 47),
          products: Math.min(prev.products + 50, 1284),
          customers: Math.min(prev.customers + 500, 18000),
          rating: Math.min(prev.rating + 0.1, 4.8)
        }));
      }, 50);

      setTimeout(() => clearInterval(interval), 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Fetch trending products
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await apiClient.get('/api/products?limit=6&sortBy=createdAt&order=desc');
        if (response.products) {
          setTrendingProducts(response.products);
        }
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };
    fetchTrendingProducts();
  }, []);

  const handleAddToWishlist = (productName: string) => {
    showToast.success(`${productName} added to wishlist ✓`);
  };

  const handleAddToCart = (productName: string) => {
    showToast.success(`${productName} added to cart ✓`);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-secondary dark:bg-primary transition-colors duration-300">
      
      {/* Skin Quiz Popup */}
      <SkinQuizPopup isOpen={isPopupOpen} onClose={closePopup} />
      
      {/* Advertisement Manager */}
      <AdManager />
      
      {/* Hero Section - Full Screen Split Layout */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-secondary via-white to-secondary/50 dark:from-primary dark:via-slate-800 dark:to-slate-900 grain-texture">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen px-6 py-20">
          
          {/* Left Side - Content */}
          <motion.div 
            className="space-y-8 z-10 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-display font-bold tracking-tight leading-tight text-primary dark:text-secondary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Skincare, Backed by{' '}
              <span className="text-accent">Science</span>.{' '}
              <span className="block">Trusted by Dermatologists.</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover personalized routines powered by AI and dermatologist expertise. 
              Clean ingredients, clinical results, delivered to your door.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/products" className="btn-primary">
                Shop Now
              </Link>
              <Link to="/dermatologists" className="btn-secondary">
                Book a Consultation
              </Link>
            </motion.div>

            {/* Floating Product Cards */}
            <motion.div 
              className="hidden lg:flex absolute -right-20 top-20 space-x-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <div className="glass-card p-4 w-48">
                <img src="https://placehold.co/120x120/e0e7ff/6366f1?text=Serum" alt="Niacinamide Serum" className="w-full h-24 object-cover rounded-lg mb-2" />
                <h4 className="font-semibold text-sm">Niacinamide 10% Serum</h4>
                <p className="text-accent font-bold">₹899</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Lifestyle Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6pGceN0yMzgWmfxQkM1u9WHu0rOCUQAN5XFCQADbc0fbmFec43Wg7ws2yAyaRLJ7aheDFsTydSvXZ1D90bIp11xvT2z7WT4I1fBKond_DH_MujiMX3M5tyd7WRvZq5CHNiCaOrQT0yh6E6wyMmrm6aLJJbFxuEX7Dd3kGYgNuxt5BZjtAKZNZ1ACYSDrzLsTnncuFiHlkt4Z9Eqi5dzYCnfg_4bjVA7ygQLxCknvXrEG-MQbT0QMK0J9tEDX8hO9bGOOa3MDAaWM"
                alt="Dermora skincare lifestyle"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Product Overlay Cards */}
            <motion.div 
              className="absolute -bottom-6 -left-6 glass-card p-4 w-56"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="flex items-center space-x-3">
                <img src="https://placehold.co/60x60/fef3c7/f59e0b?text=Cream" alt="Vitamin C Cream" className="w-12 h-12 rounded-lg" />
                <div>
                  <h4 className="font-semibold text-sm">Vitamin C Brightening Cream</h4>
                  <p className="text-accent font-bold">₹1,299</p>
                  <div className="flex text-yellow-400 text-xs">★★★★★</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Promotional Carousel - Special Offers */}
      <PromotionalCarousel />

      {/* Trust Bar - Animated Counters */}
      <section className="py-8 bg-primary text-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              className="count-up"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold">{counters.brands}</div>
              <div className="text-sm opacity-90">Verified Brands</div>
            </motion.div>
            <motion.div 
              className="count-up stagger-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold">{counters.products.toLocaleString()}</div>
              <div className="text-sm opacity-90">Products</div>
            </motion.div>
            <motion.div 
              className="count-up stagger-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold">{counters.customers.toLocaleString()}+</div>
              <div className="text-sm opacity-90">Happy Customers</div>
            </motion.div>
            <motion.div 
              className="count-up stagger-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold">{counters.rating.toFixed(1)}★</div>
              <div className="text-sm opacity-90">Rated</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Animated Card Grid */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-display font-bold mb-6 text-primary dark:text-secondary">Shop by Category</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Discover products tailored to your specific skincare needs
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Moisturizers', icon: '💧', count: '234 products' },
              { name: 'Serums', icon: '✨', count: '189 products' },
              { name: 'Sunscreen', icon: '☀️', count: '156 products' },
              { name: 'Cleansers', icon: '🧼', count: '198 products' },
              { name: 'Treatments', icon: '🎯', count: '145 products' },
              { name: 'Tools', icon: '🔧', count: '67 products' }
            ].map((category, index) => (
              <motion.div
                key={category.name}
                className="product-card bg-secondary/50 dark:bg-slate-800 p-6 rounded-2xl text-center cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-primary dark:text-secondary">{category.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{category.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products - Horizontal Scroll Carousel */}
      <section className="py-20 px-6 bg-secondary/30 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-display font-bold mb-6 text-primary dark:text-secondary">Trending Products</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Most loved by our community this month
            </p>
          </motion.div>
          
          <div className="flex overflow-x-auto space-x-6 pb-4 custom-scrollbar">
            {trendingProducts.length > 0 ? trendingProducts.map((product, index) => (
              <motion.div
                key={product._id}
                className="product-card flex-shrink-0 w-72 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/products/${product._id}`}>
                  <img 
                    src={product.imageUrl || 'https://placehold.co/200x200/e0e7ff/6366f1?text=Product'} 
                    alt={product.title} 
                    className="w-full h-48 object-cover rounded-xl mb-4 hover:opacity-90 transition-opacity cursor-pointer" 
                  />
                </Link>
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-lg mb-2 text-primary dark:text-secondary hover:text-accent transition-colors cursor-pointer">
                    {product.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-accent font-bold text-xl">₹{product.price.toLocaleString()}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {product.averageRating?.toFixed(1) || '4.5'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleAddToWishlist(product.title)}
                    className="flex-1 py-2 px-4 border border-accent text-accent rounded-xl hover:bg-accent hover:text-white transition-colors"
                  >
                    Wishlist
                  </button>
                  <button 
                    onClick={() => handleAddToCart(product.title)}
                    className="flex-1 py-2 px-4 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            )) : (
              // Fallback static products if API fails
              [
                { name: 'Niacinamide 10% Serum', price: '₹899', rating: 4.8, image: 'https://placehold.co/200x200/e0e7ff/6366f1?text=Niacinamide' },
                { name: 'Vitamin C Moisturizer', price: '₹1,299', rating: 4.7, image: 'https://placehold.co/200x200/fef3c7/f59e0b?text=Vitamin+C' },
                { name: 'Hyaluronic Acid Serum', price: '₹1,199', rating: 4.6, image: 'https://placehold.co/200x200/dbeafe/3b82f6?text=Hyaluronic' },
                { name: 'Retinol Night Cream', price: '₹1,599', rating: 4.9, image: 'https://placehold.co/200x200/fce7f3/ec4899?text=Retinol' },
                { name: 'Salicylic Acid Cleanser', price: '₹699', rating: 4.5, image: 'https://placehold.co/200x200/d1fae5/10b981?text=Cleanser' },
                { name: 'SPF 50 Sunscreen', price: '₹799', rating: 4.4, image: 'https://placehold.co/200x200/fed7aa/f97316?text=Sunscreen' }
              ].map((product, index) => (
                <motion.div
                  key={product.name}
                  className="product-card flex-shrink-0 w-72 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to="/products">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-4 hover:opacity-90 transition-opacity cursor-pointer" />
                  </Link>
                  <Link to="/products">
                    <h3 className="font-semibold text-lg mb-2 text-primary dark:text-secondary hover:text-accent transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-accent font-bold text-xl">{product.price}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAddToWishlist(product.name)}
                      className="flex-1 py-2 px-4 border border-accent text-accent rounded-xl hover:bg-accent hover:text-white transition-colors"
                    >
                      Wishlist
                    </button>
                    <button 
                      onClick={() => handleAddToCart(product.name)}
                      className="flex-1 py-2 px-4 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Dermatologist Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-display font-bold mb-6 text-primary dark:text-secondary">Shop Derm-Recommended</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Products recommended by our certified dermatologists
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Dr. Priya Sharma', 
                specialty: 'Acne & Hyperpigmentation', 
                image: 'https://placehold.co/150x150/e0e7ff/6366f1?text=Dr.+PS',
                recommendations: 24
              },
              { 
                name: 'Dr. Rajesh Kumar', 
                specialty: 'Anti-Aging Expert', 
                image: 'https://placehold.co/150x150/dbeafe/3b82f6?text=Dr.+RK',
                recommendations: 31
              },
              { 
                name: 'Dr. Anita Desai', 
                specialty: 'Sensitive Skin Specialist', 
                image: 'https://placehold.co/150x150/fce7f3/ec4899?text=Dr.+AD',
                recommendations: 18
              }
            ].map((doctor, index) => (
              <motion.div
                key={doctor.name}
                className="text-center p-8 rounded-2xl bg-secondary/50 dark:bg-slate-800"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="text-xl font-semibold mb-2 text-primary dark:text-secondary">{doctor.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{doctor.specialty}</p>
                <p className="text-sm text-accent mb-6">{doctor.recommendations} Product Recommendations</p>
                <Link to="/dermatologists" className="btn-secondary text-sm">
                  View Recommendations
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - 3-Step Flow */}
      <section className="py-20 px-6 bg-secondary/30 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-display font-bold mb-6 text-primary dark:text-secondary">How It Works</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Your journey to perfect skin in three simple steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: '01', 
                title: 'Browse', 
                desc: 'Explore our curated collection of dermatologist-approved products',
                icon: '🔍'
              },
              { 
                step: '02', 
                title: 'Get Expert Advice', 
                desc: 'Take our AI skin assessment or consult with certified dermatologists',
                icon: '👩‍⚕️'
              },
              { 
                step: '03', 
                title: 'Checkout Safely', 
                desc: 'Secure payment, fast delivery, and 30-day money-back guarantee',
                icon: '✅'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-6xl mb-6">{step.icon}</div>
                <div className="text-6xl font-display font-bold text-accent/20 mb-4">{step.step}</div>
                <h3 className="text-2xl font-semibold mb-4 text-primary dark:text-secondary">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
                
                {/* Connecting Arrow */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <svg className="w-12 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Testimonial Carousel */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-display font-bold mb-6 text-primary dark:text-secondary">What Our Customers Say</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Real results from real people
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                skinType: 'Oily, Acne-Prone',
                rating: 5,
                review: 'The niacinamide serum completely transformed my skin! My acne has reduced by 80% in just 6 weeks.',
                image: 'https://placehold.co/80x80/e0e7ff/6366f1?text=PS'
              },
              {
                name: 'Rahul Kumar',
                skinType: 'Dry, Sensitive',
                rating: 5,
                review: 'Finally found products that don\'t irritate my sensitive skin. The hyaluronic acid moisturizer is a game-changer!',
                image: 'https://placehold.co/80x80/dbeafe/3b82f6?text=RK'
              },
              {
                name: 'Anita Desai',
                skinType: 'Combination, Aging',
                rating: 4,
                review: 'The retinol cream has visibly reduced my fine lines. Love that it\'s dermatologist-recommended!',
                image: 'https://placehold.co/80x80/fce7f3/ec4899?text=AD'
              }
            ].map((review, index) => (
              <motion.div
                key={review.name}
                className="bg-secondary/50 dark:bg-slate-800 p-8 rounded-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold text-primary dark:text-secondary">{review.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{review.skinType}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic">"{review.review}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter/Dermora Pro CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-accent to-accent-light text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-display font-bold mb-6">Join Dermora Pro</h2>
            <p className="text-xl mb-8 opacity-90">
              Free delivery, exclusive deals, monthly skin box, and priority dermatologist consultations
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">🚚</div>
                  <h3 className="font-semibold mb-2">Free Delivery</h3>
                  <p className="text-sm opacity-80">On all orders above ₹499</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">📦</div>
                  <h3 className="font-semibold mb-2">Monthly Skin Box</h3>
                  <p className="text-sm opacity-80">Curated products for your skin type</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">👩‍⚕️</div>
                  <h3 className="font-semibold mb-2">Priority Consultations</h3>
                  <p className="text-sm opacity-80">Skip the queue for dermatologist sessions</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-3xl font-bold">₹299/month</span>
              <Link to="/subscriptions" className="bg-white text-accent px-8 py-4 rounded-2xl font-semibold hover:bg-secondary transition-colors">
                Start Free Trial
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-primary text-secondary">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-display font-bold mb-6">Ready to Transform Your Skin?</h2>
            <p className="text-xl opacity-90 mb-8">
              Take our 2-minute assessment and get your personalized routine today.
            </p>
            <Link to="/skin-analysis" className="btn-primary bg-accent hover:bg-accent-dark">
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
