import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface OrderItem {
  productId: {
    _id: string;
    title: string;
    imageUrl: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  buyerId: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  PENDING: { label: 'Pending', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', dot: 'bg-amber-400' },
  PROCESSING: { label: 'Processing', classes: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', dot: 'bg-blue-500' },
  SHIPPED: { label: 'Shipped', classes: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', dot: 'bg-purple-500' },
  DELIVERED: { label: 'Completed', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300', dot: 'bg-red-400' },
};

const SellerOrdersPage: React.FC = () => {
  const { apiRequest } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses = ['All', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/orders/seller');
      console.log('=== RAW API RESPONSE ===');
      console.log('Full response:', JSON.stringify(response, null, 2));
      console.log('Orders array:', response.orders);
      
      if (response.orders && Array.isArray(response.orders)) {
        console.log(`Setting ${response.orders.length} orders`);
        response.orders.forEach((order, idx) => {
          console.log(`Order ${idx}:`, {
            id: order._id,
            orderNumber: order.orderNumber,
            itemsCount: order.orderItems?.length || 0,
            totalAmount: order.totalAmount || 0,
            orderItems: order.orderItems
          });
        });
        setOrders(response.orders);
      } else {
        console.error('Invalid response format:', response);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert(`Failed to fetch orders: ${error}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch = 
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerId?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Summary counts
  const counts = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: counts.total, color: 'text-gray-900 dark:text-white', bg: 'bg-white dark:bg-slate-800' },
          { label: 'Pending', value: counts.pending, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Processing', value: counts.processing, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Completed', value: counts.delivered, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        ].map(item => (
          <div key={item.label} className={`${item.bg} rounded-2xl p-4 shadow-sm border border-pink-100/50 dark:border-slate-700 text-center`}>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-pink-100/50 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID or buyer name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-700 dark:text-gray-200 appearance-none cursor-pointer w-full sm:w-auto"
          >
            {statuses.map(s => <option key={s}>{s === 'All' ? 'All Statuses' : statusConfig[s]?.label || s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-pink-100/50 dark:border-slate-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Buyer</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Items</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {filtered.map(order => {
                  const status = statusConfig[order.status];
                  console.log('Rendering order:', order._id, 'Items:', order.orderItems?.length, 'Amount:', order.totalAmount);
                  return (
                    <tr key={order._id} className="hover:bg-pink-50/30 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary">#{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{order.buyerId?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{order.buyerId?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 && 's'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status?.classes || 'bg-gray-100 text-gray-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status?.dot || 'bg-gray-400'}`} />
                          {status?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/seller/orders/${order._id}`)}
                          className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-primary flex items-center justify-center hover:bg-pink-100 transition-colors ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">#{selectedOrder.orderNumber}</h3>
                <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-500">Buyer</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.buyerId.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.buyerId.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-500">Payment</span>
                <span className={`font-medium ${selectedOrder.paymentStatus === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
              {selectedOrder.trackingNumber && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-500">Tracking</span>
                  <span className="font-mono font-medium text-gray-900 dark:text-white">{selectedOrder.trackingNumber}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-500">Status</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedOrder.status].classes}`}>
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>
              <div className="py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-500 block mb-2">Items</span>
                <ul className="space-y-2">
                  {selectedOrder.orderItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <img 
                        src={item.productId.imageUrl || 'https://placehold.co/40x40'} 
                        alt={item.productId.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium text-xs">{item.productId.title}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">₹{item.price.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;
