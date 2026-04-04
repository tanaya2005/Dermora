import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiClient } from '../lib/api-client';

interface Advertisement {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  targetAudience: string;
  priority: number;
  isActive: boolean;
  endDate: string;
}

interface AdFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  advertisement?: Advertisement | null;
  onSave: () => void;
}

const AdFormModal: React.FC<AdFormModalProps> = ({ isOpen, onClose, advertisement, onSave }) => {
  const [formData, setFormData] = useState<Advertisement>({
    title: '',
    description: '',
    imageUrl: '',
    redirectUrl: '',
    targetAudience: 'all',
    priority: 5,
    isActive: true,
    endDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (advertisement) {
      setFormData({
        ...advertisement,
        endDate: new Date(advertisement.endDate).toISOString().split('T')[0]
      });
    } else {
      // Set default end date to 30 days from now
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        endDate: defaultEndDate.toISOString().split('T')[0]
      }));
    }
  }, [advertisement]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    if (!formData.redirectUrl.trim()) newErrors.redirectUrl = 'Redirect URL is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    // Validate end date is in the future
    if (formData.endDate && new Date(formData.endDate) <= new Date()) {
      newErrors.endDate = 'End date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        endDate: new Date(formData.endDate).toISOString()
      };

      if (advertisement?._id) {
        // Update existing advertisement
        await apiClient.put(`/advertisements/${advertisement._id}`, submitData);
      } else {
        // Create new advertisement
        await apiClient.post('/advertisements', submitData);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving advertisement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {advertisement ? 'Edit Advertisement' : 'Create Advertisement'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.title ? 'border-red-300' : 'border-slate-300 dark:border-slate-600'
              } dark:bg-slate-700 dark:text-white`}
              placeholder="Enter advertisement title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.description ? 'border-red-300' : 'border-slate-300 dark:border-slate-600'
              } dark:bg-slate-700 dark:text-white`}
              placeholder="Enter advertisement description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.imageUrl ? 'border-red-300' : 'border-slate-300 dark:border-slate-600'
              } dark:bg-slate-700 dark:text-white`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
          </div>

          {/* Redirect URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Redirect URL *
            </label>
            <input
              type="url"
              name="redirectUrl"
              value={formData.redirectUrl}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.redirectUrl ? 'border-red-300' : 'border-slate-300 dark:border-slate-600'
              } dark:bg-slate-700 dark:text-white`}
              placeholder="/products or https://external-site.com"
            />
            {errors.redirectUrl && <p className="text-red-500 text-sm mt-1">{errors.redirectUrl}</p>}
          </div>

          {/* Target Audience & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Target Audience
              </label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Users</option>
                <option value="signed_in">Signed In Users</option>
                <option value="guest">Guest Users</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Priority (1-10)
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* End Date & Active Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.endDate ? 'border-red-300' : 'border-slate-300 dark:border-slate-600'
                } dark:bg-slate-700 dark:text-white`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Active Advertisement
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : advertisement ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdFormModal;