import { createContext, useContext, useState, useEffect } from 'react'
import { extractSkills, SKILL_LIST } from '../utils/skills'

export { extractSkills, SKILL_LIST }

const ResumeContext = createContext(null)

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resume'))
    } catch {
      return null
    }
  })

  // Keep the resume saved across refreshes
  useEffect(() => {
    try {
      if (resume) localStorage.setItem('resume', JSON.stringify(resume))
      else localStorage.removeItem('resume')
    } catch {}
  }, [resume])

  // Uploads the file, extracts skills and saves them. Returns { ok, error }
  const uploadResume = async (file) => {
    if (!file) return { ok: false, error: 'No file selected.' }
    if (!/\.(pdf|docx)$/i.test(file.name)) {
      return { ok: false, error: 'Please upload a PDF or DOCX file.' }
    }
    if (file.size > 5 * 1024 * 1024) {
      return { ok: false, error: 'File size must be under 5 MB.' }
    }

    try {
      const form = new FormData()
      form.append('resume', file)
      const res = await fetch('/api/resume/parse', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok || !data.success) {
        return { ok: false, error: data.error || 'Could not read this resume.' }
      }

      const skills = extractSkills(data.text)
      if (!skills.length) {
        return {
          ok: false,
          error: 'No recognizable skills found. Please add a skills section to your resume.',
        }
      }

      setResume({
        fileName: file.name,
        uploadedOn: 'just now',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        skills,
      })
      return { ok: true }
    } catch {
      return { ok: false, error: 'Could not reach the server. Make sure the backend is running.' }
    }
  }

  const clearResume = () => setResume(null)

  return (
    <ResumeContext.Provider
      value={{
        resume,
        hasResume: !!resume?.skills?.length,
        uploadResume,
        setResume,
        clearResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
}