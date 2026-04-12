import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ─── Shared Admin Sidebar (same as in Inventory) ───────────────────────────
const AdminSidebar: React.FC<{ active: string }> = ({ active }) => (
  <aside className="hidden lg:flex w-64 flex-col border-r border-primary/10 bg-white dark:bg-slate-900 flex-shrink-0">
    <div className="p-6 flex items-center gap-3 border-b border-primary/10">
      <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
        <span className="material-symbols-outlined text-lg">spa</span>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-primary">Admin</h2>
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1">
      {[
        { label: 'Dashboard',  icon: 'dashboard',    to: '/admin' },
        { label: 'Inventory',  icon: 'inventory_2',  to: '/admin/inventory' },
        { label: 'Orders',     icon: 'receipt_long', to: '/admin/orders' },
      ].map(item => (
        <Link key={item.to} to={item.to}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active === item.to ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'}`}>
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
    <div className="p-4 border-t border-primary/10">
      <Link to="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Store
      </Link>
    </div>
  </aside>
);

// ─── Status pill ────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  PENDING:    'bg-amber-100 text-amber-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED:    'bg-sky-100 text-sky-700',
  DELIVERED:  'bg-emerald-100 text-emerald-700',
  CANCELLED:  'bg-rose-100 text-rose-600',
};
const STATUS_ICONS: Record<string, string> = {
  PENDING: 'schedule', PROCESSING: 'sync', SHIPPED: 'local_shipping',
  DELIVERED: 'check_circle', CANCELLED: 'cancel',
};
const ALL_STATUSES = ['PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED'] as const;

const StatusPill: React.FC<{ status: string }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-500'}`}>
    <span className="material-symbols-outlined text-[13px]">{STATUS_ICONS[status] || 'info'}</span>
    {status}
  </span>
);

// ─── Main Component ─────────────────────────────────────────────────────────
export const AdminOrdersPage: React.FC = () => {
  const { apiRequest } = useAuth();

  const [orders, setOrders]         = useState<any[]>([]);
  const [filtered, setFiltered]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState<string>('ALL');
  const [expandedId, setExpanded]   = useState<string | null>(null);
  const [updating, setUpdating]     = useState<string | null>(null);
  const [toast, setToast]           = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/api/orders/admin');
      setOrders(data.orders || []);
    } catch (e: any) { showToast(`✗ ${e.message}`); }
    finally { setLoading(false); }
  }, [apiRequest]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    let o = [...orders];
    if (statusFilter !== 'ALL') o = o.filter(x => x.status === statusFilter);
    if (search) o = o.filter(x =>
      x._id?.toLowerCase().includes(search.toLowerCase()) ||
      x.buyerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      x.buyerId?.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(o);
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const { order } = await apiRequest(`/api/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, ...order } : o));
      showToast(`✓ Order status updated to ${newStatus}`);
    } catch (e: any) { showToast(`✗ ${e.message}`); }
    finally { setUpdating(null); }
  };

  // Stats
  const revenue = orders
    .filter(o => ['PROCESSING','SHIPPED','DELIVERED'].includes(o.status))
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-display">
      <AdminSidebar active="/admin/orders" />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex-shrink-0 p-6 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/10 bg-white dark:bg-slate-900">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-xl border border-primary/15 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Admin Dashboard
            </Link>
            <h1 className="text-2xl font-black tracking-tight dark:text-white">Order Management</h1>
            <p className="text-sm text-slate-500">View, filter and update the status of all customer orders across Dermora.</p>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-1 px-4 py-2 border border-primary/20 text-primary text-sm font-medium rounded-lg hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>
        </div>

        {/* KPI Cards */}
        <div className="flex-shrink-0 grid grid-cols-2 md:grid-cols-5 gap-4 p-6">
          {[
            { label: 'Total Orders',  value: orders.length, color: 'text-primary',    bg: 'bg-primary/10',   icon: 'receipt_long' },
            { label: 'Pending',       value: orders.filter(o=>o.status==='PENDING').length,    color: 'text-amber-600', bg: 'bg-amber-100',    icon: 'schedule' },
            { label: 'Processing',    value: orders.filter(o=>o.status==='PROCESSING').length, color: 'text-blue-600',  bg: 'bg-blue-100',     icon: 'sync' },
            { label: 'Shipped',       value: orders.filter(o=>o.status==='SHIPPED').length,    color: 'text-sky-600',   bg: 'bg-sky-100',      icon: 'local_shipping' },
            { label: 'Revenue (paid)',value: `₹${revenue.toLocaleString('en-IN',{maximumFractionDigits:0})}`, color:'text-emerald-700', bg:'bg-emerald-100', icon:'payments' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-primary/10 shadow-sm">
              <div className={`size-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex-shrink-0 flex flex-wrap items-center gap-3 px-6 pb-4">
          <div className="relative flex-1 min-w-[220px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-primary/10 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 dark:text-white"
              placeholder="Search by order ID, buyer name or email…" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['ALL', ...ALL_STATUSES]).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${statusFilter === s ? 'bg-primary text-white shadow' : 'bg-white dark:bg-slate-900 border border-primary/10 text-slate-500 hover:border-primary hover:text-primary'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
              <p className="text-slate-400 text-sm">Loading orders…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <span className="material-symbols-outlined text-slate-300 text-5xl">receipt_long</span>
              <p className="text-slate-400">No orders match your filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(order => {
                const isExpanded = expandedId === order._id;
                return (
                  <div key={order._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                    {/* Row */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-5">
                      {/* Order ID + Date */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-slate-400">#{order._id?.slice(-8)?.toUpperCase()}</span>
                          <StatusPill status={order.status} />
                        </div>
                        <p className="text-sm font-bold dark:text-white">
                          {order.buyerId?.name || 'Unknown Buyer'}
                        </p>
                        <p className="text-xs text-slate-400">{order.buyerId?.email}</p>
                      </div>

                      {/* Items count + Total */}
                      <div className="flex items-center gap-6 flex-shrink-0 text-center">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Items</p>
                          <p className="text-lg font-black dark:text-white">{order.orderItems?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Total</p>
                          <p className="text-lg font-black text-primary">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Date</p>
                          <p className="text-xs font-semibold dark:text-slate-300">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Status Updater */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          disabled={updating === order._id}
                          className="border border-primary/20 text-sm font-medium rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary/30 disabled:opacity-50 cursor-pointer"
                        >
                          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {updating === order._id && <span className="material-symbols-outlined animate-spin text-primary text-lg">refresh</span>}

                        <button onClick={() => setExpanded(isExpanded ? null : order._id)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-primary/10 p-5 bg-slate-50 dark:bg-slate-800/50">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.orderItems?.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="size-12 rounded-lg overflow-hidden bg-white border border-primary/10 flex-shrink-0">
                                {item.productId?.imageUrl
                                  ? <img src={item.productId.imageUrl} alt={item.productId.title} className="w-full h-full object-cover" />
                                  : <span className="material-symbols-outlined text-slate-300 m-auto block mt-3 text-xl">image</span>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold dark:text-white truncate">{item.productId?.title || 'Unknown Product'}</p>
                                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-bold text-primary flex-shrink-0">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-primary/10 flex justify-between items-center">
                          <span className="text-xs text-slate-400">Order ID: <span className="font-mono">{order._id}</span></span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            Total: ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-xs text-slate-400 mt-3 text-right">Showing {filtered.length} of {orders.length} orders</p>
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersPage;
