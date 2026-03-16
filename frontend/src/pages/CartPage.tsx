import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type CartItem = {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  size: string;
  qty: number;
  img: string;
};

const initialItems: CartItem[] = [
  {
    id: 1,
    name: 'Hyaluronic Radiance Serum',
    subtitle: 'Deep hydration for glowing skin',
    price: 64.0,
    size: '30ml',
    qty: 1,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCthtV7EGAbCv3I6VI4zQgd7RdM_6jnCTqKQoBLSC0pRnEQA3BBE9Lr0jvndTbWlP5XP8bqDN8Y0c7A80ER7RHMQM8ghSsS0yGJFROxyKy6y9hMKhSXk_MnWyb8WhtzMTkYhFpG9pBjNqkwtbh3nrMlv9jrik9eudLf0_kggNVXGJPtuaLVl2RIp8Tnbv8FqKTPd0OdDVusXQInDDj-jY9vq1PIIs7xWBNonJ5o5CZdbo1odtHJ5p8GIAnz7Jb6gbxjOQFcslvUOv0',
  },
  {
    id: 2,
    name: 'Bakuchiol Night Elixir',
    subtitle: 'Plant-based retinol alternative',
    price: 72.0,
    size: '15ml',
    qty: 1,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfRgEj25AwwhL50pzUXi5VvU-PfXSDkk0N43L9UaocW3rkzvmFkNlO3_3m1yAUDEd6brghO0QT1xmyn5nty5WdQ8pjYl9cbAKdK7-pQ_k2t1k7Y8KQru600F04WWHO5s1H4KM9nDwbD-l57TkqCIJ0OqtKvUPJa3tcDrUzVCkiFJ_Yq7oqsE_4gFGhRmnBDeWj_T3W6HPmX-ZH9RLshrZpIfnRXPpuUMwB58Kd5RNzbU2iX3JGBEXcfvm4RP5KQvfsJh6waLA_1sA',
  },
];

// Card style: white in light, dark-slate in dark — text flips accordingly
const cardCls = 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm';

export const CartPage: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (id: number, delta: number) => {
    setItems(prev =>
      prev
        .map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter(item => item.qty > 0)
    );
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(item => item.id !== id));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

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
                <div key={item.id} className={`flex gap-5 p-5 hover:shadow-md transition-shadow ${cardCls}`}>
                  {/* Product image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-300">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded mb-1 inline-block">
                          {item.size}
                        </span>
                        {/* Dark card → white text; light card → dark text */}
                        <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">{item.subtitle}</p>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white">${(item.price * item.qty).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty control */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-500 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors font-bold"
                        >−</button>
                        <span className="px-4 py-1.5 font-semibold text-sm text-slate-900 dark:text-white border-x border-slate-200 dark:border-slate-500">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors font-bold"
                        >+</button>
                      </div>

                      <div className="flex items-center gap-4">
                        <button className="text-xs text-slate-400 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">favorite_border</span>
                          Save
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
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
                    <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-500">
                      <span>Promo (10%)</span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-500">Free</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Tax (8%)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-500 flex justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="font-bold text-primary text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-center block hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-sm"
                >
                  Proceed to Checkout
                </Link>
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
