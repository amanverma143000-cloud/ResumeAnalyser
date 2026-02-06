import React from 'react';
import { formatDate, truncateText, getInitials } from '../utils/helpers';

const ResumeCard = ({ resume, showDetails = false }) => {
  const {
    name,
    email,
    phone,
    role,
    summary,
    education,
    uploadDate,
    fileName
  } = resume;

  return (
    <div className="resume-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
            {getInitials(name)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{email}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{formatDate(uploadDate)}</p>
          {fileName && (
            <p className="text-xs text-gray-400 mt-1">{truncateText(fileName, 20)}</p>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {phone && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm text-gray-700">{phone}</span>
          </div>
        )}
        
        {role && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            <span className="text-sm text-gray-700">{truncateText(role, 30)}</span>
          </div>
        )}
      </div>

      {/* Education */}
      {education && (
        <div className="mb-4">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">Education</p>
              <p className="text-sm text-gray-600">{truncateText(education, showDetails ? 200 : 80)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && showDetails && (
        <div className="mb-4">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">Professional Summary</p>
              <p className="text-sm text-gray-600">{summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="flex justify-between items-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✓ Analyzed
        </span>
        
        {!showDetails && summary && (
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeCard;