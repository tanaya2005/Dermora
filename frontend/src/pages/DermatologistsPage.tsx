import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dermatologists, consultationBookings } from '../data/dermatologistData';
import { showToast } from '../lib/toast';

const DermatologistsPage: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    concern: '',
    notes: ''
  });

  const handleBookConsultation = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate booking ID
    const bookingId = `DERM-${Date.now().toString().slice(-6)}`;
    
    showToast.success(`Consultation booked successfully! Booking ID: ${bookingId}`);
    setShowBookingModal(false);
    setBookingForm({ date: '', time: '', concern: '', notes: '' });
  };

  const concerns = [
    'Acne Treatment',
    'Anti-Aging Consultation',
    'Sensitive Skin Issues',
    'Hyperpigmentation',
    'Eczema/Dermatitis',
    'Psoriasis',
    'Hair Loss',
    'Skin Cancer Screening',
    'General Skin Health',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-secondary dark:bg-primary">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-secondary py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-display font-bold mb-6">
              Consult with Certified Dermatologists
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Get personalized skincare advice from board-certified dermatologists. 
              Book online consultations and receive expert recommendations tailored to your skin needs.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">✅</span>
                <span>Board Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🩺</span>
                <span>Online Consultations</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⭐</span>
                <span>4.8+ Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dermatologists Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-6">
              Our Expert Dermatologists
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Choose from our panel of experienced dermatologists
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dermatologists.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                className="glass-card p-6 text-center hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                
                <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-2">
                  {doctor.name}
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {doctor.title}
                </p>
                
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                  {doctor.specialization}
                </p>
                
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <div className="text-2xl font-bold text-accent">₹{doctor.price}</div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold">{doctor.rating}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      ({doctor.reviews} reviews)
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <div>{doctor.experience} experience</div>
                  <div className="text-success font-medium">{doctor.availability}</div>
                </div>
                
                <button 
                  onClick={() => handleBookConsultation(doctor)}
                  className="btn-primary w-full"
                >
                  Book Consultation
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-secondary/30 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold text-primary dark:text-secondary mb-6">
              How Online Consultation Works
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Doctor',
                description: 'Select a dermatologist based on your specific skin concern',
                icon: '👩‍⚕️'
              },
              {
                step: '2',
                title: 'Book Appointment',
                description: 'Choose your preferred date and time slot',
                icon: '📅'
              },
              {
                step: '3',
                title: 'Video Consultation',
                description: 'Connect with your doctor via secure video call',
                icon: '💻'
              },
              {
                step: '4',
                title: 'Get Prescription',
                description: 'Receive personalized treatment plan and product recommendations',
                icon: '📋'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-6xl mb-4">{step.icon}</div>
                <div className="text-4xl font-bold text-accent/30 mb-2">{step.step}</div>
                <h3 className="text-xl font-semibold text-primary dark:text-secondary mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-primary dark:text-secondary">
                Book Consultation
              </h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            {selectedDoctor && (
              <div className="mb-6 p-4 bg-secondary/30 dark:bg-slate-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <img 
                    src={selectedDoctor.image} 
                    alt={selectedDoctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-primary dark:text-secondary">
                      {selectedDoctor.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedDoctor.specialization}
                    </div>
                    <div className="text-accent font-bold">₹{selectedDoctor.price}</div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-primary dark:text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Time
                </label>
                <select
                  required
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-primary dark:text-secondary"
                >
                  <option value="">Select Time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Main Concern
                </label>
                <select
                  required
                  value={bookingForm.concern}
                  onChange={(e) => setBookingForm({...bookingForm, concern: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-primary dark:text-secondary"
                >
                  <option value="">Select Concern</option>
                  {concerns.map((concern) => (
                    <option key={concern} value={concern}>{concern}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                  placeholder="Describe your skin concern in detail..."
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-primary dark:text-secondary resize-none"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Pay Now - ₹{selectedDoctor?.price}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DermatologistsPage;