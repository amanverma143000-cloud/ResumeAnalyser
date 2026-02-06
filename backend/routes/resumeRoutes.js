const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadResume,
  getResumeHistory,
  getResumeById
} = require('../controllers/resumeController');

// Resume routes
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.get('/resume-history', getResumeHistory);
router.get('/resume/:id', getResumeById);

module.exports = router;