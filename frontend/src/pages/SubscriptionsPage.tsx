import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PLAN_META: Record<string, { name: string; priceMonthly: number; products: number; color: string }> = {
  individual: { name: 'Individual Plan', priceMonthly: 1499, products: 3, color: 'text-sky-500' },
  couple:     { name: 'Couple Plan',     priceMonthly: 2299, products: 5, color: 'text-primary' },
  family:     { name: 'Family Plan',     priceMonthly: 3699, products: 8, color: 'text-emerald-500' },
};

export const SubscriptionsPage: React.FC = () => {
  const { apiRequest } = useAuth();
  const navigate = useNavigate();
  const [subData, setSubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/api/subscription/my-plan');
      setSubData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    setCancelling(true);
    try {
      await apiRequest('/api/subscription/cancel', { method: 'POST', body: JSON.stringify({}) });
      await fetchPlan();
      alert('Your subscription has been cancelled.');
    } catch (err: any) {
      alert(err.message || 'Failed to cancel.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  const sub = subData?.subscription;
  const isActive = sub?.isActive && sub?.plan && sub.plan !== 'none';
  const planMeta = isActive ? PLAN_META[sub.plan] : null;
  const daysLeft = isActive && sub.endDate
    ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
  const progressPct = isActive ? Math.max(5, Math.round(((30 - daysLeft) / 30) * 100)) : 0;

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto w-full px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link className="hover:text-primary transition-colors" to="/">Home</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary font-medium">My Subscription</span>
          </nav>
          <h1 className="text-3xl font-serif font-bold">My Subscription</h1>
          <p className="text-slate-500 mt-1">Manage your Dermora skincare plan.</p>
        </div>

        {/* No Active Plan */}
        {!isActive ? (
          <div className="flex flex-col items-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-primary/10 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">subscriptions</span>
            <h2 className="text-xl font-bold dark:text-white mb-2">No Active Subscription</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              Subscribe to a Dermora plan and get personalised products delivered every month.
            </p>
            <Link
              to="/bundles"
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
            >
              View Plans
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* Active Plan Hero */}
            <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-primary/10 shadow-sm p-6 md:p-8">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 size-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-3">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Active Subscription
                    </span>
                    <h2 className="text-3xl font-black tracking-tight dark:text-white">{planMeta?.name}</h2>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">event</span>
                        Renews: {new Date(sub.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">payments</span>
                        ₹{planMeta?.priceMonthly.toLocaleString('en-IN')}/month
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">inventory_2</span>
                        {planMeta?.products} products/month
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/bundles"
                      className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
                    >
                      Upgrade Plan
                    </Link>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Subscription period</span>
                    <span>{daysLeft} days remaining</span>
                  </div>
                  <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Started: {new Date(sub.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </section>

            {/* Dermora Points */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/10 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white">Dermora Loyalty Points</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">Gold Tier</span>
              </div>
              <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-amber-400 to-primary rounded-full" style={{ width: '75%' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>750 / 1,000 points</span>
                <span>250 more to unlock ₹150 reward</span>
              </div>
            </section>

            {/* What's In Your Kit */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/10 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 dark:text-white">This Month's Kit</h3>
                <Link to="/products" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  Browse Shop
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Vitamin C Radiance Serum', type: 'SERUM', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5FHNybzgirN0PmqD3kvSmI8V3zGZhJxzUHnDHbfB1r3vumckRl3x8Vif0QCIODIMpjh4zdNeZfGe1ZFY3BgX-NikshKJZ-2RA1sWfRBOk0rUuobxSt-pkK-dY1BGUDJ9br0KtdcJR29lAYKDbMaiIqqwjT861c1pE0y86hfBSvWCZK9GIXOM8Eqkki_9nRwni2hil-duR395yDH5HSdSXMrksNovrCekwsimjOC7XLGubydtGaQzNNTB3SZkFEnSNSdBznCCYgyY' },
                  { name: 'Cloud Hydration Cream', type: 'MOISTURIZER', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbg8BhmZqX0t7_fb5Xjyi1-Wl5D1OkxK_EutUoFCxp1wEPrHT7Abcrn3yq8HAW0KAK3p-XNtmXNa76cMM1ZCfSNNs7Io5SbPZpX4uDzcSK0sq27M8GeP9W67MXkSuX5wD1WuykOcUWtf0P1bOCOEoDPF8hWyIY_Sw_kB5vL1ILnwxoTNzGeceyNXUScxQcYv8ha9KuZvNjM1G57g3itkzAbIbE4Ezxtuh6ESprNtAo_B3AqBEETvk-cFUd4BdBugvr1uR0pVWefZU' },
                ].map(p => (
                  <div key={p.name} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-primary/5 hover:shadow-md transition-shadow">
                    <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-white dark:bg-slate-700">
                      <img className="object-cover w-full h-full" src={p.img} alt={p.name} />
                    </div>
                    <p className="text-xs font-bold text-primary mb-1">{p.type}</p>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{p.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">Monthly delivery</p>
                  </div>
                ))}
                <div className="border-2 border-dashed border-primary/20 bg-primary/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/10 transition-all group">
                  <div className="size-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <p className="font-bold text-primary text-sm">Add Product</p>
                  <p className="text-xs text-primary/60 mt-1">Swap or add more items</p>
                </div>
              </div>
            </section>

            {/* Plan Actions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-primary/10 shadow-sm">
                <h3 className="font-bold text-lg mb-2 dark:text-white">Pause Subscription</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  Going away? Pause your deliveries for 1–3 months. You won't be charged during this time.
                </p>
                <button className="w-full py-2.5 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-all">
                  Pause My Plan
                </button>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-primary/10 shadow-sm">
                <h3 className="font-bold text-lg mb-2 dark:text-white">Cancel Subscription</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  Thinking of leaving? You'll lose your Gold Tier benefits and accumulated points.
                </p>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 transition-all"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Plan'}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubscriptionsPage;
