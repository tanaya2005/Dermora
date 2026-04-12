import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DermoraLogo } from '../components/Logo';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import { getProduct } from '../lib/api-client';
import { useAuth } from '../hooks/useAuth';
import { Star } from 'lucide-react';

const thumbnails = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuADpdoddIqx32rC3B4LvQhkfrqb68c1oAZpvByTRxzYQ_ierM14e0TEjq31yht6OmdBbOW0KaTDv-QNmw0DZaWgRFCs60mpKNs3PsJyR4itrRb6wexJx6Ab2uCWk3rpxpQxwD5lAiUUvxKVnUnJOmbnMDQ7DU530vVBvG6z9SyKJm0YK97IlPu2S9fnObKI72amCcOTSKLAOoCjGs5IcOevCJ_z5Rq2_CfPdaQvfSuEmzIOhOzuDCDo09tJOMHqRb9HGhf0PIZaTe0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBQTxOfhjY2QCm0eaMBHRvQwMywZttBfD14hZHgv1PPZRxtSVUtxEADi2YZXCg6vMrOdXVdcMnc0AOGnSisXDTW31mMOfHnSJHEROXwZOSyWIvNcT-sE2oGdxwACKP_ciij9hVYvAAMA1Z8k50ByZU4tFKzU5_3pLsj_iRBCXGW2XK-zWcbc8flumn86MT_mOqLJWeV5FPJCgEF2tp8_Woaee-xYxNrVLpeGqVguPCHXgMIOsJHNJmoRXukEit6MNt1Nrxa2mXdjYE',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBxR5A2QlPIyIeThTVhDy5yjKXJ3vQQn48rh6XqkSDihOW-AXcMW2-IIRTnLqwviKFwDPlBDQVsWVC1hDP37kKlfzBR_Ww-mmd0-p6kLc8yPHPZgBbB9ToG6QiZxGQpjfGgSyXOet4FFvcJyDtbXP97K2RW2F1GKAsKxkT0DUw7TDzmJIQ0QXd5fOoCMFvzxrLJZvjwuCP3EAz0ULJtk_S-q-Hspn2wTN7adl5l8-KtKV57ZqQSipm-u-Zd8Sf8xtTNdWTjAP3Oseo',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrXt3tTKYjiaHcG6kOCAGqZtRzCObTWtS9h6Ignf0Qc2buc0KgBdwuEzdDDnv4BFCAPyZLmff5B76n0jR2FMXVuIgyGr79diy4k-0_0vtjdQDu2RaTZM7I_UqaIl1wibWKi25tm2SyYVfxB0BfCMh-gA1jqfeLbH3R4OnG6Mr9yuqtpOc3pFjz0-Zv9Oy1gcYLkfKjPsbq1Bi3BvpOHl0PMuQNhE7zstJUukCGtyKxKkX1TlRLtT2gTye_P0llzfAf7DMPFjs89bI',
];

const ingredients = [
  { icon: 'water_drop', name: 'Hyaluronic Acid', desc: 'Multi-molecular weights for deep layer hydration.' },
  { icon: 'eco', name: 'Blue Algae', desc: 'Natural antioxidant to protect skin barrier.' },
  { icon: 'science', name: 'Peptides', desc: 'Clinically proven to boost collagen synthesis.' },
  { icon: 'compost', name: 'Niacinamide', desc: 'Vitamin B3 to refine pores and texture.' },
];

