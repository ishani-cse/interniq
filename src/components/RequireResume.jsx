import { useRef, useState } from 'react'
import { Lock, Upload } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

export default function RequireResume({ children }) {
  const { hasResume, uploadResume } = useResume()
  const fileRef = useRef(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  if (hasResume) return children

  const handleFile = async (file) => {
    if (!file) return
    setError('')
    setLoading(true)
    const result = await uploadResume(file) // success = page unlocks automatically
    setLoading(false)
    if (!result.ok) setError(result.error)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 relative overflow-hidden">
          {/* Blurred background preview */}
          <div className="p-6 blur-sm pointer-events-none select-none" aria-hidden="true">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                  Internships Recommended For You ✨
                </h1>
                <p className="text-gray-600">
                  Based on your profile, skills and resume, here are the best internships for you.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-2/3 bg-gray-200 rounded" />
                        <div className="h-3 w-1/3 bg-gray-100 rounded" />
                      </div>
                      <div className="w-14 h-14 rounded-full bg-green-100" />
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-green-100 rounded" />
                      <div className="h-6 w-16 bg-red-100 rounded" />
                      <div className="h-6 w-16 bg-red-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lock card */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 p-6">
            <div
              className={`bg-white rounded-2xl shadow-2xl border p-8 max-w-md w-full text-center transition ${
                dragActive ? 'border-blue-500' : 'border-gray-100'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                handleFile(e.dataTransfer.files?.[0])
              }}
            >
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <Lock size={26} className="text-blue-600" />
              </div>

              <h2 className="text-xl font-extrabold text-gray-900 mb-2">
                Recommended Internships Locked
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Upload your resume to unlock personalized internship recommendations.
                We'll match you with opportunities based on your skills.
              </p>

              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => {
                  handleFile(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Upload size={18} />
                {loading ? 'Analyzing your resume...' : 'Upload Resume'}
              </button>

              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
              <p className="text-xs text-gray-500 mt-3">
                PDF or DOCX  •  Max 5 MB  •  or drag and drop your file here
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}