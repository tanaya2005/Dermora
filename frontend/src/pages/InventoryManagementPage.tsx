import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Stock badge component
const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock === 0) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">Out of Stock</span>;
  if (stock <= 15) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600">Critical ({stock})</span>;
  if (stock <= 40) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-600">Low ({stock})</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600">OK ({stock})</span>;
};

const stockBarColor = (stock: number) =>
  stock === 0 ? 'bg-slate-300' : stock <= 15 ? 'bg-rose-500' : stock <= 40 ? 'bg-amber-400' : 'bg-emerald-500';

// Main Component
export const InventoryManagementPage: React.FC = () => {
  const { apiRequest } = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'critical' | 'low' | 'ok'>('all');
  const [toast, setToast] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/api/products');
      setProducts(data.products || []);
    } catch (e: any) { showToast(`✗ ${e.message}`); }
    finally { setLoading(false); }
  }, [apiRequest]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    let p = [...products];
    if (search) p = p.filter(x => x.title?.toLowerCase().includes(search.toLowerCase()) || x.category?.toLowerCase().includes(search.toLowerCase()));
    if (filter !== 'all') {
      if (filter === 'critical') p = p.filter(x => x.stock <= 15);
      else if (filter === 'low') p = p.filter(x => x.stock > 15 && x.stock <= 40);
      else if (filter === 'ok') p = p.filter(x => x.stock > 40);
    }
    setFiltered(p);
  }, [products, search, filter]);

  const updateStock = async (productId: string, newStock: number) => {
    setUpdating(productId);
    try {
      await apiRequest(`/api/products/${productId}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: newStock }),
      });
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock: newStock } : p));
      showToast(`✓ Stock updated to ${newStock}`);
    } catch (e: any) { showToast(`✗ ${e.message}`); }
    finally { setUpdating(null); }
  };

  // Stats
  const outOfStock = products.filter(p => p.stock === 0).length;
  const critical = products.filter(p => p.stock > 0 && p.stock <= 15).length;
  const totalValue = products.reduce((s, p) => s + (p.price * p.stock), 0);

  return (
    <div className="min-h-screen bg-secondary dark:bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl animate-bounce">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-xl border border-primary/15 bg-white/80 dark:bg-slate-900/80 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Admin Dashboard
          </Link>
          <h1 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-2">Inventory Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Monitor stock, adjust levels, and identify reorder needs across all Dermora products.</p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button onClick={fetchProducts} className="flex items-center gap-1 px-4 py-2 border border-primary/20 text-primary text-sm font-medium rounded-lg hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total SKUs',     value: products.length,          icon: 'inventory_2',   color: 'text-primary',  bg: 'bg-primary/10' },
            { label: 'Out of Stock',   value: outOfStock,               icon: 'remove_shopping_cart', color: 'text-red-500', bg: 'bg-red-100' },
            { label: 'Critical (<15)', value: critical,                 icon: 'warning',       color: 'text-rose-500', bg: 'bg-rose-100' },
            { label: 'Stock Value',    value: `₹${totalValue.toLocaleString('en-IN', {maximumFractionDigits:0})}`, icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-100' },
          ].map(s => (
            <div key={s.label} className="glass-card p-6 text-center">
              <div className={`size-12 rounded-xl ${s.bg} flex items-center justify-center mb-3 mx-auto`}>
                <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{s.label}</p>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
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
        <div className="glass-card p-6">
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
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-primary/5 border-b border-primary/10">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Product</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Price</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Stock</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product) => {
                      const isUpdating = updating === product._id;
                      return (
                        <tr key={product._id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                {product.imageUrl ? (
                                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="material-symbols-outlined text-slate-400 m-auto block mt-3 text-xl">image</span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold dark:text-white truncate">{product.title}</p>
                                <p className="text-xs text-slate-500 truncate">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-sm font-bold dark:text-white">₹{product.price?.toLocaleString('en-IN')}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-lg font-black dark:text-white">{product.stock}</span>
                              <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${stockBarColor(product.stock)} transition-all`}
                                  style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <StockBadge stock={product.stock} />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isUpdating ? (
                                <span className="material-symbols-outlined animate-spin text-primary text-lg">refresh</span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => updateStock(product._id, Math.max(0, product.stock - 10))}
                                    className="size-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                    title="Decrease by 10"
                                  >
                                    <span className="material-symbols-outlined text-sm">remove</span>
                                  </button>
                                  <button
                                    onClick={() => updateStock(product._id, product.stock + 10)}
                                    className="size-8 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                                    title="Increase by 10"
                                  >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-right">Showing {filtered.length} of {products.length} products</p>
            </>
            )}
          </div>
        </div>
      </div>
  );
};

export default InventoryManagementPage;
