const express = require('express');
const {
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentStats
} = require('../controllers/documentController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/', getDocuments);
router.get('/stats', authorize('admin'), getDocumentStats);
router.get('/:id', getDocument);
router.post('/', authorize('student'), upload.single('document_submission'), uploadDocument);
router.put('/:id', authorize('teacher'), updateDocument);
router.delete('/:id', deleteDocument);

module.exports = router;