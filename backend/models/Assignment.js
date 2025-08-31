const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assigned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assigned_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create a compound index to ensure unique teacher-student assignments
AssignmentSchema.index({ teacher_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);