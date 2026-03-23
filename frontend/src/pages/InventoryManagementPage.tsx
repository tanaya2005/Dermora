import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ─── Shared Admin Sidebar ──────────────────────────────────────────────────
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

// ─── Stock badge ────────────────────────────────────────────────────────────
const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock === 0) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">Out of Stock</span>;
  if (stock <= 15) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600">Critical ({stock})</span>;
  if (stock <= 40) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-600">Low ({stock})</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600">OK ({stock})</span>;
};

const stockBarColor = (stock: number) =>
  stock === 0 ? 'bg-slate-300' : stock <= 15 ? 'bg-rose-500' : stock <= 40 ? 'bg-amber-400' : 'bg-emerald-500';

// ─── Main Component ─────────────────────────────────────────────────────────
export const InventoryManagementPage: React.FC = () => {
  const { apiRequest } = useAuth();

  const [products, setProducts]   = useState<any[]>([]);
  const [filtered, setFiltered]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState<'all' | 'critical' | 'low' | 'ok'>('all');
  const [editRow, setEditRow]     = useState<string | null>(null);
  const [editVal, setEditVal]     = useState('');
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/api/products?limit=100');
      setProducts(data.products || []);
    } catch { } finally { setLoading(false); }
  }, [apiRequest]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    let p = [...products];
    if (search) p = p.filter(x => x.title?.toLowerCase().includes(search.toLowerCase()) || x.category?.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'critical') p = p.filter(x => x.stock > 0 && x.stock <= 15);
    if (filter === 'low')      p = p.filter(x => x.stock > 15 && x.stock <= 40);
    if (filter === 'ok')       p = p.filter(x => x.stock > 40);
    setFiltered(p);
  }, [products, search, filter]);

  const handleStockSave = async (id: string) => {
    setSaving(true);
    try {
      await apiRequest(`/api/products/admin/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: Number(editVal) }),
      });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: Number(editVal) } : p));
      setEditRow(null);
      showToast('✓ Stock updated successfully');
    } catch (e: any) {
      showToast(`✗ ${e.message}`);
    } finally { setSaving(false); }
  };

  // Summary stats
  const critical = products.filter(p => p.stock > 0 && p.stock <= 15).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((s, p) => s + (p.price * p.stock), 0);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-display">
      <AdminSidebar active="/admin/inventory" />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl animate-bounce">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex-shrink-0 p-6 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/10 pb-6 bg-white dark:bg-slate-900">
          <div>
            <h1 className="text-2xl font-black tracking-tight dark:text-white">Inventory Management</h1>
            <p className="text-sm text-slate-500">Monitor stock, adjust levels, and identify reorder needs across all Dermora products.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchProducts} className="flex items-center gap-1 px-4 py-2 border border-primary/20 text-primary text-sm font-medium rounded-lg hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-sm">refresh</span> Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-md shadow-primary/20 hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">download</span> Export CSV
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          {[
            { label: 'Total SKUs',     value: products.length,          icon: 'inventory_2',   color: 'text-primary',  bg: 'bg-primary/10' },
            { label: 'Out of Stock',   value: outOfStock,               icon: 'remove_shopping_cart', color: 'text-red-500', bg: 'bg-red-100' },
            { label: 'Critical (<15)', value: critical,                 icon: 'warning',       color: 'text-rose-500', bg: 'bg-rose-100' },
            { label: 'Stock Value',    value: `₹${totalValue.toLocaleString('en-IN', {maximumFractionDigits:0})}`, icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-100' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-primary/10 shadow-sm">
              <div className={`size-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className={`text-xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex-shrink-0 flex flex-wrap items-center gap-3 px-6 pb-4">
          <div className="relative flex-1 min-w-[220px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-primary/10 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 dark:text-white"
              placeholder="Search products or categories…"
            />
          </div>
          <div className="flex gap-2">
            {(['all','critical','low','ok'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filter === f ? 'bg-primary text-white shadow' : 'bg-white dark:bg-slate-900 border border-primary/10 text-slate-500 hover:border-primary hover:text-primary'}`}>
                {f === 'all' ? 'All Items' : f === 'critical' ? '🔴 Critical' : f === 'low' ? '🟡 Low' : '🟢 OK'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
                <p className="text-slate-400 text-sm">Loading inventory…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <span className="material-symbols-outlined text-slate-300 text-5xl">inventory_2</span>
                <p className="text-slate-400">No products match your filters.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-primary/5 border-b border-primary/10">
                  <tr>
                    {['Product', 'Category', 'Price', 'Stock Level', 'Status', 'Actions'].map(h => (
                      <th key={h} className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {filtered.map(product => {
                    const pct = Math.min(100, Math.round((product.stock / 200) * 100));
                    return (
                      <tr key={product._id} className="hover:bg-primary/3 transition-colors group">
                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                              {product.imageUrl
                                ? <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                : <span className="material-symbols-outlined text-slate-400 m-auto block mt-2">image</span>}
                            </div>
                            <div>
                              <p className="text-sm font-semibold dark:text-white truncate max-w-[200px]">{product.title}</p>
                              <p className="text-[10px] text-slate-400 font-mono">ID: {product._id?.slice(-6)?.toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="text-xs font-medium px-2.5 py-1 bg-primary/10 text-primary rounded-lg capitalize">{product.category || '—'}</span>
                        </td>
                        {/* Price */}
                        <td className="px-5 py-4 text-sm font-bold dark:text-white">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </td>
                        {/* Stock Level */}
                        <td className="px-5 py-4 min-w-[160px]">
                          {editRow === product._id ? (
                            <input
                              type="number" min="0" value={editVal}
                              onChange={e => setEditVal(e.target.value)}
                              className="w-24 border border-primary rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-primary/30"
                              autoFocus
                            />
                          ) : (
                            <div className="flex flex-col gap-1">
                              <span className={`text-sm font-bold ${product.stock === 0 ? 'text-slate-400' : product.stock <= 15 ? 'text-rose-500' : product.stock <= 40 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                {product.stock} units
                              </span>
                              <div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${stockBarColor(product.stock)}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )}
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <StockBadge stock={product.stock} />
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {editRow === product._id ? (
                              <>
                                <button onClick={() => handleStockSave(product._id)} disabled={saving}
                                  className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-1">
                                  {saving ? <span className="material-symbols-outlined text-xs animate-spin">refresh</span> : <span className="material-symbols-outlined text-xs">check</span>}
                                  Save
                                </button>
                                <button onClick={() => setEditRow(null)} className="text-slate-400 text-xs px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => { setEditRow(product._id); setEditVal(String(product.stock)); }}
                                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit Stock">
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                {product.stock <= 15 && (
                                  <button className="bg-rose-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-rose-600 transition-colors">
                                    Reorder
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-3 text-right">Showing {filtered.length} of {products.length} products</p>
        </div>
      </main>
    </div>
  );
};

export default InventoryManagementPage;
