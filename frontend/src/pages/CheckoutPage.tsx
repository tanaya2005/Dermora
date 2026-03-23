import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Utility to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { apiRequest, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract cart state
  const selectedItems = state?.selectedItems || [];
  const total = state?.total || 0;
  const subtotal = state?.subtotal || 0;
  const discount = state?.discount || 0;
  const tax = state?.tax || 0;

  useEffect(() => {
    if (!selectedItems.length) {
      navigate('/cart');
    }
  }, [selectedItems, navigate]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // 1. Create Order in Backend
      const orderItems = selectedItems.map((item: any) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      const orderData = await apiRequest('/api/orders/create', {
        method: 'POST',
        body: JSON.stringify({ items: orderItems })
      });

      // 2. Create Razorpay Order
      const paymentData = await apiRequest('/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ orderId: orderData.order._id })
      });

      // 3. Initialize Razorpay popup
      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Dermora",
        description: "Skincare Purchase",
        order_id: paymentData.orderId,
        handler: async function (response: any) {
          try {
            // 4. Verify Payment
            await apiRequest('/api/payments/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.order._id
              })
            });
            // 5. Navigate to orders page on success
            navigate('/orders');
          } catch (err: any) {
            setError(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: ""
        },
        theme: {
          color: "#D4567A" // Dermora Primary Color
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        setError(response.error.description);
      });
      rzp1.open();

    } catch (err: any) {
      setError(err.message || 'Something went wrong during checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedItems.length) return null;

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
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                      2
                    </span>
                    <span className="hidden sm:inline">Payment</span>
                  </div>
                </nav>

                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Shipping Section */}
                <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-primary/5 shadow-sm">
                  <h3 className="text-2xl font-bold mb-6 dark:text-white">Shipping Address</h3>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        First Name
                      </label>
                      <input
                        className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border dark:text-white"
                        placeholder="John"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Last Name
                      </label>
                      <input
                        className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border dark:text-white"
                        placeholder="Doe"
                        type="text"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Address
                      </label>
                      <input
                        className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border dark:text-white"
                        placeholder="123 Skincare Lane"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        City
                      </label>
                      <input
                        className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border dark:text-white"
                        placeholder="New York"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        ZIP Code
                      </label>
                      <input
                        className="rounded-lg border-primary/20 focus:ring-primary focus:border-primary bg-background-light/50 dark:bg-slate-800 p-2 border dark:text-white"
                        placeholder="10001"
                        type="text"
                      />
                    </div>
                  </form>
                </section>

                <button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="bg-primary text-white font-bold py-4 rounded-xl text-lg hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-white">refresh</span>
                  ) : (
                    <>Complete Order (${total.toFixed(2)})</>
                  )}
                </button>
              </div>

              {/* Order Summary (4 Columns) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/5 shadow-sm overflow-hidden p-6">
                  <h3 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h3>

                  {/* Cart Items */}
                  <div className="flex flex-col gap-4 mb-6">
                    {selectedItems.map((item: any) => (
                      <div key={item._id} className="flex gap-4">
                        <div
                          className="size-20 rounded-lg bg-center bg-cover flex-shrink-0"
                          style={{ backgroundImage: `url('₹{item.productId?.imageUrl}')` }}
                        ></div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {item.productId?.title}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Qty: {item.quantity}</span>
                            <p className="font-bold text-primary">₹{((item.productId?.price || 0) * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="flex flex-col gap-3 border-t border-primary/10 pt-6">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-500">
                        <span>Promo Discount</span>
                        <span>-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Shipping</span>
                      <span className="text-emerald-500 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Tax (8%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black pt-4 text-slate-900 dark:text-white border-t border-primary/10">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
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
                    Secured by Razorpay. Guaranteed safe checkout.
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

export default CheckoutPage;
