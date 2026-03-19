import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  ShoppingBag,
} from 'lucide-react';

// Mock orders data
const mockOrders = [
  { id: 'ORD-2026-001', buyer: 'Priya Sharma', email: 'priya@example.com', amount: 1299, status: 'DELIVERED', date: '2026-03-15', items: ['Hydra-Glow Serum', 'SPF 50 Sunscreen'], payment: 'Razorpay' },
  { id: 'ORD-2026-002', buyer: 'Ananya Verma', email: 'ananya@example.com', amount: 849, status: 'PENDING', date: '2026-03-16', items: ['Gentle Foam Cleanser'], payment: 'UPI' },
  { id: 'ORD-2026-003', buyer: 'Meera Nair', email: 'meera@example.com', amount: 2150, status: 'PROCESSING', date: '2026-03-16', items: ['Retinol Night Cream', 'Niacinamide Toner', 'AHA/BHA Exfoliant'], payment: 'Credit Card' },
  { id: 'ORD-2026-004', buyer: 'Kavita Joshi', email: 'kavita@example.com', amount: 599, status: 'SHIPPED', date: '2026-03-17', items: ['Niacinamide Toner'], payment: 'Debit Card' },
  { id: 'ORD-2026-005', buyer: 'Sunita Rao', email: 'sunita@example.com', amount: 3400, status: 'CANCELLED', date: '2026-03-17', items: ['AHA/BHA Exfoliant', 'Retinol Night Cream', 'Hydra-Glow Serum', 'SPF 50 Sunscreen'], payment: 'Razorpay' },
  { id: 'ORD-2026-006', buyer: 'Divya Patel', email: 'divya@example.com', amount: 1598, status: 'DELIVERED', date: '2026-03-14', items: ['Hydra-Glow Serum', 'Gentle Foam Cleanser'], payment: 'UPI' },
  { id: 'ORD-2026-007', buyer: 'Ritu Singh', email: 'ritu@example.com', amount: 999, status: 'PENDING', date: '2026-03-18', items: ['AHA/BHA Exfoliant'], payment: 'Razorpay' },
  { id: 'ORD-2026-008', buyer: 'Pooja Mehta', email: 'pooja@example.com', amount: 2648, status: 'PROCESSING', date: '2026-03-18', items: ['Retinol Night Cream', 'SPF 50 Sunscreen'], payment: 'Credit Card' },
];

const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  PENDING: { label: 'Pending', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', dot: 'bg-amber-400' },
  PROCESSING: { label: 'Processing', classes: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', dot: 'bg-blue-500' },
  SHIPPED: { label: 'Shipped', classes: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', dot: 'bg-purple-500' },
  DELIVERED: { label: 'Completed', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300', dot: 'bg-red-400' },
};

const SellerOrdersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

  const statuses = ['All', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const filtered = mockOrders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Summary counts
  const counts = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === 'PENDING').length,
    processing: mockOrders.filter(o => o.status === 'PROCESSING').length,
    delivered: mockOrders.filter(o => o.status === 'DELIVERED').length,
  };

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
                  return (
                    <tr key={order.id} className="hover:bg-pink-50/30 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary">{order.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{order.buyer}</p>
                          <p className="text-xs text-gray-400">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        {order.items.length} item{order.items.length !== 1 && 's'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        ₹{order.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">{order.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedOrder.id}</h3>
                <p className="text-sm text-gray-500">{selectedOrder.date}</p>
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
                <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.buyer}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.payment}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-500">Status</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedOrder.status].classes}`}>
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>
              <div className="py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-500 block mb-2">Items</span>
                <ul className="space-y-1">
                  {selectedOrder.items.map(item => (
                    <li key={item} className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">₹{selectedOrder.amount.toLocaleString('en-IN')}</span>
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
