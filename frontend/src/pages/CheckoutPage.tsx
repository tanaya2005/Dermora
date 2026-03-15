import React from "react";

export const CheckoutPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-black antialiased min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Top Navigation */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Checkout Flow (8 Columns) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                {/* Progress Steps */}
                <nav className="flex items-center justify-start gap-4 mb-4">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                      1
                    </span>
                    <span className="hidden sm:inline">Shipping</span>
                  </div>
                  <div className="h-px w-8 bg-primary/20"></div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm">
                      2
                    </span>
                    <span className="hidden sm:inline">Delivery</span>
                  </div>
                  <div className="h-px w-8 bg-primary/20"></div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm">
                      3
                    </span>
                    <span className="hidden sm:inline">Payment</span>
                  </div>
                </nav>

                {/* Shipping Section */}
                <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                  <h3 className="text-2xl font-bold mb-6">Shipping Address</h3>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        First Name
                      </label>
                      <input
                        className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border"
                        placeholder="John"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Last Name
                      </label>
                      <input
                        className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border"
                        placeholder="Doe"
                        type="text"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Address
                      </label>
                      <input
                        className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border"
                        placeholder="123 Skincare Lane"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        City
                      </label>
                      <input
                        className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border"
                        placeholder="New York"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        ZIP Code
                      </label>
                      <input
                        className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border"
                        placeholder="10001"
                        type="text"
                      />
                    </div>
                  </form>
                </section>

                {/* Payment Section */}
                <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Payment Method</h3>
                    <div className="flex gap-2">
                      <span className="material-symbols-outlined text-slate-400">
                        lock
                      </span>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Secure Checkout
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {/* Apple Pay Button */}
                    <button className="w-full bg-black text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-slate-800">
                      <span className="material-symbols-outlined">ios</span>
                      <span className="font-bold text-lg">Pay</span>
                    </button>
                    <div className="relative flex items-center py-4">
                      <div className="flex-grow border-t border-primary/10"></div>
                      <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        Or pay with card
                      </span>
                      <div className="flex-grow border-t border-primary/10"></div>
                    </div>

                    {/* Card Details */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 pl-4 pr-12 border"
                            placeholder="0000 0000 0000 0000"
                            type="text"
                          />
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400">
                            credit_card
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Expiry Date
                          </label>
                          <input
                            className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border"
                            placeholder="MM/YY"
                            type="text"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            CVC
                          </label>
                          <input
                            className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border"
                            placeholder="123"
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <button className="bg-primary text-white font-bold py-4 rounded-xl text-lg hover:bg-primary/90 shadow-lg shadow-primary/20">
                  Complete Order ($117.00)
                </button>
              </div>

              {/* Order Summary (4 Columns) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/5 shadow-sm overflow-hidden p-6">
                  <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                  {/* Cart Items */}
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex gap-4">
                      <div
                        className="size-20 rounded-lg bg-center bg-cover flex-shrink-0"
                        title="Dermora revitalizing face serum glass bottle"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEbYM3FO0ANZDe_lmXCZwPMAeX6UUMxiEEengCSC8voRU2w3NSvgtNV9V9p68_K45wQA3zwuYQn9-_AwPdJ5-2Hmv1rvAvGAFMjgl39RCl2OPey3-kTSnTPHSzNIRYiraFUS5m6n7fIpIl44QYctqxFTcLQny5VyweoD0QcglXWe6Euwh4sQ5hc1uLajWerWQGDQJJc8K3nMDHHFzeCJrJfv-I-refYcr5orzfxlu5YNq1RMbmos-LLjB_vfXDDb-GzvMIGaq017I')",
                        }}
                      ></div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-black">
                            Revitalizing Face Serum
                          </p>
                          <p className="text-xs text-slate-500">
                            30ml / Glass Bottle
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-primary/5 rounded-full px-2 py-1">
                            <button className="material-symbols-outlined text-xs text-primary font-bold">
                              remove
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              1
                            </span>
                            <button className="material-symbols-outlined text-xs text-primary font-bold">
                              add
                            </button>
                          </div>
                          <p className="font-bold text-primary">$45.00</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div
                        className="size-20 rounded-lg bg-center bg-cover flex-shrink-0"
                        title="Dermora hydrating cleanser pump bottle"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBxPg_hAsXgXdwmF27bNoINRTTXiQKneI9M3t7-0Au4G9YDhO95GGed-fZkFHcHjzIpB6XmmkxoWIUd-8yxhIIsoz6PUJFKrF1bL1--s6AeCZvB7B8m_CFl8PXBferXM6uWrnik12hHSKTRJ1co6KsqtMldRys4It3v45qbMPSbMqgAnoKoulkvSwoetkBoFMlXj5Onwf7bzYlSvdjneKsinQdcseb5yzF13cb7XdvNAtMa9q8zmQsLqbNOCDJ_UfDbSWUYsWQgtJ0')",
                        }}
                      ></div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-black">
                            Hydrating Cleanser
                          </p>
                          <p className="text-xs text-slate-500">
                            200ml / Pump Bottle
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-primary/5 rounded-full px-2 py-1">
                            <button className="material-symbols-outlined text-xs text-primary font-bold">
                              remove
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              2
                            </span>
                            <button className="material-symbols-outlined text-xs text-primary font-bold">
                              add
                            </button>
                          </div>
                          <p className="font-bold text-primary">$72.00</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Toggle */}
                  <div className="bg-primary/5 p-4 rounded-lg mb-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">
                        Save 15% with Subscription
                      </span>
                      <span className="text-xs text-primary/80">
                        Monthly delivery
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        className="sr-only peer"
                        type="checkbox"
                        value=""
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Promo Code */}
                  <div className="flex gap-2 mb-6">
                    <input
                      className="flex-1 rounded-lg border-primary/20 bg-background-light/50 dark:bg-slate-800 text-sm p-2 border"
                      placeholder="Promo code"
                      type="text"
                    />
                    <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg dark:bg-slate-700">
                      Apply
                    </button>
                  </div>

                  {/* Totals */}
                  <div className="flex flex-col gap-3 border-t border-primary/10 pt-6">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span>$117.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-xl font-black pt-2 text-slate-900 dark:text-black border-t border-primary/10">
                      <span>Total</span>
                      <span>$117.00</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 text-center">
                  <div className="flex items-center justify-center gap-4 text-slate-400 grayscale opacity-60">
                    <span className="material-symbols-outlined text-4xl">
                      payments
                    </span>
                    <span className="material-symbols-outlined text-4xl">
                      branding_watermark
                    </span>
                    <span className="material-symbols-outlined text-4xl">
                      account_balance
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 px-6">
                    By placing your order, you agree to Dermora's terms of use
                    and privacy policy.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
