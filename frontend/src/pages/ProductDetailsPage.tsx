import React from "react";

import { Footer } from "../components/Footer";

export const ProductDetailsPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-black antialiased min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-primary/5">
              <img
                alt="Advanced Hydration Serum Bottle"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb6LRaRQGnQLXWjPQolE4Bec19oftVyvfsarJ6FGRP-2rjjDFMiDdm0CaaKoVuR8I_ZpDUz8neNN2OTVeMIspmA2pOIUt2DTQK1791bEou7rGJK6Fky2GlzWYzPLl4W-_qAEBkH8CBmE3YDzjooW533XoOJSX7Tl3Jjb_lil7IUht22UTiDJYaVIAwqvEUhvo_Mkg6GM_FinGrnIvCO7O108eZ6sAurWRmUniRkltMIm9LqoJ3JvqM-K8hyxslulRVI8TD2_m9ajI"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary bg-primary/5 cursor-pointer">
                <img
                  alt="Thumbnail 1"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADpdoddIqx32rC3B4LvQhkfrqb68c1oAZpvByTRxzYQ_ierM14e0TEjq31yht6OmdBbOW0KaTDv-QNmw0DZaWgRFCs60mpKNs3PsJyR4itrRb6wexJx6Ab2uCWk3rpxpQxwD5lAiUUvxKVnUnJOmbnMDQ7DU530vVBvG6z9SyKJm0YK97IlPu2S9fnObKI72amCcOTSKLAOoCjGs5IcOevCJ_z5Rq2_CfPdaQvfSuEmzIOhOzuDCDo09tJOMHqRb9HGhf0PIZaTe0"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/30 transition-colors bg-primary/5 cursor-pointer">
                <img
                  alt="Thumbnail 2"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQTxOfhjY2QCm0eaMBHRvQwMywZttBfD14hZHgv1PPZRxtSVUtxEADi2YZXCg6vMrOdXVdcMnc0AOGnSisXDTW31mMOfHnSJHEROXwZOSyWIvNcT-sE2oGdxwACKP_ciij9hVYvAAMA1Z8k50ByZU4tFKzU5_3pLsj_iRBCXGW2XK-zWcbc8flumn86MT_mOqLJWeV5FPJCgEF2tp8_Woaee-xYxNrVLpeGqVguPCHXgMIOsJHNJmoRXukEit6MNt1Nrxa2mXdjYE"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/30 transition-colors bg-primary/5 cursor-pointer">
                <img
                  alt="Thumbnail 3"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxR5A2QlPIyIeThTVhDy5yjKXJ3vQQn48rh6XqkSDihOW-AXcMW2-IIRTnLqwviKFwDPlBDQVsWVC1hDP37kKlfzBR_Ww-mmd0-p6kLc8yPHPZgBbB9ToG6QiZxGQpjfGgSyXOet4FFvcJyDtbXP97K2RW2F1GKAsKxkT0DUw7TDzmJIQ0QXd5fOoCMFvzxrLJZvjwuCP3EAz0ULJtk_S-q-Hspn2wTN7adl5l8-KtKV57ZqQSipm-u-Zd8Sf8xtTNdWTjAP3Oseo"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/30 transition-colors bg-primary/5 cursor-pointer">
                <img
                  alt="Thumbnail 4"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrXt3tTKYjiaHcG6kOCAGqZtRzCObTWtS9h6Ignf0Qc2buc0KgBdwuEzdDDnv4BFCAPyZLmff5B76n0jR2FMXVuIgyGr79diy4k-0_0vtjdQDu2RaTZM7I_UqaIl1wibWKi25tm2SyYVfxB0BfCMh-gA1jqfeLbH3R4OnG6Mr9yuqtpOc3pFjz0-Zv9Oy1gcYLkfKjPsbq1Bi3BvpOHl0PMuQNhE7zstJUukCGtyKxKkX1TlRLtT2gTye_P0llzfAf7DMPFjs89bI"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex text-primary">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                124 Reviews
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-black mb-2">
              Advanced Hydration Serum
            </h2>
            <p className="text-2xl text-primary font-semibold mb-6">$48.00</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-lg">
              A high-performance serum designed to deeply hydrate and revitalize
              skin using clinical-grade hyaluronic acid and potent botanical
              extracts. Formulated for instant absorption and 24-hour moisture
              retention.
            </p>

            {/* Subscription Selector */}
            <div className="space-y-3 mb-8">
              <label className="relative flex cursor-pointer items-center justify-between rounded-lg border border-primary/20 bg-white dark:bg-slate-800/50 p-4 transition hover:border-primary">
                <div className="flex items-center gap-3">
                  <input
                    defaultChecked
                    className="h-4 w-4 border-primary text-primary focus:ring-primary"
                    name="purchase_option"
                    type="radio"
                  />
                  <div>
                    <span className="block text-sm font-bold">
                      One-time purchase
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold">$48.00</span>
              </label>
              <label className="relative flex cursor-pointer items-center justify-between rounded-lg border border-primary bg-primary/5 p-4 transition">
                <div className="flex items-center gap-3">
                  <input
                    className="h-4 w-4 border-primary text-primary focus:ring-primary"
                    name="purchase_option"
                    type="radio"
                  />
                  <div>
                    <span className="block text-sm font-bold">
                      Subscribe & Save (15% off)
                    </span>
                    <span className="block text-xs text-slate-500">
                      Deliver every 30 days. Cancel anytime.
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">$40.80</span>
              </label>
            </div>

            {/* Add to Routine Button */}
            <button className="w-full bg-[#191716] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-12">
              <span className="material-symbols-outlined">add_circle</span>
              Add to Cart
            </button>

            {/* Tabs Section */}
            <div className="border-t border-primary/10">
              <div className="flex gap-8 border-b border-primary/10">
                <button className="border-b-2 border-primary px-1 py-4 text-sm font-bold text-slate-900 dark:text-black">
                  Ingredients
                </button>
                <button className="px-1 py-4 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                  Benefits
                </button>
                <button className="px-1 py-4 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                  How to Use
                </button>
              </div>
              <div className="py-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">
                        water_drop
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Hyaluronic Acid</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Multi-molecular weights for deep layer hydration.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">eco</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Blue Algae</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Natural antioxidant to protect skin barrier.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">science</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Peptides</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Clinically proven to boost collagen synthesis.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">compost</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Niacinamide</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Vitamin B3 to refine pores and texture.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Benefits Section */}
        <section className="mt-24 bg-primary/5 rounded-xl p-8 lg:p-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-bold mb-4">Clinical Results</h3>
            <p className="text-slate-600 dark:text-slate-400">
              In a 4-week clinical study of 50 participants, users reported
              significant improvements in skin health.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <span className="text-5xl font-black text-primary">98%</span>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500">
                Instantly Hydrated
              </p>
            </div>
            <div>
              <span className="text-5xl font-black text-primary">92%</span>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500">
                Reduced Fine Lines
              </p>
            </div>
            <div>
              <span className="text-5xl font-black text-primary">87%</span>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500">
                Brighter Complexion
              </p>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-24 mb-16">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-bold">Customer Reviews</h3>
            <button className="text-sm font-bold text-primary hover:underline underline-offset-4 transition-all">
              Write a review
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white dark:bg-slate-800/40 p-6 rounded-xl border border-primary/10">
              <div className="flex text-primary mb-3">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
              </div>
              <p className="text-sm italic text-slate-600 dark:text-slate-300 mb-4">
                "The only serum that actually makes my skin feel plump all day.
                I've switched my entire routine to Dermora."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs">
                  SR
                </div>
                <span className="text-xs font-bold">
                  Sarah R.{" "}
                  <span className="text-slate-400 ml-1 font-normal">
                    Verified Buyer
                  </span>
                </span>
              </div>
            </div>
            {/* Review 2 */}
            <div className="bg-white dark:bg-slate-800/40 p-6 rounded-xl border border-primary/10">
              <div className="flex text-primary mb-3">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
              </div>
              <p className="text-sm italic text-slate-600 dark:text-slate-300 mb-4">
                "Lightweight but powerful. No sticky residue, which is perfect
                for layering under sunscreen."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs">
                  ML
                </div>
                <span className="text-xs font-bold">
                  Marcus L.{" "}
                  <span className="text-slate-400 ml-1 font-normal">
                    Verified Buyer
                  </span>
                </span>
              </div>
            </div>
            {/* Review 3 */}
            <div className="bg-white dark:bg-slate-800/40 p-6 rounded-xl border border-primary/10">
              <div className="flex text-primary mb-3">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
              </div>
              <p className="text-sm italic text-slate-600 dark:text-slate-300 mb-4">
                "The subscription is so convenient. I never run out and the
                discount makes it a no-brainer."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs">
                  ET
                </div>
                <span className="text-xs font-bold">
                  Elena T.{" "}
                  <span className="text-slate-400 ml-1 font-normal">
                    Verified Buyer
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
