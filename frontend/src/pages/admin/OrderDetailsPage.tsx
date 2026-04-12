import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, CreditCard, Copy, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { apiRequest } = useAuth();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest(`/api/orders/admin/${orderId}`);
      setOrderData(data.order);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePayoutStatusChange = async (payoutId: string, newStatus: string) => {
    try {
      await apiRequest(`/api/orders/payout/${payoutId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      
      // Refresh order details
      fetchOrderDetails();
      
      // Show success message
      alert('Payout status updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update payout status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 border border-amber-200',
      processing: 'bg-blue-100 text-blue-700 border border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border border-purple-200',
      dispatched: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      delivered: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      cancelled: 'bg-red-100 text-red-700 border border-red-200',
    };
    return colors[status.toLowerCase()] || colors.pending;
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="w-10 h-10 rounded-lg bg-white border border-pink-200 hover:bg-pink-100 flex items-center justify-center transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-pink-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-pink-900">
              ORDER #{orderData.orderNumber} — FULL PICTURE
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="text-sm text-pink-700 mb-2">Total paid by buyer</div>
            <div className="text-3xl font-bold text-pink-900">
              ₹{orderData.totalAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-rose-200 shadow-sm">
            <div className="text-sm text-rose-700 mb-2">Dermora commission</div>
            <div className="text-3xl font-bold text-rose-600">
              ₹{orderData.platformCommission.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="text-sm text-pink-700 mb-2">Total payout to sellers</div>
            <div className="text-3xl font-bold text-pink-900">
              ₹{(orderData.totalAmount - orderData.platformCommission).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="text-sm text-pink-700 mb-2">Sub-orders generated</div>
            <div className="text-3xl font-bold text-pink-900">
              {orderData.sellerBreakdown.length}
            </div>
          </div>
        </div>

        {/* Sub-Order Breakdown */}
        <div>
          <h2 className="text-lg font-bold text-pink-800 mb-4 uppercase tracking-wider">
            Sub-Order Breakdown
          </h2>
          <div className="bg-white rounded-xl border border-pink-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-pink-200 bg-pink-50">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Sub-order</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Seller</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Items</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Sub-total</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Commission (15%)</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Seller payout</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {orderData.sellerBreakdown.map((sellerGroup: any, index: number) => (
                    <tr key={index} className="hover:bg-pink-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-pink-900 font-medium">
                          #{orderData.orderNumber}-{String.fromCharCode(65 + index)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-pink-900 font-medium">{sellerGroup.seller.name}</div>
                        <div className="text-sm text-pink-600">{sellerGroup.seller.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-pink-800">
                          {sellerGroup.items.map((item: any, i: number) => (
                            <div key={i} className="text-sm">
                              {item.product.title}
                              {i < sellerGroup.items.length - 1 && ', '}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-pink-900 font-semibold">
                        ₹{sellerGroup.subtotal.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right text-rose-600 font-semibold">
                        ₹{sellerGroup.platformFee.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right text-pink-900 font-semibold">
                        ₹{sellerGroup.sellerPayout.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(orderData.status)}`}>
                          {orderData.status === 'delivered' ? 'Delivered' : 
                           orderData.status === 'shipped' ? 'Dispatched' : 
                           orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payout Queue */}
        <div>
          <h2 className="text-lg font-bold text-pink-800 mb-4 uppercase tracking-wider">
            Payout Queue
          </h2>
          <div className="bg-white rounded-xl border border-pink-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-pink-200 bg-pink-50">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Seller</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Contact</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Bank Details</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Amount due</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Payout date</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Status</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-pink-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {orderData.sellerBreakdown.map((sellerGroup: any, index: number) => {
                    const payoutDate = orderData.status === 'delivered' ? 'This Monday' : 'Every Monday';
                    
                    return (
                      <tr key={index} className="hover:bg-pink-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-pink-900 font-medium">{sellerGroup.seller.name}</div>
                          <div className="text-sm text-pink-600">{sellerGroup.seller.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-pink-800">
                            <div className="flex items-center gap-1">
                              <span className="text-xs">📞</span>
                              <span>{sellerGroup.seller.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-pink-800 space-y-1">
                            <div><span className="font-medium">A/C:</span> {sellerGroup.seller.bankAccount.accountNumber}</div>
                            <div><span className="font-medium">IFSC:</span> {sellerGroup.seller.bankAccount.ifscCode}</div>
                            <div><span className="font-medium">Name:</span> {sellerGroup.seller.bankAccount.accountHolderName}</div>
                            <div><span className="font-medium">Bank:</span> {sellerGroup.seller.bankAccount.bankName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-pink-900 font-semibold">
                          ₹{sellerGroup.sellerPayout.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-center text-pink-800">
                          {payoutDate}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            sellerGroup.payoutStatus === 'completed' 
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : sellerGroup.payoutStatus === 'processing'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : sellerGroup.payoutStatus === 'failed'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}>
                            {sellerGroup.payoutStatus === 'completed' ? 'Paid' : 
                             sellerGroup.payoutStatus === 'processing' ? 'Processing' :
                             sellerGroup.payoutStatus === 'failed' ? 'Failed' :
                             'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <select
                            value={sellerGroup.payoutStatus}
                            onChange={(e) => handlePayoutStatusChange(sellerGroup.payoutId, e.target.value)}
                            className="text-xs px-3 py-1.5 border border-pink-200 rounded-lg bg-white text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Buyer & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold text-pink-900">Buyer Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-pink-700">Name:</span> <span className="ml-2 text-pink-900 font-medium">{orderData.buyer.name}</span></div>
              <div><span className="text-pink-700">Email:</span> <span className="ml-2 text-pink-900">{orderData.buyer.email}</span></div>
              <div><span className="text-pink-700">Payment:</span> <span className={`ml-2 px-2 py-0.5 rounded text-xs ${orderData.paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{orderData.paymentStatus === 'completed' ? 'Paid ✓' : orderData.paymentStatus}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold text-pink-900">Shipping Address</h3>
            </div>
            {orderData.shippingAddress ? (
              <div className="text-sm text-pink-800 space-y-1">
                <div>{orderData.shippingAddress.street}</div>
                <div>{orderData.shippingAddress.city}, {orderData.shippingAddress.state}</div>
                <div>PIN: {orderData.shippingAddress.pincode}</div>
              </div>
            ) : (
              <div className="text-sm text-pink-600">No address</div>
            )}
            {orderData.trackingNumber && (
              <div className="mt-4 pt-4 border-t border-pink-200">
                <div className="text-xs text-pink-700 mb-1">Tracking</div>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-pink-900">{orderData.trackingNumber}</code>
                  <button onClick={() => copyToClipboard(orderData.trackingNumber, 'tracking')} className="p-1 hover:bg-pink-100 rounded">
                    {copiedField === 'tracking' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-pink-600" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {orderData.paymentId && (
          <div className="bg-white rounded-xl p-5 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold text-pink-900">Payment ID</h3>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-pink-800">{orderData.paymentId}</code>
              <button onClick={() => copyToClipboard(orderData.paymentId, 'payment')} className="p-1 hover:bg-pink-100 rounded">
                {copiedField === 'payment' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-pink-600" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
