import React from 'react';
import type { User } from '../lib/auth-client';

interface UserRoleIndicatorProps {
  user: User;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const UserRoleIndicator: React.FC<UserRoleIndicatorProps> = ({ 
  user, 
  showName = true, 
  size = 'md' 
}) => {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: '👑',
          label: 'Admin'
        };
      case 'SELLER':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          icon: '🏪',
          label: 'Seller'
        };
      case 'DERMATOLOGIST':
        return {
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          icon: '👩‍⚕️',
          label: 'Dermatologist'
        };
      case 'BUYER':
      default:
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: '🛍️',
          label: 'Buyer'
        };
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const config = getRoleConfig(user.role);

  return (
    <div className="flex items-center gap-2">
      {showName && (
        <span className="font-medium text-slate-900 dark:text-white">
          {user.name}
        </span>
      )}
      <span className={`${config.color} ${sizeClasses[size]} rounded-full font-medium flex items-center gap-1`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    </div>
  );
};