import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

declare global {
  interface Window { Razorpay: any; }
}

const PLANS = [
  {
    id: 'individual',
    name: 'Individual Plan',
    tagline: 'Personalized care, just for you',
    priceMonthly: 1499,
    originalPrice: 1999,
    discount: '25% OFF',
    products: 3,
    popular: false,
    color: 'border-slate-200 dark:border-slate-700',
    badge: null,
    features: [
      '3 personalised products/month',
      'AI skin-matched selections',
      'Free standard delivery',
      'Cancel anytime',
      '10% off extra purchases',
    ],
    includes: ['Cleanser', 'Moisturizer', 'Serum'],
  },
  {
    id: 'couple',
    name: 'Couple Plan',
    tagline: 'Glow together, save together',
    priceMonthly: 2299,
    originalPrice: 3499,
    discount: '34% OFF',
    products: 5,
    popular: true,
    color: 'border-primary',
    badge: '⭐ Most Popular',
    features: [
      '5 products for two skin types',
      'Dual skin profile matching',
      'Free express delivery',
      'Cancel anytime',
      '15% off extra purchases',
      'Monthly skincare consultation',
    ],
    includes: ['Cleanser ×2', 'Moisturizer ×2', 'Serum', 'Sunscreen'],
  },
  {
    id: 'family',
    name: 'Family Plan',
    tagline: 'The whole family, fully covered',
    priceMonthly: 3699,
    originalPrice: 5999,
    discount: '38% OFF',
    products: 8,
    popular: false,
    color: 'border-slate-200 dark:border-slate-700',
    badge: '👨‍👩‍👧‍👦 Best Value',
    features: [
      '8 products for the full family',
      'Up to 4 skin profiles',
      'Free priority delivery',
      'Cancel anytime',
      '20% off extra purchases',
      'Monthly skincare consultation',
      'Dermora loyalty points x2',
    ],
    includes: ['Cleanser ×2', 'Moisturizer ×2', 'Serum ×2', 'Sunscreen ×2'],
  },
];

export const FamilyComboPage: React.FC = () => {
  const { user, apiRequest } = useAuth();
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState<any>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      apiRequest('/api/subscription/my-plan')
        .then(data => setActivePlan(data.subscription))
        .catch(() => {});
    }
  }, [user]);

  const loadRazorpay = () => new Promise<boolean>(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleSubscribe = async (planId: string) => {
    if (!user) { navigate('/login'); return; }
    if (activePlan?.isActive && activePlan?.plan === planId) {
      alert('You are already subscribed to this plan!');
      return;
    }

    setSubscribing(planId);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { alert('Payment SDK failed to load. Please try again.'); return; }

      const orderData = await apiRequest('/api/subscription/create-order', {
        method: 'POST',
        body: JSON.stringify({ plan: planId }),
      });

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Dermora',
        description: `${orderData.planDetails.name} — Monthly Subscription`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            await apiRequest('/api/subscription/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planId,
              }),
            });
            alert(`🎉 You're now subscribed to the ${orderData.planDetails.name}!`);
            navigate('/subscriptions');
          } catch (err) {
            alert('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#D4567A' },
        modal: { ondismiss: () => setSubscribing(null) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Failed to initiate payment');
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto w-full px-6 py-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">
            Bundles & Subscriptions
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Family & Couple Plans
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Save up to 38% when you bundle Dermora essentials for yourself or your entire family.
            Flexible monthly deliveries, personalised to your skin.
          </p>
        </div>

        {/* Active Plan Banner */}
        {activePlan?.isActive && (
          <div className="mb-10 p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-500 text-3xl">verified</span>
              <div>
                <p className="font-bold text-emerald-700 dark:text-emerald-400">
                  You're subscribed to the {PLANS.find(p => p.id === activePlan.plan)?.name}
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-500">
                  Active until {new Date(activePlan.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Link
              to="/subscriptions"
              className="text-sm font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1"
            >
              Manage Plan
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch mb-20">
          {PLANS.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border-2 p-8 shadow-sm transition-all hover:shadow-xl ${plan.popular ? 'border-primary bg-primary text-white shadow-xl shadow-primary/20 md:-translate-y-4' : 'bg-white dark:bg-slate-900 ' + plan.color}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full ${plan.popular ? 'bg-slate-900 text-white' : 'bg-primary text-white'}`}>
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-white/75' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.tagline}
                </p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className={`text-4xl font-black ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    ₹{plan.priceMonthly.toLocaleString('en-IN')}
                  </span>
                  <span className={`text-sm line-through ${plan.popular ? 'text-white/50' : 'text-slate-400'}`}>
                    ₹{plan.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className={`inline-block text-xs font-bold mt-2 px-2 py-0.5 rounded ${plan.popular ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                  {plan.discount}
                </span>
                <p className={`text-xs mt-1 ${plan.popular ? 'text-white/60' : 'text-slate-400'}`}>per month · billed monthly</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-sm font-medium ${plan.popular ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    <span className={`material-symbols-outlined text-base mt-0.5 ${plan.popular ? 'text-white' : 'text-primary'}`}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Included Products */}
              <div className={`mb-6 p-3 rounded-xl text-xs ${plan.popular ? 'bg-white/10' : 'bg-primary/5 dark:bg-primary/10'}`}>
                <p className={`font-bold mb-1 ${plan.popular ? 'text-white/80' : 'text-primary'}`}>Includes:</p>
                <p className={plan.popular ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}>
                  {plan.includes.join(' · ')}
                </p>
              </div>

              {/* CTA Button */}
              {activePlan?.isActive && activePlan?.plan === plan.id ? (
                <div className={`w-full py-3 rounded-xl text-center text-sm font-bold ${plan.popular ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                  ✓ Current Plan
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscribing === plan.id}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-white text-primary hover:bg-slate-50 shadow-lg'
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {subscribing === plan.id ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                      Processing...
                    </>
                  ) : 'Subscribe Now'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* What's Included Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-center mb-10">What's in Your Monthly Kit?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'soap', label: 'Cleanser', desc: 'Gentle, pH-balanced daily wash' },
              { icon: 'water_drop', label: 'Serum', desc: 'Targeted treatment for your concerns' },
              { icon: 'spa', label: 'Moisturizer', desc: '24-hour barrier hydration' },
              { icon: 'wb_sunny', label: 'Sunscreen', desc: 'SPF 50+ broad spectrum shield' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.label}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="rounded-3xl bg-primary/5 dark:bg-primary/10 p-10 md:p-16 text-center">
          <h2 className="text-3xl font-black mb-4">Why Subscribe to Dermora?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-xl mx-auto">
            More than a box — it's a monthly commitment to glowing, healthy skin for you and your loved ones.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'auto_awesome', title: 'AI Personalized', desc: 'Every product is matched to your unique skin assessment.' },
              { icon: 'local_shipping', title: 'Free Delivery', desc: 'All plans include free monthly delivery to your door.' },
              { icon: 'replay', title: 'Flexible & Cancel Anytime', desc: 'Pause or cancel your plan whenever you need. No strings.' },
            ].map(b => (
              <div key={b.title} className="flex flex-col items-center gap-3">
                <div className="size-14 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">{b.icon}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{b.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FamilyComboPage;
