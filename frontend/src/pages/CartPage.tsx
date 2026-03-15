import React from "react";
import { Link } from "react-router-dom";

import { Footer } from "../components/Footer";

export const CartPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-black">
      <main className="flex-grow max-w-[1200px] mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-black mb-8 border-b border-primary/10 pb-4">
          Your Shopping Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            {/* Cart Item */}
            <div className="flex gap-6 border-b border-primary/10 pb-6">
              <div className="w-24 h-24 bg-black rounded-lg overflow-hidden shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-FLSjE0X03fWdceJ9l2IYga_m-kuWOuYo2i7w28AH74lz19v0r8Ax7-K_2p-cSfes_iok8PbWfcPBjzuVb9BGmwVdA0zloKR3XxptO7yV-OlcXXySRYn9PtpuHnMpLIqoNXNPJmwZu_jCXySgIHQKtNg6l999boGXePM6IG9IEhKRbhsM8GT1xHRNkXc_kd1NgmjAF-p44gGXO4gTMF3nZQVKNPtnrIHw4eJGbW956fq0aKfGXR6M_zte23ljpT0X9uJ71sK_uYw"
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">
                      Vitamin C Radiance Serum
                    </h3>
                    <p className="text-slate-500 text-sm">30ml / 1 oz</p>
                  </div>
                  <p className="font-bold text-lg">$68.00</p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md">
                    <button className="px-3 py-1 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                      -
                    </button>
                    <span className="px-3 font-medium">1</span>
                    <button className="px-3 py-1 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                      +
                    </button>
                  </div>
                  <button className="text-sm font-bold text-primary hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Item 2 */}
            <div className="flex gap-6 border-b border-primary/10 pb-6">
              <div className="w-24 h-24 bg-black rounded-lg overflow-hidden shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMM25c9grU0UjeTWhKdBO8bnRcvleMo2SUriGkdff1bZmKCb5cns4dP3w4CNLzJU5gt51T0D4WpF4bLotVZxjmHkHNjTiN4V4cQU_Ef7d4VHxv79BbpXgM_27RRvGc28ksoyYy0eDQW5c_vWOwgxb2kWqN4ALagsiHVPqywup2WNB6zKW1CqP-J2VLE0Gx4riAkRtTbKpEItF_8wXjwoB6It79FBD9zZ-0SgTpZZgmAw7bCbY4hctpRGDr2z-ndmHEUz95DeaLFS0"
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">
                      Overnight Repair Cream
                    </h3>
                    <p className="text-slate-500 text-sm">50ml / 1.7 oz</p>
                  </div>
                  <p className="font-bold text-lg">$85.00</p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md">
                    <button className="px-3 py-1 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                      -
                    </button>
                    <span className="px-3 font-medium">1</span>
                    <button className="px-3 py-1 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                      +
                    </button>
                  </div>
                  <button className="text-sm font-bold text-primary hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-background-dark border border-primary/10 p-6 rounded-2xl shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 border-b border-primary/10 pb-4">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">$153.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax</span>
                <span className="font-semibold">$12.24</span>
              </div>
              <div className="pt-4 border-t border-primary/10 flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-primary">$165.24</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-center block hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
