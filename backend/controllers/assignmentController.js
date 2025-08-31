const Assignment = require('../models/Assignment');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = async (req, res, next) => {
  try {
    let filter = {};
    
    // For teachers, only show their assignments
    if (req.user.role === 'teacher') {
      filter.teacher_id = req.user.id;
    } 
    // For students, only show their assignments
    else if (req.user.role === 'student') {
      filter.student_id = req.user.id;
    }
    
    const assignments = await Assignment.find(filter)
      .populate('teacher_id', 'full_name username email')
      .populate('student_id', 'full_name username email');
    
    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private/Admin
exports.createAssignment = async (req, res, next) => {
  try {
    // Only admins can create assignments
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create assignments',
      });
    }
    
    const { teacher_id, student_id } = req.body;
    
    // Check if assignment already exists
    const existingAssignment = await Assignment.findOne({
      teacher_id,
      student_id,
    });
    
    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: 'This student is already assigned to this teacher',
      });
    }
    
    const assignment = await Assignment.create({
      teacher_id,
      student_id,
      assigned_by: req.user.id,
      assigned_at: Date.now(),
    });
    
    // Populate the assignment with user details
    await assignment.populate('teacher_id', 'full_name username email');
    await assignment.populate('student_id', 'full_name username email');
    
    // Add notifications to teacher and student
    await Notification.create({
      user_id: teacher_id,
      message: `You have been assigned to student ${assignment.student_id.full_name}`,
      category: 'info',
    });
    
    await Notification.create({
      user_id: student_id,
      message: `You have been assigned to teacher ${assignment.teacher_id.full_name}`,
      category: 'info',
    });
    
    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Admin
exports.deleteAssignment = async (req, res, next) => {
  try {
    // Only admins can delete assignments
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete assignments',
      });
    }
    
    const assignment = await Assignment.findById(req.params.id)
      .populate('teacher_id', 'full_name')
      .populate('student_id', 'full_name');
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }
    
    await Assignment.findByIdAndDelete(req.params.id);
    
    // Add notifications to teacher and student
    await Notification.create({
      user_id: assignment.teacher_id._id,
      message: `Your assignment with student ${assignment.student_id.full_name} has been removed`,
      category: 'info',
    });
    
    await Notification.create({
      user_id: assignment.student_id._id,
      message: `Your assignment with teacher ${assignment.teacher_id.full_name} has been removed`,
      category: 'info',
    });
    
    res.status(200).json({
      success: true,
      message: 'Assignment removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};