import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Lock,
  Camera,
  CheckCircle,
  AlertCircle,
  X,
  Shield,
  Bell,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SellerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Seller Name',
    email: user?.email || 'seller@example.com',
    phone: '+91 98765 43210',
    bio: 'Passionate about clean, science-backed skincare. Curating the best formulations for all skin types.',
    storeName: 'Dermora Organics',
    location: 'Mumbai, India',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [pwdError, setPwdError] = useState('');
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newMessages: true,
    promotions: false,
    weeklyReport: true,
  });

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulate API
    setSaving(false);
    showToast('success', 'Profile updated successfully!');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    if (passwordForm.newPass.length < 8) {
      setPwdError('Password must be at least 8 characters');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPwdError('Passwords do not match');
      return;
    }
    setPwdLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setPwdLoading(false);
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    showToast('success', 'Password changed successfully!');
  };

  const inputClass = "w-full px-4 py-3 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400";

  return (
    <div className="max-w-3xl mx-auto space-y-7">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-white text-sm font-medium
          ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.msg}
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center overflow-hidden shadow-lg">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-3xl font-bold">
                  {profileForm.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profileForm.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{profileForm.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-primary text-xs font-semibold rounded-full">
                <Shield className="w-3 h-3" /> Verified Seller
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
                {profileForm.storeName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-primary" />
          Personal Information
        </h3>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Store Name</label>
              <input
                type="text"
                value={profileForm.storeName}
                onChange={e => setProfileForm(f => ({ ...f, storeName: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location</label>
              <input
                type="text"
                value={profileForm.location}
                onChange={e => setProfileForm(f => ({ ...f, location: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Store Bio</label>
            <textarea
              value={profileForm.bio}
              onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Tell customers about your store..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-primary" />
          Change Password
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {['current', 'newPass', 'confirm'].map((field, i) => {
            const labels = ['Current Password', 'New Password', 'Confirm New Password'];
            const placeholders = ['Enter current password', 'Min.  8 characters', 'Re-enter new password'];
            const shown = showPwd[field as keyof typeof showPwd];
            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{labels[i]}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={shown ? 'text' : 'password'}
                    value={passwordForm[field as keyof typeof passwordForm]}
                    onChange={e => setPasswordForm(f => ({ ...f, [field]: e.target.value }))}
                    placeholder={placeholders[i]}
                    className={`${inputClass} pl-10 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(s => ({ ...s, [field]: !s[field as keyof typeof s] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}

          {pwdError && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {pwdError}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pwdLoading}
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {pwdLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Changing...</>
              ) : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-pink-100/50 dark:border-slate-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-primary" />
          Notification Preferences
        </h3>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => {
            const labels: Record<string, string> = {
              orderUpdates: 'Order Updates',
              newMessages: 'New Messages',
              promotions: 'Promotions & Offers',
              weeklyReport: 'Weekly Sales Report',
            };
            const descs: Record<string, string> = {
              orderUpdates: 'Get notified when your orders are updated',
              newMessages: 'Receive notifications for new buyer messages',
              promotions: 'Stay informed about platform promotions',
              weeklyReport: 'Receive weekly summary of your store performance',
            };
            return (
              <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 dark:border-slate-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{labels[key]}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{descs[key]}</p>
                </div>
                <button
                  onClick={() => setNotifications(n => ({ ...n, [key]: !value }))}
                  className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-primary' : 'bg-gray-200 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SellerProfilePage;
