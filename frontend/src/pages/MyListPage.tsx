import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  recommendationReason?: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-primary">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className="material-symbols-outlined text-sm">
          {i <= Math.floor(rating) ? 'star' : rating % 1 >= 0.5 && i === Math.ceil(rating) ? 'star_half' : 'star_border'}
        </span>
      ))}
    </div>
  );
}

// card: white on light bg → dark text | slate-700 on dark bg → light text
const cardCls = 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm';

function ProductCard({ 
  product, 
  onRemove, 
  isSaved,
  isRecommended 
}: { 
  product: Product; 
  onRemove?: (id: string) => void; 
  isSaved?: boolean;
  isRecommended?: boolean;
}) {
  const { apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiRequest('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
      alert('Added to cart!');
    } catch (err: any) {
      alert(err.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`group relative overflow-hidden hover:shadow-xl transition-all duration-300 ${cardCls}`}>
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-600">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Tag badge */}
        {(isSaved || isRecommended) && (
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md ${
              isRecommended ? 'bg-violet-500 text-white' : 'bg-primary text-white'
            }`}>
              <span className="material-symbols-outlined text-xs">
                {isRecommended ? 'auto_awesome' : 'favorite'}
              </span>
              {isRecommended ? 'AI Pick' : 'Saved'}
            </span>
          </div>
        )}
      </Link>
      
      {/* Remove button (saved items) */}
      {isSaved && onRemove && (
        <button
          onClick={() => onRemove(product._id)}
          className="absolute top-3 right-3 w-8 h-8 z-10 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center transition-opacity shadow-sm hover:bg-rose-50 dark:hover:bg-rose-900/40"
        >
          <span className="material-symbols-outlined text-sm text-rose-400">close</span>
        </button>
      )}

      {/* Text content */}
      <div className="p-4 flex flex-col h-full">
        <StarRating rating={4.5} />
        {/* Light card → dark text | dark card → white text */}
        <Link to={`/products/${product._id}`}>
          <h3 className="font-serif font-bold text-slate-900 dark:text-white text-sm leading-snug mt-1 mb-0.5 truncate">
            {product.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-300 mb-3 truncate">{product.description}</p>
        
        {isRecommended && product.recommendationReason && (
          <p className="text-xs text-violet-500 bg-violet-50 dark:bg-violet-900/20 p-2 rounded mb-3">
            💡 {product.recommendationReason}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto mb-3">
          <span className="font-bold text-slate-900 dark:text-white">₹{(product.price || 0).toFixed(2)}</span>
          <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded uppercase">50ml</span>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold text-xs py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export const MyListPage: React.FC = () => {
  const { apiRequest } = useAuth();
  
  const [saved, setSaved] = useState<{ _id: string, productId: Product }[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'saved' | 'recommended'>('saved');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [wishlistRes, recRes] = await Promise.all([
        apiRequest('/api/wishlist').catch(() => ({ wishlistItems: [] })),
        apiRequest('/api/recommendations').catch(() => ({ recommendations: [] }))
      ]);

      setSaved(wishlistRes.wishlistItems || []);
      setRecommendedItems(recRes.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeSaved = async (wishlistId: string) => {
    try {
      await apiRequest(`/api/wishlist/${wishlistId}`, { method: 'DELETE' });
      setSaved(prev => prev.filter(p => p._id !== wishlistId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <main className="max-w-6xl mx-auto w-full px-6 md:px-10 py-10">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-3">
            <Link className="hover:text-primary transition-colors" to="/">Home</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary font-medium">My List</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">My List</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Your saved favourites &amp; AI-curated picks.</p>
            </div>
            <Link
              to="/assessment"
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-500 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-400/20 hover:opacity-90 transition-opacity self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Refresh AI Picks
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-1 w-fit mb-8">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">favorite</span>
              Saved ({saved.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'recommended'
                ? 'bg-violet-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              AI Recommended ({recommendedItems.length})
            </span>
          </button>
        </div>

        {/* Saved tab */}
        {activeTab === 'saved' && (
          <>
            {saved.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 gap-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary">favorite_border</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">No saved items yet</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Tap the heart on any product to save it here.</p>
                </div>
                <Link to="/products" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {saved.map(item => (
                  <ProductCard key={item._id} product={item.productId} onRemove={() => removeSaved(item._id)} isSaved />
                ))}
              </div>
            )}
          </>
        )}

        {/* AI Recommended tab */}
        {activeTab === 'recommended' && (
          <div>
            {/* AI Banner */}
            <div className="bg-white dark:bg-slate-700 border border-violet-200 dark:border-violet-700/50 rounded-2xl p-5 mb-7 flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-violet-500 flex items-center justify-center shadow-md shadow-violet-400/20">
                <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Personalised for your skin type</p>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                  Based on your{' '}
                  <Link to="/assessment" className="text-primary hover:underline font-semibold">skin assessment</Link>.
                  Take it again to get fresh picks!
                </p>
              </div>
            </div>
            {recommendedItems.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-500">No recommendations available. Please complete your skin assessment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedItems.map(p => (
                  <ProductCard key={p._id} product={p} isRecommended />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyListPage;
