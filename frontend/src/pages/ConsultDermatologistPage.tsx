import React from "react";
import { Link } from "react-router-dom";

export const ConsultDermatologistPage: React.FC = () => {
  return (
    <div className="w-full">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Header */}
          <main className="mx-auto max-w-[1200px] w-full px-6 py-8">
            {/* Hero Section */}
            <div className="mb-10">
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight mb-2">
                Book Your Specialist
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Personalized dermatological care from world-class experts.
              </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-4 mb-10 overflow-x-auto pb-2">
              <button className="px-6 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-sm">
                All Specialists
              </button>
              <button className="px-6 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:border-primary transition-all">
                Acne & Scars
              </button>
              <button className="px-6 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:border-primary transition-all">
                Anti-Aging
              </button>
              <button className="px-6 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:border-primary transition-all">
                Medical Surgery
              </button>
              <button className="px-6 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:border-primary transition-all">
                Cosmetic
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Doctor Listings */}
              <div className="lg:col-span-8 space-y-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    verified_user
                  </span>
                  Available Dermatologists
                </h3>
                {/* Doctor Card 1 */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-black dark:border-slate-800 flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0 bg-black">
                    <img
                      alt="Dr. Elena Rodriguez"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkAuFiPzXydqepmx4JXkjS6tW2aBYDL-TXchYx4UeUjxEyZYd9enl87Wh4v97UDEKYEo4XfD704xXUHct9zXfoGLswC-XuXe8-W9L9bYzrKYQ09sKWgiynKEwI_6Z_3d8PH5wSL5LIHowq3R_JG9OPBvU5zKuUGg7oiayJKci-fPvhRsKtBPw6UtkgNkvR65sijfTaYSrCLWSmao4v4iKmzdGLEsKf7EWsiLIUsNbVSOyos0qXBkvFbIQrKtywOVKYNQKuBXk0p6k"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-primary text-xs font-bold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                          Highly Rated
                        </span>
                        <h4 className="text-xl font-bold mt-2">
                          Dr. Elena Rodriguez
                        </h4>
                        <p className="text-slate-500 text-sm font-medium">
                          Cosmetic & Surgical Dermatology • 14 Years Exp.
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                        <span className="material-symbols-outlined text-amber-500 text-sm fill-current">
                          star
                        </span>
                        <span className="font-bold text-sm">4.9</span>
                        <span className="text-slate-400 text-xs">(1.2k)</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 line-clamp-2">
                      Specializing in advanced laser treatments and preventative
                      skin health. Known for a patient-first approach to complex
                      dermatological issues.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:opacity-90">
                        Book Now
                      </button>
                      <button className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-black dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
                {/* Doctor Card 2 */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-black dark:border-slate-800 flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0 bg-black">
                    <img
                      alt="Dr. Marcus Thorne"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwfZ4M1TOzbpireUe_8xUBHiJ5dsIn4AzklOHQZgzbVYnanAttoV26qJfjl7mizNzas_ABAQjAw5Mp08EFy584VOmnCGR2J5uB4ZlPaeCzOzCTXu13KxAilAZJSyJeCvz_4p0AQf_f-C_JmdvsdMpBbpBVlxA-2yN2vPO5N2Aw6sMi-8c8tl3OheHmR1lLgyjeKlbG39Ln04anC_eWmJ36z90r9tF-j6o3XoJt_txGVcda1jdvSInWmn_F4EpLEu_9QBgkacjGXqw"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider bg-black dark:bg-slate-800 px-2 py-1 rounded">
                          Medical Expert
                        </span>
                        <h4 className="text-xl font-bold mt-2">
                          Dr. Marcus Thorne
                        </h4>
                        <p className="text-slate-500 text-sm font-medium">
                          Clinical Acne Specialist • 9 Years Exp.
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                        <span className="material-symbols-outlined text-amber-500 text-sm fill-current">
                          star
                        </span>
                        <span className="font-bold text-sm">4.8</span>
                        <span className="text-slate-400 text-xs">(840)</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 line-clamp-2">
                      Expert in hormonal acne management and scar revision
                      therapy. Utilizes the latest non-invasive technologies for
                      skin recovery.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:opacity-90">
                        Book Now
                      </button>
                      <button className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-black dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
                {/* Consultation Overview */}
                <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">info</span>
                    What to expect
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined">
                          content_paste_search
                        </span>
                      </div>
                      <p className="font-bold text-sm">Skin Analysis</p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Detailed visual scan of skin health and texture using
                        high-res imaging.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined">forum</span>
                      </div>
                      <p className="font-bold text-sm">Q&A Session</p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Direct time with your specialist to discuss history and
                        concerns.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined">
                          prescriptions
                        </span>
                      </div>
                      <p className="font-bold text-sm">Routine Plan</p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        A custom medical-grade skincare regimen tailored for
                        you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Booking & Products */}
              <div className="lg:col-span-4 space-y-8">
                {/* Calendar Widget */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-black dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-lg">Select Date</h4>
                    <div className="flex gap-2">
                      <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">
                          chevron_left
                        </span>
                      </button>
                      <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* Simple Calendar Mock */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Mon
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Tue
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Wed
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Thu
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Fri
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Sat
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Sun
                    </span>
                    <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-300 text-sm">
                      12
                    </button>
                    <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-300 text-sm">
                      13
                    </button>
                    <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                      14
                    </button>
                    <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 text-sm hover:bg-black dark:hover:bg-slate-800">
                      15
                    </button>
                    <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 text-sm hover:bg-black dark:hover:bg-slate-800">
                      16
                    </button>
                    <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 text-sm hover:bg-black dark:hover:bg-slate-800">
                      17
                    </button>
                    <button className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 text-sm hover:bg-black dark:hover:bg-slate-800">
                      18
                    </button>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Available Slots
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all">
                        09:00 AM
                      </button>
                      <button className="py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20">
                        10:30 AM
                      </button>
                      <button className="py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all">
                        01:45 PM
                      </button>
                      <button className="py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all">
                        03:30 PM
                      </button>
                    </div>
                  </div>
                  <button className="w-full mt-8 py-4 bg-primary text-white rounded-xl font-black text-lg shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                    Confirm Booking
                  </button>
                </div>

                {/* Recommended Products */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="font-bold text-lg">Top Recommended</h4>
                    <Link
                      className="text-primary text-sm font-bold hover:underline"
                      to="/products"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {/* Product 1 */}
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-black dark:border-slate-800 group cursor-pointer hover:border-primary/50 transition-all">
                      <div className="w-16 h-16 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                        <img
                          alt="Cleansing Gel"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXTRwTMT9y0K4C1FCUHgvDFbw3qz9ANmb5AP_qyD5JoZrUBpKGvhtDGU55fNiwJUyQOxUOCAgsYGYQnHjqY-igqs9IvLBUkSwydZkMce6mzlaDJWgUKiTYGw5-KqmVbf1jXfEyQoV1e0qFyoiO2bI_4C_fYqysE6rApECtQSVnb-BAc_n5Q8ziDRLld6CGtcx25PwiKfSQ1GOfmUhS-aixRNTtlvrFYm0GowdAx9bAHyrCgOF5azOlITvhKs7BE5ky7gLeMsZcb0U"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm group-hover:text-primary transition-colors">
                          Hydrating Cleanser
                        </p>
                        <p className="text-slate-400 text-xs font-medium">
                          Ceramides + Hyaluronic
                        </p>
                        <p className="text-primary font-bold mt-1 text-sm">
                          $24.00
                        </p>
                      </div>
                      <button className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined text-base">
                          add
                        </span>
                      </button>
                    </div>
                    {/* Product 2 */}
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-black dark:border-slate-800 group cursor-pointer hover:border-primary/50 transition-all">
                      <div className="w-16 h-16 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                        <img
                          alt="SPF 50"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAajxqa4kRxwyWlS4XASZAj3YGjtVR0C4rERZ8TPsuMAkEYziUZ7zi-GIxUY4udrTp-_JSajzh8vMNc7bWdRQUBrrJiBnhCzxF0GxiPLwZaen79ghyx_mLpHW8-X21oYbCy_DHwOFHDtMIOVCYoutYL6W-p1L2rX3YwdEre9AmqN3bNXgo7nbym1tCVhOo1Zrv3jAn2GNOLPzasgtmr1rbn1LZoEyjoVzIQ-2jTlm_o3mAsoCM4LJoHQ5wcJVTlbmlv0VNWhREKTPg"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm group-hover:text-primary transition-colors">
                          Mineral Sunscreen SPF 50
                        </p>
                        <p className="text-slate-400 text-xs font-medium">
                          Zinc Oxide, Non-Greasy
                        </p>
                        <p className="text-primary font-bold mt-1 text-sm">
                          $32.00
                        </p>
                      </div>
                      <button className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined text-base">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
