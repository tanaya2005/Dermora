import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  dermatologistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    default: 30,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled',
  },
  sessionType: {
    type: String,
    enum: ['video', 'chat', 'phone'],
    default: 'video',
  },
  concerns: [String],
  notes: String,
  prescription: String,
  sessionFee: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentDate: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: String,
}, {
  timestamps: true,
});

// Index for faster queries
consultationSchema.index({ dermatologistId: 1, sessionDate: -1 });
consultationSchema.index({ customerId: 1, sessionDate: -1 });
consultationSchema.index({ status: 1 });

export default mongoose.model('Consultation', consultationSchema);
