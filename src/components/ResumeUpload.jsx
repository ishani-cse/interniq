import React, { useState } from 'react';

const ResumeUpload = () => {
  const [uploadedFile, setUploadedFile] = useState('Resume_2024.pdf');
  const [isUploaded, setIsUploaded] = useState(true);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Resume Upload</h3>
      
      {isUploaded ? (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{uploadedFile}</p>
              <p className="text-xs text-green-600">Uploaded successfully ✓</p>
            </div>
            <button 
              onClick={() => setIsUploaded(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-blue-100 rounded-xl p-8 flex flex-col items-center justify-center bg-blue-50/30 hover:bg-blue-50 transition-colors cursor-pointer"
             onClick={() => setIsUploaded(true)}>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">PDF, DOCX (Max 5MB)</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;