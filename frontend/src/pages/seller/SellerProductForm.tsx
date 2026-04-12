import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  Tag,
  DollarSign,
  Layers,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { getProduct } from '../../lib/api-client';
import { useAuth } from '../../hooks/useAuth';
import ListingFeePaymentModal from '../../components/ListingFeePaymentModal';

interface ProductForm {
  title: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  imageUrl: string;
}

const categories = ['Cleansers', 'Moisturizers', 'Serums', 'Sunscreens', 'Treatments', 'Eye Care', 'Lip Care', 'Face Masks'];

interface SellerProductFormProps {
  isEdit?: boolean;
}

const SellerProductForm: React.FC<SellerProductFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { apiRequest } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductForm>({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [errors, setErrors] = useState<Partial<ProductForm>>({});
  const [dragging, setDragging] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [listingFeeId, setListingFeeId] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      getProduct(id).then((data: any) => {
        const p = data.product || data;
        setForm({
          title: p.title || '',
          description: p.description || '',
          price: String(p.price || ''),
          stock: String(p.stock || ''),
          category: p.category || '',
          imageUrl: p.imageUrl || '',
        });
        if (p.imageUrl) setImagePreview(p.imageUrl);
      }).catch(() => {
        // Prefill with mock data for demo
        setForm({
          title: 'Hydra-Glow Serum',
          description: 'Deep hydration vitamin C serum for radiant skin',
          price: '1299',
          stock: '45',
          category: 'Serums',
          imageUrl: '',
        });
      });
    }
  }, [isEdit, id]);

  const validate = (): boolean => {
    const e: Partial<ProductForm> = {};
    if (!form.title.trim()) e.title = 'Product name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Enter a valid stock quantity';
    if (!form.category) e.category = 'Select a category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // For edit mode, skip payment
    if (isEdit && id) {
      await updateProductDirectly();
      return;
    }

    // For new product, show payment modal
    setShowPaymentModal(true);
  };

  const updateProductDirectly = async () => {
    setLoading(true);
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      ...(form.imageUrl && { imageUrl: form.imageUrl }),
      ...(imagePreview && !form.imageUrl && { imageUrl: imagePreview }),
    };

    try {
      await apiRequest(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setToast({ type: 'success', msg: 'Product updated successfully!' });
      setTimeout(() => navigate('/seller/products'), 1500);
    } catch (err: any) {
      setToast({ type: 'error', msg: err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      listingFeeId: paymentData.listingFeeId,
      ...(form.imageUrl && { imageUrl: form.imageUrl }),
      ...(imagePreview && !form.imageUrl && { imageUrl: imagePreview }),
    };

    try {
      await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setToast({ type: 'success', msg: 'Product created successfully!' });
      setTimeout(() => navigate('/seller/products'), 1500);
    } catch (err: any) {
      setToast({ type: 'error', msg: err.message || 'Failed to create product' });
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
    }
  };

  const handleImageFile = (file: File) => {
    // Check file size (max 2MB for base64)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setToast({ 
        type: 'error', 
        msg: 'Image too large! Please use an image smaller than 2MB or paste an image URL instead.' 
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setForm(f => ({ ...f, imageUrl: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleImageFile(file);
  };

  const set = (field: keyof ProductForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: undefined }));
  };

  const inputClass = (field: keyof ProductForm) =>
    `w-full px-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400
    ${errors[field] ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-600'}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-white text-sm font-medium transition-all
          ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Product Information
          </h3>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g., Vitamin C Brightening Serum"
              className={inputClass('title')}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={4}
              placeholder="Describe the product's key features, ingredients, benefits..."
              className={`${inputClass('description')} resize-none`}
            />
            <p className="text-xs text-gray-400 mt-1">{form.description.length} / 500 characters</p>
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            Pricing & Inventory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={set('price')}
                  placeholder="0.00"
                  className={`${inputClass('price')} pl-8`}
                />
              </div>
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={set('stock')}
                placeholder="0"
                className={inputClass('stock')}
              />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={set('category')}
                  className={`${inputClass('category')} appearance-none pr-8`}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            Product Image
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 h-44 rounded-xl border-2 border-dashed cursor-pointer transition-all
                ${dragging
                  ? 'border-primary bg-pink-50 dark:bg-pink-900/20 scale-[1.01]'
                  : 'border-gray-200 dark:border-slate-600 hover:border-primary/50 hover:bg-pink-50/30 dark:hover:bg-pink-900/10'
                }`}
            >
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Click or drag image here</p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 2MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                }}
              />
            </div>

            {/* Preview or URL Input */}
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative h-44 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(''); setForm(f => ({ ...f, imageUrl: '' })); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="h-44 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                  <p className="text-xs text-gray-400">No image selected</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Or paste image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={e => {
                    set('imageUrl')(e);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className={inputClass('imageUrl')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEdit ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>

      {/* Listing Fee Payment Modal */}
      {showPaymentModal && (
        <ListingFeePaymentModal
          productPrice={Number(form.price)}
          quantity={Number(form.stock)}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default SellerProductForm;
