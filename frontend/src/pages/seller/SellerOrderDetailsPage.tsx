import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Package, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SellerOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { apiRequest } = useAuth();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest(`/api/orders/seller/${orderId}`);
      setOrderData(data.order);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await apiRequest(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      
      // Refresh order details
      await fetchOrderDetails();
      
      alert('Order status updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-amber-100 text-amber-700 border border-amber-200',
      PROCESSING: 'bg-blue-100 text-blue-700 border border-blue-200',
      SHIPPED: 'bg-purple-100 text-purple-700 border border-purple-200',
      DELIVERED: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
    };
    return colors[status] || colors.PENDING;
  };

  const getPayoutStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 border border-amber-200',
      processing: 'bg-blue-100 text-blue-700 border border-blue-200',
      completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      failed: 'bg-red-100 text-red-700 border border-red-200',
    };
    return colors[status] || colors.pending;
  };

  const getShippingAction = () => {
    if (!orderData) return null;
    
    const status = orderData.status;
    const shippingAddress = orderData.shippingAddress;
    
    if (status === 'DELIVERED') {
      return 'Order delivered successfully';
    } else if (status === 'SHIPPED') {
      return `In transit to ${shippingAddress?.city || 'customer'}`;
    } else if (status === 'PROCESSING') {
      return `Pack and dispatch to ${orderData.buyer.name}`;
    } else if (status === 'PENDING') {
      return `Awaiting confirmation - Prepare for ${orderData.buyer.name}`;
    }
    return 'No action required';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 p-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchOrderDetails}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/seller/orders')}
            className="w-10 h-10 rounded-lg bg-white border border-pink-200 hover:bg-pink-100 flex items-center justify-center transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-pink-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-pink-900">
              Order #{orderData.orderNumber}
            </h1>
            <p className="text-sm text-pink-700 mt-1">
              {new Date(orderData.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="text-sm text-pink-700 mb-2">Sub-order value</div>
            <div className="text-3xl font-bold text-pink-900">
              ₹{orderData.subOrderValue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-rose-200 shadow-sm">
            <div className="text-sm text-rose-700 mb-2">Platform fee (15%)</div>
            <div className="text-3xl font-bold text-rose-600">
              −₹{orderData.platformFee.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-sm">
            <div className="text-sm text-emerald-700 mb-2">Your payout</div>
            <div className="text-3xl font-bold text-emerald-600">
              ₹{orderData.sellerPayout.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl border border-pink-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pink-200 bg-pink-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Item</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Qty</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Price</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Your share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100">
                {orderData.items.map((item: any, index: number) => {
                  const yourShare = Math.round(item.total * 0.85);
                  return (
                    <tr key={index} className="hover:bg-pink-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.imageUrl || 'https://placehold.co/50x50'}
                            alt={item.product.title}
                            className="w-12 h-12 rounded-lg object-cover border border-pink-100"
                          />
                          <div>
                            <div className="text-pink-900 font-medium">{item.product.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-pink-900 font-semibold">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-pink-900 font-semibold">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right text-emerald-600 font-semibold">
                        ₹{yourShare.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Action Required */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200 shadow-sm">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">Shipping action required:</h3>
              <p className="text-orange-800">{getShippingAction()}</p>
              {orderData.status === 'PROCESSING' && orderData.shippingAddress && (
                <p className="text-sm text-orange-700 mt-2">
                  Ship by <span className="font-semibold">Tomorrow 6 PM</span> to maintain SLA
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buyer Info */}
          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold text-pink-900">Customer Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-pink-700">Name:</span>{' '}
                <span className="ml-2 text-pink-900 font-medium">{orderData.buyer.name}</span>
              </div>
              <div>
                <span className="text-pink-700">Email:</span>{' '}
                <span className="ml-2 text-pink-900">{orderData.buyer.email}</span>
              </div>
              <div>
                <span className="text-pink-700">Payment:</span>{' '}
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    orderData.paymentStatus === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {orderData.paymentStatus === 'completed' ? 'Paid ✓' : orderData.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold text-pink-900">Shipping Address</h3>
            </div>
            {orderData.shippingAddress ? (
              <div className="text-sm text-pink-800 space-y-1">
                <div>{orderData.shippingAddress.street}</div>
                <div>
                  {orderData.shippingAddress.city}, {orderData.shippingAddress.state}
                </div>
                <div>PIN: {orderData.shippingAddress.pincode}</div>
              </div>
            ) : (
              <div className="text-sm text-pink-600">No address provided</div>
            )}
            {orderData.trackingNumber && (
              <div className="mt-4 pt-4 border-t border-pink-200">
                <div className="text-xs text-pink-700 mb-1">Tracking Number</div>
                <code className="text-sm font-mono text-pink-900">{orderData.trackingNumber}</code>
              </div>
            )}
          </div>
        </div>

        {/* Order Status & Payout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold text-pink-900">Order Status</h3>
            </div>
            <div className="space-y-3">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                {orderData.status === 'DELIVERED'
                  ? 'Delivered'
                  : orderData.status === 'SHIPPED'
                  ? 'Dispatched'
                  : orderData.status.charAt(0) + orderData.status.slice(1).toLowerCase()}
              </span>
              
              <div className="pt-3">
                <label className="block text-sm text-pink-700 mb-2">Update Status:</label>
                <select
                  value={orderData.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className="w-full px-4 py-2 border border-pink-200 rounded-lg bg-white text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                {updatingStatus && (
                  <p className="text-xs text-pink-600 mt-2">Updating status...</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold text-pink-900">Payout Status</h3>
            </div>
            <div className="space-y-2">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getPayoutStatusColor(orderData.payoutStatus)}`}>
                {orderData.payoutStatus === 'completed'
                  ? 'Paid ✓'
                  : orderData.payoutStatus === 'processing'
                  ? 'Processing'
                  : orderData.payoutStatus === 'failed'
                  ? 'Failed'
                  : 'Pending'}
              </span>
              {orderData.payoutStatus === 'pending' && orderData.status === 'DELIVERED' && (
                <p className="text-xs text-pink-700 mt-2">Payout scheduled for this Monday</p>
              )}
              {orderData.payoutStatus === 'pending' && orderData.status !== 'DELIVERED' && (
                <p className="text-xs text-pink-700 mt-2">Payout will be processed after delivery</p>
              )}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-pink-100 rounded-xl p-4 border border-pink-200">
          <p className="text-sm text-pink-800">
            <span className="font-semibold">Note:</span> You can only see your products from this order. Other sellers' items are not visible to you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetailsPage;
