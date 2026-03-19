import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../lib/api-client';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  sellerId: {
    id: string;
    name: string;
  };
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      const data = await getProducts(params);
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden font-display text-slate-900 dark:text-black">
      <main className="max-w-7xl mx-auto w-full px-6 md:px-10 py-8 flex flex-col md:flex-row gap-8">
        <FilterSidebar 
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchTerm}
        />
        
        <div className="flex-1">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <Link className="hover:text-primary" to="/">
                  Home
                </Link>
                <span className="material-symbols-outlined text-[10px]">
                  chevron_right
                </span>
                <span className="text-primary font-medium">Skincare</span>
              </nav>
              <h1 className="text-4xl font-serif font-bold text-slate-900">
                Recommended For You
              </h1>
              <p className="text-slate-500 mt-2">
                Discover products backed by science and dermatologists.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-slate-500">Sort by:</p>
              <select 
                className="bg-white border-primary/10 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary shadow-sm dark:bg-slate-800 dark:text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                  <Link to={`/products/${product._id}`} key={product._id}>
                    <ProductCard 
                      id={product._id}
                      name={product.title}
                      description={product.description}
                      price={product.price}
                      size="50ml"
                      rating={4.5}
                      reviews={0}
                      image={product.imageUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80'}
                      recommended={false}
                      newArrival={false}
                    />
                  </Link>
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">No products found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;