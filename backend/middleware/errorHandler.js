const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Multer errors - provide exact error messages as required
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Resume file size exceeds 10MB limit';
    error = { message, statusCode: 400 };
  }

  if (err.message === 'Only PDF files are allowed') {
    const message = 'Only PDF resume files are allowed';
    error = { message, statusCode: 400 };
  }

  // File type validation
  if (err.message && err.message.includes('Only PDF files')) {
    const message = 'Only PDF resume files are allowed';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;