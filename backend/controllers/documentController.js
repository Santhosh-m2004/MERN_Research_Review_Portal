const Document = require('../models/Document');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Assignment = require('../models/Assignment');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res, next) => {
  try {
    const { user, status, limit, sort, page = 1 } = req.query;
    let filter = {};
    
    // For teachers, only show documents from their assigned students
    if (req.user.role === 'teacher') {
      const assignments = await Assignment.find({ teacher_id: req.user.id });
      const studentIds = assignments.map(a => a.student_id.toString());
      filter.user_id = { $in: studentIds };
    } 
    // For students, only show their own documents
    else if (req.user.role === 'student') {
      filter.user_id = req.user.id;
    }
    
    if (user) {
      filter.user_id = user;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNum - 1) * pageSize;
    
    let query = Document.find(filter)
      .populate('user_id', 'full_name username email')
      .populate('reviewed_by', 'full_name username');
    
    if (limit) {
      query = query.limit(pageSize).skip(skip);
    }
    
    if (sort) {
      const sortBy = {};
      sortBy[sort.startsWith('-') ? sort.substring(1) : sort] = sort.startsWith('-') ? -1 : 1;
      query = query.sort(sortBy);
    } else {
      query = query.sort({ uploaded_at: -1 });
    }
    
    const documents = await query;
    const total = await Document.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: documents.length,
      total,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / pageSize)
      },
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('user_id', 'full_name username email')
      .populate('reviewed_by', 'full_name username');
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }
    
    // Check if user has access to this document
    if (req.user.role === 'student' && document.user_id._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document',
      });
    }
    
    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload document
// @route   POST /api/documents
// @access  Private/Student
exports.uploadDocument = async (req, res, next) => {
  try {
    // Only students can upload documents
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can upload documents',
      });
    }
    
    const { name, paper_name, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }
    
    // Check file size
    if (req.file.size > process.env.MAX_FILE_SIZE) {
      // Delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${process.env.MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }
    
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'research-portal',
      resource_type: 'auto',
    });
    
    // Delete the temporary file
    fs.unlinkSync(req.file.path);
    
    const document = await Document.create({
      user_id: req.user.id,
      name,
      paper_name,
      description,
      document_submission: result.secure_url,
      original_filename: req.file.originalname,
      cloudinary_public_id: result.public_id,
      status: 'submitted',
      uploaded_at: Date.now(),
    });
    
    // Populate the document with user info
    await document.populate('user_id', 'full_name username email');
    
    // Add notification
    await Notification.create({
      user_id: req.user.id,
      message: `Document "${paper_name}" uploaded successfully`,
      category: 'success',
    });
    
    // Notify assigned teacher if exists
    const assignment = await Assignment.findOne({ student_id: req.user.id });
    if (assignment) {
      await Notification.create({
        user_id: assignment.teacher_id,
        message: `Your student ${req.user.full_name} has uploaded a new document: "${paper_name}"`,
        category: 'info',
      });
    }
    
    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    // Delete the temporary file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update document (add feedback)
// @route   PUT /api/documents/:id
// @access  Private/Teacher
exports.updateDocument = async (req, res, next) => {
  try {
    // Only teachers can provide feedback
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Only teachers can provide feedback',
      });
    }
    
    const { feedback, status } = req.body;
    
    let document = await Document.findById(req.params.id)
      .populate('user_id', 'full_name username email');
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }
    
    // Check if teacher is assigned to this student
    const assignment = await Assignment.findOne({
      teacher_id: req.user.id,
      student_id: document.user_id._id,
    });
    
    if (!assignment && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this student',
      });
    }
    
    document = await Document.findByIdAndUpdate(
      req.params.id,
      {
        feedback,
        status,
        reviewed_at: Date.now(),
        reviewed_by: req.user.id,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('user_id', 'full_name username email')
     .populate('reviewed_by', 'full_name username');
    
    // Add notification to student
    await Notification.create({
      user_id: document.user_id._id,
      message: `Your document "${document.paper_name}" has been reviewed by your teacher`,
      category: 'info',
    });
    
    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }
    
    // Check if user owns the document or is admin
    if (req.user.role !== 'admin' && document.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this document',
      });
    }
    
    // Delete file from Cloudinary
    if (document.cloudinary_public_id) {
      await cloudinary.uploader.destroy(document.cloudinary_public_id);
    }
    
    await Document.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get document statistics
// @route   GET /api/documents/stats
// @access  Private/Admin
exports.getDocumentStats = async (req, res, next) => {
  try {
    const totalDocuments = await Document.countDocuments();
    const documentsWithFeedback = await Document.countDocuments({
      feedback: { $exists: true, $ne: null },
    });
    const documentsPendingFeedback = await Document.countDocuments({
      feedback: { $exists: false },
    });
    
    // Get documents by status
    const byStatus = await Document.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get documents by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const byMonth = await Document.aggregate([
      {
        $match: {
          uploaded_at: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$uploaded_at' },
            month: { $month: '$uploaded_at' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total_documents: totalDocuments,
        documents_with_feedback: documentsWithFeedback,
        documents_pending_feedback: documentsPendingFeedback,
        by_status: byStatus,
        by_month: byMonth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};