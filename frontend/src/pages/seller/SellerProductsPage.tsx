import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Package,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { getProducts } from '../../lib/api-client';
import { useAuth } from '../../hooks/useAuth';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

// Mock data for demo
const mockProducts: Product[] = [
  { _id: '1', title: 'Hydra-Glow Serum', description: 'Deep hydration vitamin C serum for radiant skin', price: 1299, stock: 45, category: 'Serums', imageUrl: '' },
  { _id: '2', title: 'Gentle Foam Cleanser', description: 'Sulfate-free gentle daily cleanser', price: 549, stock: 120, category: 'Cleansers', imageUrl: '' },
  { _id: '3', title: 'SPF 50 Sunscreen', description: 'Broad spectrum lightweight sunscreen', price: 849, stock: 80, category: 'Sunscreens', imageUrl: '' },
  { _id: '4', title: 'Retinol Night Cream', description: 'Anti-aging retinol enriched night moisturizer', price: 1799, stock: 32, category: 'Moisturizers', imageUrl: '' },
  { _id: '5', title: 'Niacinamide Toner', description: '10% niacinamide pore-minimizing toner', price: 699, stock: 0, category: 'Treatments', imageUrl: '' },
  { _id: '6', title: 'AHA/BHA Exfoliant', description: 'Chemical exfoliant for smooth & clear skin', price: 999, stock: 60, category: 'Treatments', imageUrl: '' },
];

const categoryColors: Record<string, string> = {
  Serums: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Cleansers: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Sunscreens: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Moisturizers: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Treatments: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

const SellerProductsPage: React.FC = () => {
  const { user, apiRequest } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        const sellerProducts = data.products?.filter(
          (p: any) => {
            const sellerIdValue = p.sellerId?._id || p.sellerId?.id || p.sellerId;
            const userIdValue = user?.id || user?._id;
            return sellerIdValue?.toString() === userIdValue?.toString();
          }
        ) || [];
        setProducts(sellerProducts.length > 0 ? sellerProducts : []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id || user?._id) {
      load();
    }
  }, [user]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleDelete = async (id: string) => {
    try {
      await apiRequest(`/api/products/${id}`, {
        method: 'DELETE',
      });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      setProducts(prev => prev.filter(p => p._id !== id));
    }
    setDeleteConfirm(null);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300';
    if (stock < 20) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
  };

  const getStockLabel = (stock: number) => {
    if (stock === 0) return 'Out of stock';
    if (stock < 20) return 'Low stock';
    return 'In stock';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Catalog</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{products.length} total products</p>
        </div>
        <Link
          to="/seller/products/add"
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-pink-100/50 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-700 dark:text-gray-200 appearance-none cursor-pointer w-full sm:w-auto"
          >
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-pink-100/50 dark:border-slate-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <p className="text-gray-700 dark:text-gray-200 font-medium mb-1">No products found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Stock</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {filtered.map(product => (
                  <tr key={product._id} className="hover:bg-pink-50/30 dark:hover:bg-slate-700/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{product.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[product.category] || 'bg-gray-100 text-gray-600'}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 hidden md:table-cell">
                      {product.stock} units
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStockBadge(product.stock)}`}>
                        {getStockLabel(product.stock)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/seller/products/edit/${product._id}`}
                          className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        {deleteConfirm === product._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product._id)}
                            className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProductsPage;
