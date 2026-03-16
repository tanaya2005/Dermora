import React from 'react';
import { Link } from 'react-router-dom';
import { DermoraLogo } from '../components/Logo';
const routineProducts = [
  { category: 'SERUM', name: 'Vitamin C Radiance Booster', size: '30ml / Monthly', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5FHNybzgirN0PmqD3kvSmI8V3zGZhJxzUHnDHbfB1r3vumckRl3x8Vif0QCIODIMpjh4zdNeZfGe1ZFY3BgX-NikshKJZ-2RA1sWfRBOk0rUuobxSt-pkK-dY1BGUDJ9br0KtdcJR29lAYKDbMaiIqqwjT861c1pE0y86hfBSvWCZK9GIXOM8Eqkki_9nRwni2hil-duR395yDH5HSdSXMrksNovrCekwsimjOC7XLGubydtGaQzNNTB3SZkFEnSNSdBznCCYgyY' },
  { category: 'MOISTURIZER', name: 'Cloud Hydration Cream', size: '50ml / Monthly', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbg8BhmZqX0t7_fb5Xjyi1-Wl5D1OkxK_EutUoFCxp1wEPrHT7Abcrn3yq8HAW0KAK3p-XNtmXNa76cMM1ZCfSNNs7Io5SbPZpX4uDzcSK0sq27M8GeP9W67MXkSuX5wD1WuykOcUWtf0P1bOCOEoDPF8hWyIY_Sw_kB5vL1ILnwxoTNzGeceyNXUScxQcYv8ha9KuZvNjM1G57g3itkzAbIbE4Ezxtuh6ESprNtAo_B3AqBEETvk-cFUd4BdBugvr1uR0pVWefZU' },
];

export default function Subscriptions() {
  return (
    <div className="bg-transparent overflow-x-hidden w-full">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 flex flex-col gap-2">
            <nav className="flex flex-col gap-1">
              <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-medium" href="#">
                <span className="material-symbols-outlined fill-icon">dashboard</span>
                <span>Dashboard</span>
              </a>
              {[['reorder','My Orders'],['card_giftcard','Rewards'],['settings','Account Settings']].map(([icon, label]) => (
                <a key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary transition-all" href="#">
                  <span className="material-symbols-outlined">{icon}</span>
                  <span>{label}</span>
                </a>
              ))}
            </nav>
            {/* Points */}
            <div className="mt-6 p-5 rounded-2xl bg-white shadow-sm border border-primary/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-slate-800">Dermora Points</p>
                <span className="text-xs font-bold text-primary">Gold Tier</span>
              </div>
              <div className="relative w-full h-3 bg-primary/10 rounded-full overflow-hidden mb-2">
                <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">750 / 1000 points. 250 more to unlock $15 reward.</p>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 flex flex-col gap-8">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-primary/5 p-6 md:p-8">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 bg-primary/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active Subscription
                    </span>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Pro Glow Plan</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="material-symbols-outlined text-sm">event</span>
                        <span className="text-sm font-medium">Next renewal: Oct 15, 2024</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="material-symbols-outlined text-sm">payments</span>
                        <span className="text-sm font-medium">$45.00/month</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:shadow-lg transition-all">View Billing</button>
                    <button className="px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-all">Upgrade Plan</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Routine */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Modify My Routine</h2>
                <Link className="text-primary text-sm font-bold flex items-center gap-1 hover:underline" to="/products">
                  <span>Browse Shop</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {routineProducts.map(p => (
                  <div key={p.name} className="bg-white p-4 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square w-full rounded-xl bg-slate-50 mb-3 overflow-hidden flex items-center justify-center">
                      <img className="object-cover w-full h-full" src={p.img} alt={p.name} />
                    </div>
                    <p className="text-xs font-bold text-primary mb-1">{p.category}</p>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{p.name}</h3>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600">{p.size}</p>
                      <button className="text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-2 border-dashed border-primary/20 bg-primary/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-primary/10 transition-all">
                  <div className="size-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <p className="font-bold text-primary text-sm">Add Product</p>
                  <p className="text-xs text-primary/60 mt-1 px-4">Swap or add more items to your box</p>
                </div>
              </div>
            </section>

            {/* Plan Actions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-primary/5 shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-slate-900">Pause Subscription</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">Going away? Pause your deliveries for 1-3 months. You won't be charged during this time.</p>
                <button className="w-full py-2.5 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-all">Pause My Plan</button>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-primary/5 shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-slate-900">Cancel Subscription</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">Thinking of leaving? You'll lose your Gold Tier benefits and accumulated points.</p>
                <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-400 font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">Cancel Plan</button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
