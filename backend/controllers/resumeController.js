const Resume = require('../models/Resume');
const resumeParser = require('../utils/resumeParser');

// @desc    Upload and analyze resume
// @route   POST /api/upload-resume
// @access  Public
const uploadResume = async (req, res, next) => {
  try {
    console.log('📤 Upload request received');
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF resume file'
      });
    }

    console.log('✅ File received:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Check file size (10MB max)
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 10MB limit'
      });
    }

    // Parse resume using Groq AI
    console.log('🤖 Parsing resume with Groq AI...');
    const parseResult = await resumeParser.parseResume(req.file.buffer);
    
    if (!parseResult.success) {
      console.log('❌ Parse failed:', parseResult.error);
      return res.status(400).json({
        success: false,
        error: parseResult.error,
        missingFields: parseResult.missingFields || []
      });
    }

    const resumeData = parseResult.data;
    console.log('✅ Parse successful:', resumeData);

    // userId sent from frontend localStorage — required for per-user history
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    // Save to database
    const resume = new Resume({
      name: resumeData.name,
      email: resumeData.email,
      phone: resumeData.phone,
      role: resumeData.role,
      summary: resumeData.summary,
      education: resumeData.education,
      fileName: req.file.originalname,
      userId
    });

    await resume.save();

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      data: {
        id: resume._id,
        name: resume.name,
        email: resume.email,
        phone: resume.phone,
        role: resume.role,
        summary: resume.summary,
        education: resume.education,
        uploadDate: resume.uploadDate
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
};

// @desc    Get resume upload history
// @route   GET /api/resume-history
// @access  Public
const getResumeHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter history to only this user's resumes
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const filter = { userId };

    const resumes = await Resume.find(filter)
      .select('name email role uploadDate fileName')
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resume.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: resumes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: resumes
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume details
// @route   GET /api/resume/:id
// @access  Public
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getResumeHistory,
  getResumeById
};