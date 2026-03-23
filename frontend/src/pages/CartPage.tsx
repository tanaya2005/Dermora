import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type CartItem = {
  _id: string;
  productId: {
    _id: string;
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
  quantity: number;
};

// Card style: white in light, dark-slate in dark — text flips accordingly
const cardCls = 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm';

export const CartPage: React.FC = () => {
  const { apiRequest } = useAuth();
  const navigate = useNavigate();
  
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/api/cart');
      setItems(data.cartItems || []);
      // Auto-select all by default
      setSelectedItemIds((data.cartItems || []).map((i: CartItem) => i._id));
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await apiRequest(`/api/cart/${cartItemId}`, { method: 'DELETE' });
      setItems(prev => prev.filter(item => item._id !== cartItemId));
      setSelectedItemIds(prev => prev.filter(id => id !== cartItemId));
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  const toggleSelect = (cartItemId: string) => {
    setSelectedItemIds(prev => 
      prev.includes(cartItemId) ? prev.filter(id => id !== cartItemId) : [...prev, cartItemId]
    );
  };

  const saveToWishlist = async (cartItemId: string, productId: string) => {
    try {
      await apiRequest('/api/wishlist/add', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      // Also remove from cart
      await removeItem(cartItemId);
      alert('Saved to wishlist and removed from cart!');
    } catch (error: any) {
      alert(error.message || 'Failed to save to wishlist');
    }
  };

  const selectedItems = items.filter(i => selectedItemIds.includes(i._id));
  const subtotal = selectedItems.reduce((sum, i) => sum + (i.productId?.price || 0) * i.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    
    // Pass selected items to checkout
    navigate('/checkout', { state: { selectedItems, subtotal, total, discount, tax } });
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

        {/* Breadcrumb + title */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-3">
            <Link className="hover:text-primary transition-colors" to="/">Home</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary font-medium">My Cart</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
              My Cart
              <span className="ml-3 text-base font-normal text-slate-400 dark:text-slate-300/40">({items.length} items)</span>
            </h1>
            <Link to="/mylist" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              <span className="material-symbols-outlined text-sm">favorite</span>
              View My List
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary">shopping_bag</span>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Your cart is empty</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Looks like you haven't added anything yet.</p>
            </div>
            <Link to="/products" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">

            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map(item => (
                <div key={item._id} className={`flex items-center gap-4 p-5 hover:shadow-md transition-shadow ${cardCls}`}>
                  
                  {/* Select Checkbox */}
                  <input 
                    type="checkbox" 
                    checked={selectedItemIds.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                    className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary/40 cursor-pointer"
                  />

                  {/* Product image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-300">
                    <img src={item.productId?.imageUrl} alt={item.productId?.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        {/* Dark card → white text; light card → dark text */}
                        <h3 className="font-bold text-slate-900 dark:text-white">{item.productId?.title}</h3>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white">₹{((item.productId?.price || 0) * item.quantity).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 dark:border-slate-500 rounded-lg overflow-hidden px-4 py-1.5 font-semibold text-sm text-slate-900 dark:text-white">
                        Qty: {item.quantity}
                      </div>

                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => saveToWishlist(item._id, item.productId._id)}
                          className="text-xs text-slate-400 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">favorite_border</span>
                          Save
                        </button>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-xs text-rose-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">delete_outline</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo code */}
              <div className={`p-5 ${cardCls}`}>
                <p className="text-sm font-bold mb-3 text-slate-800 dark:text-white">Have a promo code?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promo}
                    onChange={e => setPromo(e.target.value)}
                    placeholder="Enter code (try DERMORA10)"
                    className="flex-1 border border-slate-200 dark:border-slate-500 rounded-lg px-4 py-2 text-sm
                      bg-slate-50 dark:bg-slate-600
                      text-slate-900 dark:text-white
                      placeholder-slate-400 dark:placeholder-slate-400
                      focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={() => { if (promo.toLowerCase() === 'dermora10') setPromoApplied(true); }}
                    className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-2 text-xs text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    10% discount applied!
                  </p>
                )}
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className={`sticky top-28 p-6 ${cardCls}`}>
                <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Order Summary</h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && discount > 0 && (
                    <div className="flex justify-between text-emerald-500">
                      <span>Promo (10%)</span>
                      <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-500">Free</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Tax (8%)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-500 flex justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="font-bold text-primary text-lg">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-center block hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-lg shadow-primary/20 text-sm"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/products"
                  className="w-full mt-3 border border-primary/30 dark:border-primary/40 text-primary py-3 rounded-xl font-semibold text-center block hover:bg-primary/5 transition-colors text-sm"
                >
                  Continue Shopping
                </Link>

                {/* Trust badges */}
                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-500 grid grid-cols-3 gap-2 text-center">
                  {[
                    { icon: 'local_shipping', label: 'Free Shipping' },
                    { icon: 'lock', label: 'Secure Pay' },
                    { icon: 'replay', label: '30-Day Returns' },
                  ].map(b => (
                    <div key={b.label} className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-xl">{b.icon}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-300 font-medium leading-tight">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
