const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  paper_name: {
    type: String,
    required: [true, 'Please provide a paper title'],
    maxlength: [200, 'Paper title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  document_submission: {
    type: String,
    required: true
  },
  original_filename: {
    type: String,
    required: true
  },
  cloudinary_public_id: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['submitted', 'reviewed', 'revised'],
    default: 'submitted'
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  },
  reviewed_at: {
    type: Date,
    default: null
  },
  reviewed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
DocumentSchema.index({ user_id: 1, uploaded_at: -1 });

module.exports = mongoose.model('Document', DocumentSchema);