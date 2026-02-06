import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ResumeCard from '../components/ResumeCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { resumeAPI } from '../utils/api';
import { useApp, actionTypes } from '../context/AppContext';

const HistoryPage = () => {
  const { 
    loading, 
    resumeHistory, 
    error, 
    currentPage, 
    totalPages, 
    totalResumes,
    dispatch 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResumes, setFilteredResumes] = useState([]);

  useEffect(() => {
    fetchResumeHistory();
  }, [currentPage]);

  useEffect(() => {
    // Filter resumes based on search term
    if (searchTerm.trim() === '') {
      setFilteredResumes(resumeHistory);
    } else {
      const filtered = resumeHistory.filter(resume =>
        resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resume.role && resume.role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredResumes(filtered);
    }
  }, [resumeHistory, searchTerm]);

  const fetchResumeHistory = async (page = 1) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    
    try {
      const response = await resumeAPI.getResumeHistory(page, 10);
      
      dispatch({ 
        type: actionTypes.SET_RESUME_HISTORY, 
        payload: response.data 
      });
      
      dispatch({
        type: actionTypes.SET_PAGINATION,
        payload: {
          page: response.page,
          pages: response.pages,
          total: response.total
        }
      });
      
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch resume history';
      dispatch({ 
        type: actionTypes.SET_ERROR, 
        payload: errorMessage 
      });
      toast.error(errorMessage);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchResumeHistory(page);
    }
  };

  const handleRetry = () => {
    fetchResumeHistory(currentPage);
  };

  if (loading && resumeHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading message="Loading resume history..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Resume History
            </h1>
            <p className="text-gray-600">
              {totalResumes > 0 
                ? `${totalResumes} resume${totalResumes !== 1 ? 's' : ''} analyzed`
                : 'No resumes uploaded yet'
              }
            </p>
          </div>
          
          <Link
            to="/"
            className="btn-primary mt-4 sm:mt-0 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload New Resume
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={handleRetry}
          />
        )}

        {/* Search Bar */}
        {resumeHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Resume Grid */}
        {filteredResumes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredResumes.map((resume) => (
              <ResumeCard 
                key={resume._id} 
                resume={resume}
                showDetails={false}
              />
            ))}
          </div>
        ) : resumeHistory.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        ) : !loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">
              Upload your first resume to get started with AI-powered analysis.
            </p>
            <Link to="/" className="btn-primary">
              Upload Resume
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-md">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing page {currentPage} of {totalPages}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      pageNum === currentPage
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Loading overlay for pagination */}
        {loading && resumeHistory.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <Loading message="Loading..." size="sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;