const reviews = [
  { initials: 'SR', name: 'Sarah R.', text: '"The only serum that actually makes my skin feel plump all day. I\'ve switched my entire routine to Dermora."' },
  { initials: 'ML', name: 'Marcus L.', text: '"Lightweight but powerful. No sticky residue, which is perfect for layering under sunscreen."' },
  { initials: 'ET', name: 'Elena T.', text: '"The subscription is so convenient. I never run out and the discount makes it a no-brainer."' },
];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, apiRequest } = useAuth();
  const navigate = useNavigate();
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [purchaseOption, setPurchaseOption] = useState('once');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [wishlistMessage, setWishlistMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProduct(id!);
      setProduct(response.product);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setReviewRefreshTrigger(prev => prev + 1);
    // Refresh product data to get updated rating
    fetchProduct();
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage('');
      await apiRequest('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
      setCartMessage('Added to cart successfully!');
      setTimeout(() => setCartMessage(''), 3000);
    } catch (err: any) {
      setCartMessage(err.message || 'Failed to add to cart');
      setTimeout(() => setCartMessage(''), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAddingToWishlist(true);
      setWishlistMessage('');
      await apiRequest('/api/wishlist/add', {
        method: 'POST',
        body: JSON.stringify({ productId: id }),
      });
      setWishlistMessage('Added to wishlist!');
      setTimeout(() => setWishlistMessage(''), 3000);
    } catch (err: any) {
      setWishlistMessage(err.message || 'Failed to add to wishlist');
      setTimeout(() => setWishlistMessage(''), 3000);
    } finally {
      setAddingToWishlist(false);
    }
  };

  const renderStars = (rating: number, size = 'text-sm') => {
    return (
      <div className="flex text-primary">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? 'fill-current' : ''
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen antialiased">
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <div className="space-y-4">
                <div className="aspect-square w-full bg-gray-200 rounded-xl"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white min-h-screen antialiased">
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <a
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Products
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen antialiased">
      

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-primary/5">
              <img 
                alt={product.title} 
                className="h-full w-full object-cover" 
                src={product.imageUrl || thumbnails[selectedThumb]} 
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {thumbnails.map((t, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer bg-primary/5 ${i === selectedThumb ? 'border-primary' : 'border-transparent hover:border-primary/30 transition-colors'}`}
                >
                  <img alt={`Thumbnail ${i+1}`} className="h-full w-full object-cover" src={product.imageUrl || t} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              {product.averageRating > 0 ? (
                <>
                  {renderStars(Math.round(product.averageRating))}
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                    {product.totalReviews} Review{product.totalReviews !== 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                  No reviews yet
                </span>
              )}
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">{product.title}</h2>
            <p className="text-2xl text-primary font-semibold mb-6">₹{product.price}</p>
            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
              {product.description}
            </p>

            <div className="space-y-3 mb-8">
              <label className="relative flex cursor-pointer items-center justify-between rounded-lg border border-primary/20 bg-white p-4 transition hover:border-primary">
                <div className="flex items-center gap-3">
                  <input checked={purchaseOption==='once'} onChange={() => setPurchaseOption('once')} className="h-4 w-4 border-primary text-primary focus:ring-primary" name="purchase_option" type="radio" />
                  <span className="block text-sm font-bold">One-time purchase</span>
                </div>
                <span className="text-sm font-semibold">₹{product.price}</span>
              </label>
              <label className="relative flex cursor-pointer items-center justify-between rounded-lg border border-primary bg-primary/5 p-4 transition">
                <div className="flex items-center gap-3">
                  <input checked={purchaseOption==='sub'} onChange={() => setPurchaseOption('sub')} className="h-4 w-4 border-primary text-primary focus:ring-primary" name="purchase_option" type="radio" />
                  <div>
                    <span className="block text-sm font-bold">Subscribe &amp; Save (15% off)</span>
                    <span className="block text-xs text-slate-500">Deliver every 30 days. Cancel anytime.</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">₹{(product.price * 0.85).toFixed(2)}</span>
              </label>
            </div>

            <div className="flex gap-3 mb-12">
              <button 
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-[#191716] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button 
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
                className="px-6 bg-white border-2 border-[#191716] text-[#191716] py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">favorite_border</span>
                {addingToWishlist ? 'Adding...' : 'Wishlist'}
              </button>
            </div>

            {/* Success/Error Messages */}
            {cartMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                cartMessage.includes('success') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {cartMessage}
              </div>
            )}
            {wishlistMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                wishlistMessage.includes('Added') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {wishlistMessage}
              </div>
            )}

            {/* Tabs */}
            <div className="border-t border-primary/10">
              <div className="flex gap-8 border-b border-primary/10">
                <button className="border-b-2 border-primary px-1 py-4 text-sm font-bold text-slate-900">Ingredients</button>
                <button className="px-1 py-4 text-sm font-medium text-slate-500 hover:text-primary transition-colors">Benefits</button>
                <button className="px-1 py-4 text-sm font-medium text-slate-500 hover:text-primary transition-colors">How to Use</button>
              </div>
              <div className="py-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ingredients.map(ing => (
                    <div key={ing.name} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined">{ing.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{ing.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{ing.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Results */}
        <section className="mt-24 bg-primary/5 rounded-xl p-8 lg:p-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-bold mb-4">Clinical Results</h3>
            <p className="text-slate-600">In a 4-week clinical study of 50 participants, users reported significant improvements in skin health.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[['98%','Instantly Hydrated'],['92%','Reduced Fine Lines'],['87%','Brighter Complexion']].map(([pct, label]) => (
              <div key={label}>
                <span className="text-5xl font-black text-primary">{pct}</span>
                <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Customer Reviews</h3>
            {/* Reviews can only be submitted from Order History page after delivery */}
          </div>
          
          <ReviewList 
            productId={product._id} 
            refreshTrigger={reviewRefreshTrigger}
          />
        </section>
      </main>
    </div>
  );
}
