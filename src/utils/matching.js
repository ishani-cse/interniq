import { extractSkills } from './skills'

// ---------- Job vs. skills ----------
export function scoreRequired(required, skills) {
  const have = new Set(skills)
  const matched = required.filter((s) => have.has(s))
  const missing = required.filter((s) => !have.has(s))
  const score = required.length
    ? Math.round((matched.length / required.length) * 100)
    : null
  return { matched, missing, score }
}

export const requiredSkillsOf = (job) =>
  extractSkills(`${job.title} ${job.description}`)

export function topMissing(jobs, n = 3) {
  const map = {}
  jobs.forEach((j) => {
    j.missing.forEach((s) => {
      map[s] = map[s] || { skill: s, jobs: 0, gain: 0 }
      map[s].jobs += 1
      map[s].gain += 100 / j.required.length
    })
  })
  return Object.values(map)
    .map((m) => ({ ...m, avgGain: Math.round(m.gain / jobs.length) }))
    .sort((a, b) => b.gain - a.gain)
    .slice(0, n)
}

// ---------- Career paths ----------
export const ROLES = [
  { id: 'frontend', title: 'Frontend Developer', query: 'frontend developer intern',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'TypeScript'] },
  { id: 'react', title: 'React Developer', query: 'react developer intern',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'REST API'] },
  { id: 'backend', title: 'Backend Developer', query: 'backend developer intern',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'SQL', 'REST API', 'Git'] },
  { id: 'fullstack', title: 'Full Stack Developer', query: 'full stack developer intern',
    skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST API', 'Git'] },
  { id: 'web', title: 'Web Developer', query: 'web developer intern',
    skills: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Git', 'Bootstrap'] },
  { id: 'sde', title: 'Software Developer', query: 'software developer intern',
    skills: ['DSA', 'OOP', 'DBMS', 'SQL', 'Git', 'Docker'] },
  { id: 'python', title: 'Python Developer', query: 'python developer intern',
    skills: ['Python', 'SQL', 'Git', 'Django', 'REST API'] },
  { id: 'ml', title: 'AI / ML Engineer', query: 'machine learning intern',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy'] },
  { id: 'data', title: 'Data Analyst', query: 'data analyst intern',
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Pandas'] },
]

export const READY = 80

export function roleReadiness(role, skills) {
  const have = new Set(skills)
  const matched = role.skills.filter((s) => have.has(s))
  const missing = role.skills.filter((s) => !have.has(s))
  const score = Math.round((matched.length / role.skills.length) * 100)
  return { ...role, matched, missing, score }
}

export const rankRoles = (skills) =>
  ROLES.map((r) => roleReadiness(r, skills)).sort((a, b) => b.score - a.score)

// Which single skill improves the most roles if learned next
export function quickWins(skills, n = 3) {
  const base = rankRoles(skills)
  const candidates = new Set(base.flatMap((r) => r.missing))
  return [...candidates]
    .map((skill) => {
      const after = rankRoles([...skills, skill])
      const changed = after
        .map((r) => ({ title: r.title, from: base.find((x) => x.id === r.id).score, to: r.score }))
        .filter((r) => r.to > r.from)
      return {
        skill,
        roles: changed,
        perfect: changed.filter((r) => r.to === 100).map((r) => r.title),
      }
    })
    .sort((a, b) => b.perfect.length - a.perfect.length || b.roles.length - a.roles.length)
    .slice(0, n)
}

// Search keywords: best-fit roles first, broad keyword last
export const buildQueries = (skills) => {
  const top = rankRoles(skills).filter((r) => r.score > 0).slice(0, 2)
  return [...new Set([...top.map((r) => r.query), 'software intern'])]
}