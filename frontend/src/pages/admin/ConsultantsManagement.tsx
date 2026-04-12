import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Consultant {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  stats: {
    totalSessions: number;
    completedSessions: number;
    scheduledSessions: number;
    cancelledSessions: number;
    totalEarnings: number;
    paidAmount: number;
    pendingAmount: number;
    averageRating: number;
    totalRatings: number;
  };
}

interface Session {
  _id: string;
  sessionDate: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  sessionType: string;
  sessionFee: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  customerId: {
    name: string;
    email: string;
  };
  rating?: number;
}

interface Stats {
  totalConsultants: number;
  activeConsultants: number;
  totalSessions: number;
  completedSessions: number;
  scheduledSessions: number;
  totalEarnings: number;
  paidAmount: number;
  pendingPayouts: number;
}

export const ConsultantsManagement: React.FC = () => {
  const { apiRequest } = useAuth();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [consultantsRes, statsRes] = await Promise.all([
        apiRequest('/api/admin/consultants'),
        apiRequest('/api/admin/consultants/stats'),
      ]);
      setConsultants(consultantsRes.consultants || []);
      setStats(statsRes.stats);
    } catch (error) {
      console.error('Error fetching consultants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultantSessions = async (consultantId: string) => {
    try {
      const response = await apiRequest(`/api/admin/consultants/${consultantId}/sessions`);
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleViewSessions = async (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    await fetchConsultantSessions(consultant._id);
    setShowSessionsModal(true);
  };

  const handleMarkPaid = async (sessionId: string) => {
    if (!selectedConsultant) return;
    
    try {
      await apiRequest(`/api/admin/consultants/${selectedConsultant._id}/payment/${sessionId}`, {
        method: 'PUT',
      });
      alert('Payment marked as paid!');
      await fetchConsultantSessions(selectedConsultant._id);
      fetchData(); // Refresh consultant stats
    } catch (error: any) {
      alert(error.message || 'Failed to mark payment');
    }
  };

  const handleBulkPayout = async () => {
    if (!selectedConsultant || selectedSessions.length === 0) {
      alert('Please select sessions to pay');
      return;
    }

    if (!confirm(`Process payout for ${selectedSessions.length} sessions?`)) return;

    try {
      const response = await apiRequest(`/api/admin/consultants/${selectedConsultant._id}/payout`, {
        method: 'POST',
        body: JSON.stringify({ sessionIds: selectedSessions }),
      });
      alert(`✅ Payout processed! Total: ₹${response.totalPayout.toLocaleString()}`);
      setSelectedSessions([]);
      await fetchConsultantSessions(selectedConsultant._id);
      fetchData();
    } catch (error: any) {
      alert(error.message || 'Failed to process payout');
    }
  };

  const filteredConsultants = consultants.filter(consultant =>
    consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      case 'no-show': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Consultants Management</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage dermatologists, track sessions, and process payments</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">medical_services</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalConsultants}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Total Consultants</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">event</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completedSessions}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Completed Sessions</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-violet-600 dark:text-violet-400">payments</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{(stats.totalEarnings / 1000).toFixed(1)}K</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Total Earnings</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">schedule</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">₹{(stats.pendingPayouts / 1000).toFixed(1)}K</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Pending Payouts</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search consultants by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsultants.map((consultant) => (
          <div key={consultant._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                    {consultant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{consultant.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{consultant.email}</p>
                </div>
              </div>
              {consultant.emailVerified && (
                <span className="material-symbols-outlined text-green-500 text-sm">verified</span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Sessions</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{consultant.stats.totalSessions}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">Completed</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{consultant.stats.completedSessions}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Scheduled</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{consultant.stats.scheduledSessions}</p>
              </div>
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3">
                <p className="text-xs text-violet-600 dark:text-violet-400 mb-1">Rating</p>
                <p className="text-xl font-bold text-violet-600 dark:text-violet-400">
                  {consultant.stats.averageRating > 0 ? consultant.stats.averageRating.toFixed(1) : 'N/A'}
                  {consultant.stats.averageRating > 0 && <span className="text-sm">★</span>}
                </p>
              </div>
            </div>

            {/* Earnings */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Earnings</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  ₹{consultant.stats.totalEarnings.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-600 dark:text-green-400">
                  Paid: ₹{consultant.stats.paidAmount.toLocaleString()}
                </span>
                <span className="text-amber-600 dark:text-amber-400">
                  Pending: ₹{consultant.stats.pendingAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => handleViewSessions(consultant)}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              View Sessions & Pay
            </button>
          </div>
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">person_off</span>
          <p className="text-slate-500 dark:text-slate-400">No consultants found</p>
        </div>
      )}

      {/* Sessions Modal */}
      {showSessionsModal && selectedConsultant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedConsultant.name}'s Sessions</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Pending: ₹{selectedConsultant.stats.pendingAmount.toLocaleString()} | 
                    Paid: ₹{selectedConsultant.stats.paidAmount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSessionsModal(false);
                    setSelectedSessions([]);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              {/* Bulk Actions */}
              {selectedSessions.length > 0 && (
                <div className="mt-4 flex items-center gap-3 bg-violet-50 dark:bg-violet-900/20 p-3 rounded-lg">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedSessions.length} session(s) selected
                  </span>
                  <button
                    onClick={handleBulkPayout}
                    className="ml-auto bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">payments</span>
                    Process Payout
                  </button>
                </div>
              )}
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox for pending completed sessions */}
                      {session.status === 'completed' && session.paymentStatus === 'pending' && (
                        <input
                          type="checkbox"
                          checked={selectedSessions.includes(session._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSessions([...selectedSessions, session._id]);
                            } else {
                              setSelectedSessions(selectedSessions.filter(id => id !== session._id));
                            }
                          }}
                          className="mt-1 w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                        />
                      )}

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{session.customerId.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{session.customerId.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900 dark:text-white">₹{session.sessionFee}</p>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              session.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {session.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {new Date(session.sessionDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {session.duration} min
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                          {session.rating && (
                            <span className="flex items-center gap-1 text-amber-600">
                              <span className="material-symbols-outlined text-sm">star</span>
                              {session.rating}
                            </span>
                          )}
                        </div>

                        {session.status === 'completed' && session.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handleMarkPaid(session._id)}
                            className="mt-3 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {sessions.length === 0 && (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">event_busy</span>
                    <p className="text-slate-500 dark:text-slate-400">No sessions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantsManagement;
