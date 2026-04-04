import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, BarChart3 } from 'lucide-react';
import { apiClient } from '../lib/api-client';
import AdFormModal from '../components/AdFormModal';

interface Advertisement {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  targetAudience: string;
  priority: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  clickCount: number;
  impressionCount: number;
  createdAt: string;
}

const AdminAdvertisementsPage: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/advertisements/all');
      if (response.data.success) {
        setAdvertisements(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;
    
    try {
      await apiClient.delete(`/advertisements/${adId}`);
      setAdvertisements(prev => prev.filter(ad => ad._id !== adId));
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all': return 'bg-blue-100 text-blue-800';
      case 'signed_in': return 'bg-green-100 text-green-800';
      case 'guest': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Advertisement Management</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Manage your advertising campaigns and track performance</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Advertisement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Total Ads</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{advertisements.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Active Ads</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {advertisements.filter(ad => ad.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Total Impressions</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {advertisements.reduce((sum, ad) => sum + ad.impressionCount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Total Clicks</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {advertisements.reduce((sum, ad) => sum + ad.clickCount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Advertisements Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Advertisement
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Audience
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {advertisements.map((ad) => (
                <tr key={ad._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/48x48/e2e8f0/64748b?text=Ad';
                        }}
                      />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{ad.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                          {ad.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAudienceColor(ad.targetAudience)}`}>
                      {ad.targetAudience.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{ad.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-slate-900 dark:text-white">{ad.impressionCount.toLocaleString()} views</p>
                      <p className="text-slate-500 dark:text-slate-400">{ad.clickCount.toLocaleString()} clicks</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ad.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ad.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    {formatDate(ad.endDate)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingAd(ad)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {advertisements.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <BarChart3 className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No advertisements yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first advertisement to start generating revenue.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            Create Advertisement
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AdFormModal
        isOpen={showCreateModal || !!editingAd}
        onClose={() => {
          setShowCreateModal(false);
          setEditingAd(null);
        }}
        advertisement={editingAd}
        onSave={fetchAdvertisements}
      />
    </div>
  );
};

export default AdminAdvertisementsPage;