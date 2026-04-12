import React, { useEffect, useState } from 'react';
import { X, User, MapPin, CreditCard, Copy, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface OrderDetailsModalProps {
  orderId: string | null;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ orderId, onClose }) => {
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      processing: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      dispatched: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      delivered: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border border-red-500/30',
    };
    return colors[status.toLowerCase()] || colors.pending;
  };

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-start justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-6xl my-8 border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">
              ORDER #{orderData?.orderNumber || '...'} — FULL PICTURE
            </h2>
            {orderData && (
              <p className="text-sm text-gray-400 mt-0.5">
                {new Date(orderData.createdAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-gray-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">{error}</div>
              <button
                onClick={fetchOrderDetails}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {orderData && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#252525] rounded-xl p-5 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">Total paid by buyer</div>
                  <div className="text-3xl font-bold text-white">
                    ₹{orderData.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-[#252525] rounded-xl p-5 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">Dermora commission</div>
                  <div className="text-3xl font-bold text-emerald-400">
                    ₹{orderData.platformCommission.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-[#252525] rounded-xl p-5 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">Total payout to sellers</div>
                  <div className="text-3xl font-bold text-white">
                    ₹{(orderData.totalAmount - orderData.platformCommission).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-[#252525] rounded-xl p-5 border border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">Sub-orders generated</div>
                  <div className="text-3xl font-bold text-white">
                    {orderData.sellerBreakdown.length}
                  </div>
                </div>
              </div>

              {/* Sub-Order Breakdown */}
              <div>
                <h3 className="text-lg font-bold text-gray-400 mb-4 uppercase tracking-wider">
                  Sub-Order Breakdown
                </h3>
                <div className="bg-[#252525] rounded-xl border border-gray-800 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Sub-order</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Seller</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Items</th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Sub-total</th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Commission (15%)</th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Seller payout</th>
                        <th className="text-center px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {orderData.sellerBreakdown.map((sellerGroup: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-mono text-white">
                              #{orderData.orderNumber}-{String.fromCharCode(65 + index)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{sellerGroup.seller.name}</div>
                            <div className="text-sm text-gray-400">{sellerGroup.seller.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-300">
                              {sellerGroup.items.map((item: any, i: number) => (
                                <div key={i} className="text-sm">
                                  {item.product.title}
                                  {i < sellerGroup.items.length - 1 && ', '}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-white font-semibold">
                            ₹{sellerGroup.subtotal.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-right text-emerald-400 font-semibold">
                            ₹{sellerGroup.platformFee.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-right text-white font-semibold">
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

              {/* Payout Queue */}
              <div>
                <h3 className="text-lg font-bold text-gray-400 mb-4 uppercase tracking-wider">
                  Payout Queue
                </h3>
                <div className="bg-[#252525] rounded-xl border border-gray-800 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Seller</th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Amount due</th>
                        <th className="text-center px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Payout date</th>
                        <th className="text-center px-6 py-4 text-sm font-semibold text-gray-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {orderData.sellerBreakdown.map((sellerGroup: any, index: number) => {
                        const payoutStatus = orderData.status === 'delivered' ? 'processing' : 'pending';
                        const payoutDate = orderData.status === 'delivered' ? 'This Monday' : 'Every Monday';
                        
                        return (
                          <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-white font-medium">{sellerGroup.seller.name}</div>
                            </td>
                            <td className="px-6 py-4 text-right text-white font-semibold">
                              ₹{sellerGroup.sellerPayout.toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-300">
                              {payoutDate}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                payoutStatus === 'processing' 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {payoutStatus === 'processing' ? 'Processing' : 'Pending delivery confirm'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Buyer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#252525] rounded-xl p-5 border border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-white">Buyer Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Name:</span> <span className="ml-2 text-white">{orderData.buyer.name}</span></div>
                    <div><span className="text-gray-400">Email:</span> <span className="ml-2 text-white">{orderData.buyer.email}</span></div>
                    <div><span className="text-gray-400">Payment:</span> <span className={`ml-2 px-2 py-0.5 rounded text-xs ${orderData.paymentStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{orderData.paymentStatus === 'completed' ? 'Paid ✓' : orderData.paymentStatus}</span></div>
                  </div>
                </div>

                <div className="bg-[#252525] rounded-xl p-5 border border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-white">Shipping Address</h3>
                  </div>
                  {orderData.shippingAddress ? (
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>{orderData.shippingAddress.street}</div>
                      <div>{orderData.shippingAddress.city}, {orderData.shippingAddress.state}</div>
                      <div>PIN: {orderData.shippingAddress.pincode}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No address</div>
                  )}
                  {orderData.trackingNumber && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="text-xs text-gray-400 mb-1">Tracking</div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-white">{orderData.trackingNumber}</code>
                        <button onClick={() => copyToClipboard(orderData.trackingNumber, 'tracking')} className="p-1 hover:bg-gray-700 rounded">
                          {copiedField === 'tracking' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {orderData.paymentId && (
                <div className="bg-[#252525] rounded-xl p-5 border border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-white">Payment ID</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-gray-300">{orderData.paymentId}</code>
                    <button onClick={() => copyToClipboard(orderData.paymentId, 'payment')} className="p-1 hover:bg-gray-700 rounded">
                      {copiedField === 'payment' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-800">
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-800 text-gray-200 rounded-xl font-medium hover:bg-gray-700">Close</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
