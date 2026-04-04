import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function DermatologistDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, Dr. {user?.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your dermatology practice and consultations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Consultations</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-2xl">👩‍⚕️</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-green-600 text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Month Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹45,200</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/dermatologist/consultations"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-2xl">📅</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Consultations</h3>
                <p className="text-gray-600 text-sm">View and manage your appointments</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/dermatologist/patients"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-green-600 text-2xl">👤</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Patient Records</h3>
                <p className="text-gray-600 text-sm">Access patient history and records</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/dermatologist/profile"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-2xl">⚙️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Profile Settings</h3>
                <p className="text-gray-600 text-sm">Update your professional profile</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Consultations</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { patient: 'Sarah Johnson', time: '2:30 PM', condition: 'Acne Treatment Follow-up', status: 'Completed' },
                { patient: 'Mike Chen', time: '3:15 PM', condition: 'Skin Assessment', status: 'In Progress' },
                { patient: 'Emma Davis', time: '4:00 PM', condition: 'Eczema Consultation', status: 'Scheduled' },
              ].map((consultation, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {consultation.patient.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{consultation.patient}</p>
                      <p className="text-sm text-gray-600">{consultation.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{consultation.time}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      consultation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      consultation.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {consultation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}