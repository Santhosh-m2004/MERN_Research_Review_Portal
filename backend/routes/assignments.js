const express = require('express');
const {
  getAssignments,
  createAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAssignments);
router.post('/', authorize('admin'), createAssignment);
router.delete('/:id', authorize('admin'), deleteAssignment);

module.exports = router;