import React, { useEffect, useState } from 'react';
import { X, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ListingFeePaymentModalProps {
  productPrice: number;
  quantity: number;
  onSuccess: (data: { listingFeeId: string }) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const ListingFeePaymentModal: React.FC<ListingFeePaymentModalProps> = ({
  productPrice,
  quantity,
  onSuccess,
  onCancel,
}) => {
  const { apiRequest, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feeDetails, setFeeDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateFee();
  }, [productPrice, quantity]);

  const calculateFee = async () => {
    try {
      const data = await apiRequest('/api/listing-fee/calculate', {
        method: 'POST',
        body: JSON.stringify({ productPrice, quantity }),
      });
      setFeeDetails(data);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate listing fee');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create listing fee order
      const orderData = await apiRequest('/api/listing-fee/create-order', {
        method: 'POST',
        body: JSON.stringify({ productPrice, quantity }),
      });

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialize Razorpay payment
      const options = {
        key: orderData.key,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'Dermora',
        description: 'Product Listing Fee',
        order_id: orderData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyData = await apiRequest('/api/listing-fee/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                listingFeeId: orderData.listingFeeId,
              }),
            });

            if (verifyData.success) {
              onSuccess({ listingFeeId: orderData.listingFeeId });
            } else {
              setError('Payment verification failed');
              setLoading(false);
            }
          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#ec4899',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Listing Fee Payment
          </h3>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Why do I need to pay?</p>
              <p className="text-blue-600 dark:text-blue-300">
                A 20% listing fee helps us maintain the platform and provide quality services to sellers and buyers.
              </p>
            </div>
          </div>
        </div>

        {/* Fee Details */}
        {feeDetails && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Product Price</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{feeDetails.productPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Quantity</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {feeDetails.quantity} units
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Product Value</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{feeDetails.totalProductValue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Listing Fee ({feeDetails.feePercentage}%)
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{feeDetails.feeAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-slate-700 pt-3 flex justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">Total Amount to Pay</span>
              <span className="text-xl font-bold text-primary">
                ₹{feeDetails.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading || !feeDetails}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay ₹{feeDetails?.totalAmount.toLocaleString('en-IN')}
              </>
            )}
          </button>
        </div>

        {/* Security Note */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          <CheckCircle className="w-3 h-3 inline mr-1" />
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default ListingFeePaymentModal;
