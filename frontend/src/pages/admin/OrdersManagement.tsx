import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface OrderItem {
  productId: {
    _id: string;
    title: string;
    imageUrl: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export const OrdersManagement: React.FC = () => {
  const { apiRequest } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/orders/admin');
      setOrders(response.orders || []);
      calculateStats(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList: Order[]) => {
    const stats = {
      totalOrders: ordersList.length,
      pendingOrders: ordersList.filter(o => o.status === 'pending').length,
      processingOrders: ordersList.filter(o => o.status === 'processing').length,
      shippedOrders: ordersList.filter(o => o.status === 'shipped').length,
      deliveredOrders: ordersList.filter(o => o.status === 'delivered').length,
      cancelledOrders: ordersList.filter(o => o.status === 'cancelled').length,
      totalRevenue: ordersList
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0),
      averageOrderValue: ordersList.length > 0 
        ? ordersList.reduce((sum, o) => sum + o.totalAmount, 0) / ordersList.length 
        : 0,
    };
    setStats(stats);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await apiRequest(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      alert('Order status updated successfully!');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        const updatedOrder = orders.find(o => o._id === orderId);
        if (updatedOrder) {
          setSelectedOrder({ ...updatedOrder, status: newStatus as any });
        }
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddTracking = async (orderId: string, trackingNumber: string) => {
    if (!trackingNumber.trim()) {
      alert('Please enter a tracking number');
      return;
    }

    try {
      await apiRequest(`/api/orders/${orderId}/tracking`, {
        method: 'PUT',
        body: JSON.stringify({ trackingNumber }),
      });
      alert('Tracking number added successfully!');
      fetchOrders();
    } catch (error: any) {
      alert(error.message || 'Failed to add tracking number');
    }
  };

  const filteredOrders = orders
    .filter(order => filter === 'all' || order.status === filter)
    .filter(order =>
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped': return 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400';
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'processing': return 'sync';
      case 'shipped': return 'local_shipping';
      case 'delivered': return 'check_circle';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-xl border border-primary/15 bg-white dark:bg-slate-800 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Orders Management</h1>
        <p className="text-slate-600 dark:text-slate-400">Track and manage all customer orders</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">shopping_cart</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalOrders}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Total Orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">schedule</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pendingOrders}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">sync</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.processingOrders}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Processing</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-violet-200 dark:border-violet-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-violet-600 dark:text-violet-400">local_shipping</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.shippedOrders}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Shipped</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.deliveredOrders}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Delivered</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">payments</span>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">₹{(stats.totalRevenue / 1000).toFixed(1)}K</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Revenue</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Search by order number, customer name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredOrders.map((order) => (
                <tr 
                  key={order._id} 
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">{getStatusIcon(order.status)}</span>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">#{order.orderNumber}</div>
                        {order.trackingNumber && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">Track: {order.trackingNumber}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{order.userId.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{order.userId.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-white">{order.items.length} item(s)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">₹{order.totalAmount.toLocaleString()}</div>
                    <div className={`text-xs ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                      {order.paymentStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/orders/${order._id}`);
                      }}
                      className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">shopping_cart_off</span>
            <p className="text-slate-500 dark:text-slate-400">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Order #{selectedOrder.orderNumber}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">person</span>
                  Customer Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-slate-900 dark:text-white font-medium">{selectedOrder.userId.name}</p>
                  <p className="text-slate-600 dark:text-slate-400">{selectedOrder.userId.email}</p>
                  {selectedOrder.shippingAddress && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-slate-600 dark:text-slate-400">
                        {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">inventory_2</span>
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                      <img
                        src={item.productId.imageUrl || 'https://placehold.co/60x60'}
                        alt={item.productId.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{item.productId.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">₹{item.price.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">₹{(item.price / item.quantity).toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-semibold text-slate-900 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">update</span>
                  Update Order Status
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                      disabled={updatingStatus || selectedOrder.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                        selectedOrder.status === status
                          ? getStatusColor(status)
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracking Number */}
              {selectedOrder.status === 'shipped' && (
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    Tracking Information
                  </h3>
                  {selectedOrder.trackingNumber ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Tracking Number:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedOrder.trackingNumber}</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter tracking number"
                        id="trackingInput"
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('trackingInput') as HTMLInputElement;
                          handleAddTracking(selectedOrder._id, input.value);
                        }}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Add Tracking
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
