import React, { useEffect, useState, useCallback } from 'react';
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
  
    totalResumes,
    dispatch 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResumes, setFilteredResumes] = useState([]);

  // ✅ FIX: useCallback use kiya
  const fetchResumeHistory = useCallback(async (page = 1) => {
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
  }, [dispatch]);

  // ✅ FIX: dependency add ki
  useEffect(() => {
    fetchResumeHistory(currentPage);
  }, [currentPage, fetchResumeHistory]);

  useEffect(() => {
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
          
          <Link to="/" className="btn-primary mt-4 sm:mt-0 inline-flex items-center">
            Upload New Resume
          </Link>
        </div>

        {error && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {resumeHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {filteredResumes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredResumes.map((resume) => (
              <ResumeCard key={resume._id} resume={resume} />
            ))}
          </div>
        ) : (
          <div className="text-center">No Data Found</div>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;