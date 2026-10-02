import { createContext, useContext, useState, useEffect } from 'react'

const SavedContext = createContext(null)

// Stable identity for a job (the numeric id can change between searches)
export const jobKey = (job) => job.applyUrl || `${job.company}::${job.title}`

export function SavedProvider({ children }) {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('savedInternships')) || []
    } catch {
      return []
    }
  })

  // Keep saved internships across page refreshes
  useEffect(() => {
    try {
      localStorage.setItem('savedInternships', JSON.stringify(saved))
    } catch {}
  }, [saved])

  const isSaved = (job) => saved.some((j) => j.key === jobKey(job))

  const toggleSave = (job) => {
    const key = jobKey(job)
    setSaved((prev) =>
      prev.some((j) => j.key === key)
        ? prev.filter((j) => j.key !== key)
        : [
            {
              key,
              savedAt: Date.now(),
              title: job.title,
              company: job.company,
              location: job.location,
              salary: job.salary,
              source: job.source,
              description: (job.description || '').slice(0, 600),
              applyUrl: job.applyUrl,
              logo: job.logo,
              required: job.required || [],
            },
            ...prev,
          ]
    )
  }

  const removeSaved = (key) =>
    setSaved((prev) => prev.filter((j) => j.key !== key))

  const clearSaved = () => setSaved([])

  return (
    <SavedContext.Provider
      value={{ saved, isSaved, toggleSave, removeSaved, clearSaved }}
    >
      {children}
    </SavedContext.Provider>
  )
}

export function useSaved() {
  const context = useContext(SavedContext)
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider')
  }
  return context
}