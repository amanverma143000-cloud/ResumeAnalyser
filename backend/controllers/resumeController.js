const Resume = require('../models/Resume');
const resumeParser = require('../utils/resumeParser');

// @desc    Upload and analyze resume
// @route   POST /api/upload-resume
// @access  Public
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF resume file'
      });
    }

    // Parse resume using enhanced AI/NLP logic
    const parseResult = await resumeParser.parseResume(req.file.buffer);
    
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to parse resume: ' + parseResult.error
      });
    }

    const extractedData = parseResult.data;

    // ROBUST 3-LAYER VALIDATION SYSTEM
    // Layer 1: AI extraction (already done)
    // Layer 2: Fallback text extraction for missing fields  
    // Layer 3: Final validation with enhanced data
    const robustValidation = resumeParser.validateRequiredFieldsRobust(extractedData, parseResult.rawText);
    
    if (!robustValidation.isValid) {
      const missingFieldsText = robustValidation.missingFields.map(field => {
        switch(field) {
          case 'name': return 'Name';
          case 'email': return 'Email';
          case 'education': return 'Education';
          default: return field;
        }
      }).join(', ');
      
      console.log('❌ Resume rejected - truly missing fields:', robustValidation.missingFields);
      
      return res.status(400).json({
        success: false,
        error: `This resume is not uploadable. Missing: ${missingFieldsText}`,
        missingFields: robustValidation.missingFields
      });
    }

    // Use enhanced data from robust validation (includes fallback extractions)
    const finalData = robustValidation.enhancedData;
    
    console.log('✅ Resume accepted - final data:', {
      name: finalData.name,
      email: finalData.email,
      education: finalData.education ? 'Present' : 'Missing'
    });

    // Save only valid resumes to database
    const resume = new Resume({
      name: finalData.name,
      email: finalData.email,
      phone: finalData.phone || null,
      role: finalData.role || null,
      summary: finalData.summary || null,
      education: finalData.education,
      fileName: req.file.originalname
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
    next(error);
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

    const resumes = await Resume.find()
      .select('name email role uploadDate fileName')
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resume.countDocuments();

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