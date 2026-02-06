const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadResume,
  getResumeHistory,
  getResumeById
} = require('../controllers/resumeController');

// Resume routes with error handling
router.post('/upload-resume', (req, res, next) => {
  console.log('📤 Upload endpoint hit');
  upload.single('resume')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err.message);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    console.log('✅ Multer processed');
    next();
  });
}, uploadResume);

router.get('/resume-history', getResumeHistory);
router.get('/resume/:id', getResumeById);

module.exports = router;