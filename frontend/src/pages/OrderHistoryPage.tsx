import React from "react";
import { Link } from "react-router-dom";

export const OrderHistoryPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-black min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Navigation */}
          <main className="flex flex-1 flex-col items-center py-10 px-6 md:px-20 lg:px-40">
            <div className="w-full max-w-[960px] flex flex-col gap-8">
              {/* Header Section */}
              <div className="flex flex-col gap-2">
                <h1 className="font-serif text-4xl font-bold text-slate-900 dark:text-black">
                  Order History
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Manage your past purchases and refine your skincare routine.
                </p>
              </div>

              {/* AI Routine Suggestion Section */}
              <section className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="bg-primary/10 p-4 rounded-full text-primary">
                  <span className="material-symbols-outlined text-4xl">
                    auto_awesome
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-black">
                    Personalized AI Adjustment
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Based on your recent feedback for the Hydrating Serum, we
                    suggest adjusting your PM routine with{" "}
                    <span className="font-semibold text-primary">
                      Lavender Night Recovery Elixir
                    </span>{" "}
                    for better absorption.
                  </p>
                </div>
                <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:brightness-110 transition-all shadow-sm">
                  Update Routine
                </button>
              </section>

              {/* Filter Tabs */}
              <div className="flex border-b border-primary/10 gap-8 overflow-x-auto pb-px">
                <button className="border-b-2 border-primary text-primary pb-3 px-1 text-sm font-bold whitespace-nowrap">
                  All Orders
                </button>
                <button className="border-b-2 border-transparent text-slate-500 hover:text-primary pb-3 px-1 text-sm font-medium whitespace-nowrap transition-colors">
                  In Transit
                </button>
                <button className="border-b-2 border-transparent text-slate-500 hover:text-primary pb-3 px-1 text-sm font-medium whitespace-nowrap transition-colors">
                  Delivered
                </button>
                <button className="border-b-2 border-transparent text-slate-500 hover:text-primary pb-3 px-1 text-sm font-medium whitespace-nowrap transition-colors">
                  Cancelled
                </button>
              </div>

              {/* Order List */}
              <div className="flex flex-col gap-6">
                {/* Order Card 1 (Delivered) */}
                <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Order #DM-98231
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          Placed on Oct 14, 2023
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-soft-olive text-accent-green rounded-full">
                        <span className="material-symbols-outlined text-sm">
                          check_circle
                        </span>
                        <span className="text-xs font-bold">Delivered</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div
                        className="size-20 bg-primary/5 rounded-lg flex-shrink-0 bg-cover bg-center"
                        title="Bottles of luxury organic facial serums"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJX1MvkhOFBbFkSik8VqNaAYLE-UNz_hq_QPKN8s_PxBKz3L9RtcDSEyW8fq0oR-XPKTkV81zJXpYHVEi7Lui6VByEpm2yRdyHeAEHaZKANXzrigr6g9NR19fqaa_QzSVtyho1sGxVolyNoIcQW3Qd6EncsoxmA0YUiAghhieqsnt_OR5DFSpRdqui2uFnF786RI7_ShjSH1tKgUBo-h6-KiVAClRcQJcBXP5BKmkmnTrOKWSpEVaxzGovI8vPG6UQn2NJsL9dhAM')",
                        }}
                      ></div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="font-bold text-slate-900 dark:text-black">
                          The Glow Kit Bundle
                        </h4>
                        <p className="text-sm text-slate-500">
                          Includes: Vitamin C Serum, Hyaluronic Acid, Face Oil
                        </p>
                        <p className="text-primary font-bold mt-1">$124.00</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-primary/5 border-t border-primary/10 px-6 py-4 flex flex-wrap gap-3">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all">
                      <span className="material-symbols-outlined text-lg">
                        refresh
                      </span>
                      Reorder
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-primary text-primary px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary/10 transition-all">
                      <span className="material-symbols-outlined text-lg">
                        rate_review
                      </span>
                      Give Feedback
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 text-slate-500 text-sm font-medium px-5 py-2 hover:text-primary transition-all ml-auto">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Order Card 2 (In Transit) */}
                <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Order #DM-99042
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          Placed on Nov 02, 2023
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                        <span className="material-symbols-outlined text-sm">
                          local_shipping
                        </span>
                        <span className="text-xs font-bold">In Transit</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div
                        className="size-20 bg-primary/5 rounded-lg flex-shrink-0 bg-cover bg-center"
                        title="Moisturizing cream jar on a minimalist background"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA076zXu9dG5eev-Xej-TQR62xi8knfTSYoJIwNQUone7bHC2-d1qnU4Wc1JfzUMd1UI1CyLm9WSCG_Dj6Bs-MlmSjFX3n8gG8ZdP9X_zMh61S9-C8E6S0QMwIHHG_OBd8vO3pODFshfxTMWD9EZnmmP4VlZMSTqdhA4LI7bcomW7h_7wIQcsKXRbY3RWSfnDWCvq3acm77aRmfsPkMYEJ_3PsnfnxSkREID6Q8ZE_KN8gs4Vn5HYM_Rc16RHmLZxLC-bSvloTRYdM')",
                        }}
                      ></div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="font-bold text-slate-900 dark:text-black">
                          Deep Hydration Overnight Cream
                        </h4>
                        <p className="text-sm text-slate-500">
                          Quantity: 2 x 50ml
                        </p>
                        <p className="text-primary font-bold mt-1">$78.00</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-primary/5 border-t border-primary/10 px-6 py-4 flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <div className="w-full bg-primary/20 rounded-full h-1.5 mb-2">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                      <p className="text-xs font-medium text-slate-500">
                        Estimated Delivery: Nov 08, 2023
                      </p>
                    </div>
                    <button className="flex-1 md:flex-none border border-primary text-primary px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary/10 transition-all">
                      Track Order
                    </button>
                  </div>
                </div>

                {/* Order Card 3 (Delivered) */}
                <div className="bg-white dark:bg-background-dark/50 border border-primary/10 rounded-xl overflow-hidden shadow-sm opacity-90">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Order #DM-94109
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          Placed on Sep 12, 2023
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-soft-olive text-accent-green rounded-full">
                        <span className="material-symbols-outlined text-sm">
                          check_circle
                        </span>
                        <span className="text-xs font-bold">Delivered</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div
                        className="size-20 bg-primary/5 rounded-lg flex-shrink-0 bg-cover bg-center"
                        title="Skincare clay mask application brush and jar"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-r3yE0lLCftdVNSn6_8tckPFaV1N0x3pXYdgv5hwjEDi9sWE9nhthWoV9WdEwfXcmUXPZsMpsrXAKBee5W6xM_Bh8414OSKFjvCNi1AOqXm4veSzh1rn7cJkOaACG9T6SOdrkxwCb7iT__BErAhOBkgqPDO9AilyWNnuM79dSOo7S63cFlbu00iZzzdKIqLZPnB9iMqqW8vxBOl6P9USgOoa8cHTwxBzVOPrnO1AhC9PsC9yK3V1pT52O2CqCyD6MTpLarPyiQS4')",
                        }}
                      ></div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="font-bold text-slate-900 dark:text-black">
                          Pore Purifying Mask
                        </h4>
                        <p className="text-sm text-slate-500">
                          Size: 100g Standard
                        </p>
                        <p className="text-primary font-bold mt-1">$42.00</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-primary/5 border-t border-primary/10 px-6 py-4 flex flex-wrap gap-3">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all">
                      <span className="material-symbols-outlined text-lg">
                        refresh
                      </span>
                      Reorder
                    </button>
                    <div className="flex items-center gap-1 text-accent-green px-5 py-2">
                      <span className="material-symbols-outlined text-lg">
                        star
                      </span>
                      <span className="text-sm font-bold">Feedback Sent</span>
                    </div>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 text-slate-500 text-sm font-medium px-5 py-2 hover:text-primary transition-all ml-auto">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-4 pb-12">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-sm">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-primary/10 text-slate-600 font-medium text-sm transition-colors">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg hover:bg-primary/10 text-slate-600 font-medium text-sm transition-colors">
                  3
                </button>
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
