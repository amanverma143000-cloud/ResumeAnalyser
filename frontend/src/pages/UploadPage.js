import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FileUpload from '../components/FileUpload';
import ResumeCard from '../components/ResumeCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { resumeAPI } from '../utils/api';
import { useApp, actionTypes } from '../context/AppContext';

const UploadPage = () => {
  const navigate = useNavigate();
  const { loading, uploadedResume, error, dispatch } = useApp();
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = async (file, validationError = null) => {
    // Clear previous errors
    setUploadError(null);
    dispatch({ type: actionTypes.CLEAR_ERROR });

    // Handle validation errors from FileUpload component
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    // If no file provided (validation failed), return
    if (!file) {
      return;
    }

    // Start upload
    dispatch({ type: actionTypes.SET_LOADING, payload: true });

    try {
      const response = await resumeAPI.uploadResume(file);
      
      dispatch({ 
        type: actionTypes.SET_UPLOADED_RESUME, 
        payload: response.data 
      });
      
      toast.success('Resume uploaded and analyzed successfully!');
      
    } catch (error) {
      const errorMessage = error.message || 'Failed to upload resume';
      setUploadError(errorMessage);
      dispatch({ 
        type: actionTypes.SET_ERROR, 
        payload: errorMessage 
      });
      toast.error(errorMessage);
    }
  };

  const handleRetry = () => {
    setUploadError(null);
    dispatch({ type: actionTypes.CLEAR_ERROR });
    dispatch({ type: actionTypes.SET_UPLOADED_RESUME, payload: null });
  };

  const goToHistory = () => {
    navigate('/history');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Resume Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your PDF resume and get instant AI-powered analysis. 
            Extract key information including contact details, education, and professional summary.
          </p>
        </div>

        {/* Upload Section */}
        {!uploadedResume && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Upload Your Resume
            </h2>
            
            <FileUpload
              onFileSelect={handleFileSelect}
              loading={loading}
              error={uploadError}
            />

            {loading && (
              <div className="mt-6">
                <Loading message="Processing resume with AI... This may take a few moments." />
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && !loading && (
          <ErrorMessage 
            message={error} 
            onRetry={handleRetry}
          />
        )}

        {/* Results Section */}
        {uploadedResume && !loading && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Analysis Results
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={handleRetry}
                    className="btn-secondary"
                  >
                    Upload Another
                  </button>
                  <button
                    onClick={goToHistory}
                    className="btn-primary"
                  >
                    View History
                  </button>
                </div>
              </div>
              
              <ResumeCard 
                resume={uploadedResume} 
                showDetails={true}
              />
            </div>

            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-800">
                  Resume successfully analyzed and saved to your history.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!uploadedResume && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What We Extract
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: '👤', title: 'Personal Info', desc: 'Name, email, phone number' },
                { icon: '💼', title: 'Professional Role', desc: 'Job title and position' },
                { icon: '🎓', title: 'Education', desc: 'Academic background and qualifications' },
                { icon: '📝', title: 'Summary', desc: 'Professional summary and objectives' },
                { icon: '🔍', title: 'AI Analysis', desc: 'Advanced NLP-powered parsing' },
                { icon: '✅', title: 'Validation', desc: 'Ensures all required fields are present' }
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;