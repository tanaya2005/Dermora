import React from 'react';
import { Link } from 'react-router-dom';
import { DermoraLogo } from '../components/Logo';

export default function Checkout() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light antialiased">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-6 md:px-20 py-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4 text-primary">
          <DermoraLogo className="size-8" />
          <Link to="/" className="text-slate-900 text-xl font-bold leading-tight tracking-tight">Dermora</Link>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary">
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Checkout Flow */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Progress */}
            <nav className="flex items-center justify-start gap-4 mb-4">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                <span className="hidden sm:inline">Shipping</span>
              </div>
              <div className="h-px w-8 bg-primary/20" />
              <div className="flex items-center gap-2 text-slate-400">
                <span className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-sm">2</span>
                <span className="hidden sm:inline">Delivery</span>
              </div>
              <div className="h-px w-8 bg-primary/20" />
              <div className="flex items-center gap-2 text-slate-400">
                <span className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-sm">3</span>
                <span className="hidden sm:inline">Payment</span>
              </div>
            </nav>

            {/* Shipping */}
            <section className="bg-white p-8 rounded-xl border border-primary/5 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">Shipping Address</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-600">First Name</label>
                  <input className="rounded-lg border border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 px-3 py-2" placeholder="John" type="text" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-600">Last Name</label>
                  <input className="rounded-lg border border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 px-3 py-2" placeholder="Doe" type="text" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-600">Address</label>
                  <input className="rounded-lg border border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 px-3 py-2" placeholder="123 Skincare Lane" type="text" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-600">City</label>
                  <input className="rounded-lg border border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 px-3 py-2" placeholder="New York" type="text" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-600">ZIP Code</label>
                  <input className="rounded-lg border border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 px-3 py-2" placeholder="10001" type="text" />
                </div>
              </form>
            </section>

            {/* Payment */}
            <section className="bg-white p-8 rounded-xl border border-primary/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Payment Method</h3>
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-slate-400">lock</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Secure Checkout</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button className="w-full bg-black text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-slate-800">
                  <span className="material-symbols-outlined">ios</span>
                  <span className="font-bold text-lg">Pay</span>
                </button>
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-primary/10" />
                  <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or pay with card</span>
                  <div className="flex-grow border-t border-primary/10" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-600">Card Number</label>
                    <div className="relative">
                      <input className="w-full rounded-lg border border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 pl-4 pr-12 py-2" placeholder="0000 0000 0000 0000" type="text" />
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400">credit_card</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600">Expiry Date</label>
                      <input className="rounded-lg border border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 px-3 py-2" placeholder="MM/YY" type="text" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600">CVC</label>
                      <input className="rounded-lg border border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 px-3 py-2" placeholder="123" type="text" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <button className="bg-primary text-white font-bold py-4 rounded-xl text-lg hover:bg-primary/90 shadow-lg shadow-primary/20">
              Complete Order (₹117.00)
            </button>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-primary/5 shadow-sm overflow-hidden p-6">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="flex flex-col gap-4 mb-6">
                {[
                  { name: 'Revitalizing Face Serum', size: '30ml / Glass Bottle', qty: 1, price: '₹45.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEbYM3FO0ANZDe_lmXCZwPMAeX6UUMxiEEengCSC8voRU2w3NSvgtNV9V9p68_K45wQA3zwuYQn9-_AwPdJ5-2Hmv1rvAvGAFMjgl39RCl2OPey3-kTSnTPHSzNIRYiraFUS5m6n7fIpIl44QYctqxFTcLQny5VyweoD0QcglXWe6Euwh4sQ5hc1uLajWerWQGDQJJc8K3nMDHHFzeCJrJfv-I-refYcr5orzfxlu5YNq1RMbmos-LLjB_vfXDDb-GzvMIGaq017I' },
                  { name: 'Hydrating Cleanser', size: '200ml / Pump Bottle', qty: 2, price: '₹72.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxPg_hAsXgXdwmF27bNoINRTTXiQKneI9M3t7-0Au4G9YDhO95GGed-fZkFHcHjzIpB6XmmkxoWIUd-8yxhIIsoz6PUJFKrF1bL1--s6AeCZvB7B8m_CFl8PXBferXM6uWrnik12hHSKTRJ1co6KsqtMldRys4It3v45qbMPSbMqgAnoKoulkvSwoetkBoFMlXj5Onwf7bzYlSvdjneKsinQdcseb5yzF13cb7XdvNAtMa9q8zmQsLqbNOCDJ_UfDbSWUYsWQgtJ0' },
                ].map(item => (
                  <div key={item.name} className="flex gap-4">
                    <div className="size-20 rounded-lg bg-center bg-cover flex-shrink-0" style={{ backgroundImage: `url('₹{item.img}')` }} />
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.size}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-primary/5 rounded-full px-2 py-1">
                          <button className="material-symbols-outlined text-xs text-primary font-bold">remove</button>
                          <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                          <button className="material-symbols-outlined text-xs text-primary font-bold">add</button>
                        </div>
                        <p className="font-bold text-primary">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subscription Toggle */}
              <div className="bg-primary/5 p-4 rounded-lg mb-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-primary">Save 15% with Subscription</span>
                  <span className="text-xs text-primary/80">Monthly delivery</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Promo */}
              <div className="flex gap-2 mb-6">
                <input className="flex-1 rounded-lg border border-primary/20 bg-background-light/50 text-sm px-3 py-2" placeholder="Promo code" type="text" />
                <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg">Apply</button>
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-3 border-t border-primary/10 pt-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span><span>₹117.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span><span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2 text-slate-900 border-t border-primary/10">
                  <span>Total</span><span>₹117.00</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-center">
              <div className="flex items-center justify-center gap-4 text-slate-400 grayscale opacity-60">
                <span className="material-symbols-outlined text-4xl">payments</span>
                <span className="material-symbols-outlined text-4xl">branding_watermark</span>
                <span className="material-symbols-outlined text-4xl">account_balance</span>
              </div>
              <p className="text-xs text-slate-400 px-6">By placing your order, you agree to Dermora's terms of use and privacy policy.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
