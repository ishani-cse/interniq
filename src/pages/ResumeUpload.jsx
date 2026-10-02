import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Upload, FileText, CheckCircle, Zap, Eye, RefreshCw, AlertCircle } from 'lucide-react';

const ResumeUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { resume, uploadResume } = useResume();
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setLoading(true);
    const result = await uploadResume(file);
    setLoading(false);
    if (!result.ok) return setError(result.error);
    navigate('/internships');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>🏠</span>
              <span>Resume Upload</span>
            </div>

            {/* Shown only if the user was sent here from a locked page */}
            {state?.locked && !resume && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm font-medium">
                🔒 Please upload your resume to unlock Recommended Internships.
              </div>
            )}

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Build your profile with your resume</h1>
                <p className="text-gray-600">Upload your latest resume and let InternIQ extract your skills and match you with relevant internships.</p>
              </div>
              <div className="text-6xl opacity-20">📋✨</div>
            </div>

            {/* Main 2-Column Layout */}
            <div className="grid grid-cols-3 gap-6">

              {/* LEFT COLUMN */}
              <div className="col-span-2 space-y-6">

                {/* Drag & Drop Section */}
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <Upload size={32} className="text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Drag & drop your resume here</h3>
                  <p className="text-sm text-gray-600 mb-6">or choose a file from your computer</p>

                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(e) => {
                      handleFile(e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {loading ? 'Analyzing your resume...' : 'Choose Resume'}
                  </button>

                  {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
                  <p className="text-xs text-gray-500 mt-3">PDF or DOCX  •  Max 5 MB</p>
                </div>

                {/* Current Resume (visible only after upload) */}
                {resume && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle size={20} className="text-green-600" />
                      <h3 className="text-lg font-bold text-gray-900">Current Resume</h3>
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full ml-auto">Uploaded</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded">
                            <FileText size={20} className="text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{resume.fileName}</p>
                            <p className="text-xs text-gray-500">Uploaded {resume.uploadedOn}  •  {resume.size}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate('/internships')}
                        className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View Internships
                      </button>
                      <button
                        onClick={() => fileRef.current?.click()}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <RefreshCw size={16} />
                        Replace
                      </button>
                    </div>
                  </div>
                )}

                {/* Extracted skills (visible only after upload) */}
                {resume?.skills && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap size={20} className="text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Skills Detected ({resume.skills.length})
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((s) => (
                        <span key={s} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      These skills are used to calculate your match score for each internship.
                    </p>

                    <button
                      onClick={() => navigate('/internships')}
                      className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap size={16} />
                      View Matching Internships →
                    </button>
                  </div>
                )}

                {/* Why This Is Important */}
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                  <div className="flex gap-3">
                    <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Why is this important?</h4>
                      <p className="text-sm text-gray-700">
                        We extract the key skills from your resume and compare them with each internship's requirements. You get a match score for every role, along with the skills you are missing, so you know exactly what to improve.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN - Quick Tips */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  Quick Tips
                </h3>

                <div className="space-y-3">
                  {[
                    'Use a clear and professional format (PDF preferred).',
                    'Add a dedicated skills section so we can detect everything.',
                    'Use action verbs (e.g., built, developed, implemented).',
                    'Keep your resume concise (1 page is ideal).',
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-2.5">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeUpload;