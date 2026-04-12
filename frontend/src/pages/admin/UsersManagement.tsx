import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'BUYER' | 'DERMATOLOGIST';
  emailVerified: boolean;
  createdAt: string;
  subscription?: {
    plan: string;
    isActive: boolean;
  };
  skinProfile?: {
    assessmentCompleted: boolean;
    skinType?: string;
  };
}

interface Stats {
  totalUsers: number;
  buyers: number;
  sellers: number;
  dermatologists: number;
  activeSubscriptions: number;
  completedAssessments: number;
}

export const UsersManagement: React.FC = () => {
  const { apiRequest } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    buyers: 0,
    sellers: 0,
    dermatologists: 0,
    activeSubscriptions: 0,
    completedAssessments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'BUYER' | 'SELLER' | 'DERMATOLOGIST'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/admin/users');
      setUsers(response.users || []);
      calculateStats(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (usersList: User[]) => {
    const stats = {
      totalUsers: usersList.length,
      buyers: usersList.filter(u => u.role === 'BUYER').length,
      sellers: usersList.filter(u => u.role === 'SELLER').length,
      dermatologists: usersList.filter(u => u.role === 'DERMATOLOGIST').length,
      activeSubscriptions: usersList.filter(u => u.subscription?.isActive).length,
      completedAssessments: usersList.filter(u => u.skinProfile?.assessmentCompleted).length,
    };
    setStats(stats);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    try {
      await apiRequest(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      alert('Role updated successfully!');
      fetchUsers();
    } catch (error: any) {
      alert(error.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await apiRequest(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error: any) {
      alert(error.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users
    .filter(user => filter === 'all' || user.role === filter)
    .filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'SELLER': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'DERMATOLOGIST': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-xl border border-primary/15 bg-white dark:bg-slate-800 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Users Management</h1>
        <p className="text-slate-600 dark:text-slate-400">Monitor and manage all users, sellers, and consultants</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">group</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">shopping_bag</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.buyers}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Buyers</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">store</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.sellers}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Sellers</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">medical_services</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.dermatologists}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Consultants</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-violet-600 dark:text-violet-400">card_membership</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeSubscriptions}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Active Subs</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">assignment_turned_in</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completedAssessments}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Assessments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            {['all', 'BUYER', 'SELLER', 'DERMATOLOGIST'].map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === role
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {role === 'all' ? 'All' : role === 'DERMATOLOGIST' ? 'Consultants' : role.charAt(0) + role.slice(1).toLowerCase() + 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role === 'DERMATOLOGIST' ? 'Consultant' : user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {user.emailVerified ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <span className="material-symbols-outlined text-sm">pending</span>
                          Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.subscription?.isActive ? (
                      <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                        {user.subscription.plan.toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="text-xs border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="BUYER">Buyer</option>
                        <option value="SELLER">Seller</option>
                        <option value="DERMATOLOGIST">Consultant</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">person_off</span>
            <p className="text-slate-500 dark:text-slate-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
