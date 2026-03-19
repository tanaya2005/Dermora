import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRoleIndicator } from '../components/UserRoleIndicator';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h1>
          <Link to="/login" className="text-primary hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case 'ADMIN':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  to="/admin" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="font-medium">Manage Users</h3>
                  <p className="text-sm text-gray-600">View and manage all users</p>
                </Link>
                <Link 
                  to="/admin/inventory" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">📦</div>
                  <h3 className="font-medium">Inventory</h3>
                  <p className="text-sm text-gray-600">Manage all products</p>
                </Link>
                <Link 
                  to="/admin/orders" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="font-medium">All Orders</h3>
                  <p className="text-sm text-gray-600">View all platform orders</p>
                </Link>
              </div>
            </div>
          </div>
        );

      case 'SELLER':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Seller Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  to="/seller/dashboard" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">🏪</div>
                  <h3 className="font-medium">My Store</h3>
                  <p className="text-sm text-gray-600">Manage your products</p>
                </Link>
                <Link 
                  to="/orders" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">📦</div>
                  <h3 className="font-medium">My Orders</h3>
                  <p className="text-sm text-gray-600">Track your sales</p>
                </Link>
              </div>
            </div>
          </div>
        );

      case 'BUYER':
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shopping Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  to="/products" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">🛍️</div>
                  <h3 className="font-medium">Shop Products</h3>
                  <p className="text-sm text-gray-600">Browse skincare products</p>
                </Link>
                <Link 
                  to="/cart" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">🛒</div>
                  <h3 className="font-medium">My Cart</h3>
                  <p className="text-sm text-gray-600">View cart items</p>
                </Link>
                <Link 
                  to="/orders" 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="font-medium">My Orders</h3>
                  <p className="text-sm text-gray-600">Track your purchases</p>
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to your Dashboard
              </h1>
              <UserRoleIndicator user={user} size="lg" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        {getDashboardContent()}

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/assessment" 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Take Skin Assessment
            </Link>
            <Link 
              to="/consult" 
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Consult Dermatologist
            </Link>
            <Link 
              to="/subscriptions" 
              className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              View Subscriptions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;