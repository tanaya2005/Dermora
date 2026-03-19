import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createProduct, getProducts } from '../lib/api-client';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      // Filter products by current seller
      const sellerProducts = data.products?.filter(
        (product: any) => product.sellerId.id === user?.id
      ) || [];
      setProducts(sellerProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProduct(formData);
      alert('Product created successfully!');
      loadProducts();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        imageUrl: '',
      });
      setShowForm(false);
    } catch (error: any) {
      alert(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Cleansers', 'Moisturizers', 'Serums', 'Sunscreens', 'Treatments'];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}! Manage your skincare products here.</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {showForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Your Products ({products.length})</h2>
          </div>
          
          {products.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No products yet. Create your first product to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {products.map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 rounded-lg mb-4">
                    <img
                      src={product.imageUrl || '/placeholder-product.jpg'}
                      alt={product.title}
                      className="h-32 w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-primary">₹{product.price}</span>
                    <span className="text-gray-500">Stock: {product.stock}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">{product.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;