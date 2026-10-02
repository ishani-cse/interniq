import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Search, MapPin, Bookmark, ExternalLink, Sparkles, Plus, Check, X } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { useSaved } from '../context/SavedContext';
import { applyToInternship, getApplications } from '../components/applications';
import {
  scoreRequired,
  requiredSkillsOf,
  topMissing,
  buildQueries,
  rankRoles,
  quickWins,
  READY,
} from '../utils/matching';

const LOGO_COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-orange-100 text-orange-600',
  'bg-indigo-100 text-indigo-600',
];

const getInitials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

const getLogoColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % 997;
  return LOGO_COLORS[hash % LOGO_COLORS.length];
};

const shortText = (text, max = 200) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max) + '...' : clean;
};

const scoreColor = (s) => (s >= 70 ? '#16a34a' : s >= 40 ? '#f59e0b' : '#ef4444');

const statusOf = (score) =>
  score >= READY
    ? { label: 'Ready to apply', cls: 'bg-green-100 text-green-700' }
    : score >= 50
    ? { label: 'Almost there', cls: 'bg-amber-100 text-amber-700' }
    : { label: 'Build skills', cls: 'bg-gray-100 text-gray-600' };

// Unique id for a job (used to track applied jobs)
const jobId = (j) => j.applyUrl || `${j.company}::${j.title}`;

const InternshipsRecommended = () => {
  const { resume } = useResume();
  const { isSaved, toggleSave } = useSaved();
  const baseSkills = resume.skills;

  // Skills the user is "planning to learn" (what-if simulation)
  const [planned, setPlanned] = useState([]);
  const skills = useMemo(() => [...new Set([...baseSkills, ...planned])], [baseSkills, planned]);

  const togglePlanned = (s) =>
    setPlanned((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [autoMode, setAutoMode] = useState(true);
  const [label, setLabel] = useState('');
  const [rawJobs, setRawJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  // Applied tracking
  const [appliedIds, setAppliedIds] = useState(
    () => new Set(getApplications().map((a) => a.internshipId))
  );

  const handleApply = (job) => {
    const res = applyToInternship({
      id: jobId(job),
      title: job.title,
      company: job.company,
      location: job.location,
      duration: job.duration,
      salary: job.salary,
    });
    if (res.ok) {
      setAppliedIds((prev) => new Set(prev).add(jobId(job)));
    }
  };

  // Fetch jobs. Auto mode combines the best-fit role keywords until we have enough jobs.
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    const fetchJobs = async (q) => {
      const res = await fetch(`/api/recommendations?q=${encodeURIComponent(q)}&location=India`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Request failed');
      return data.jobs;
    };

    (async () => {
      try {
        const candidates = autoMode ? buildQueries(baseSkills) : [query];
        const seen = new Set();
        const all = [];
        const used = [];
        let lastError = null;

        for (const q of candidates) {
          try {
            const jobs = await fetchJobs(q);
            if (ignore) return;
            used.push(q);
            jobs.forEach((j) => {
              const key = j.applyUrl || `${j.company}::${j.title}`;
              if (!seen.has(key)) {
                seen.add(key);
                all.push(j);
              }
            });
          } catch (e) {
            lastError = e;
          }
          if (all.length >= 8) break;
        }

        if (ignore) return;
        if (!all.length && lastError) throw lastError;

        setLabel(used.join(' + '));
        setRawJobs(
          all.map((j) => ({
            ...j,
            logo: getInitials(j.company),
            required: requiredSkillsOf(j),
          }))
        );
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, autoMode]);

  // Scores update instantly when the user toggles skills they plan to learn
  const internships = useMemo(
    () =>
      rawJobs
        .map((j) => ({ ...j, ...scoreRequired(j.required, skills) }))
        .sort((a, b) => (b.score ?? -1) - (a.score ?? -1)),
    [rawJobs, skills]
  );

  const tips = useMemo(
    () => topMissing(internships.filter((j) => j.required.length)),
    [internships]
  );

  const baseRoles = useMemo(() => rankRoles(baseSkills), [baseSkills]);
  const roles = useMemo(
    () =>
      rankRoles(skills).map((r) => ({
        ...r,
        before: baseRoles.find((b) => b.id === r.id).score,
      })),
    [skills, baseRoles]
  );
  const wins = useMemo(() => quickWins(baseSkills), [baseSkills]);

  const scrollToResults = () =>
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

  // Each search uses Apify credits, so it only runs on Enter / button click
  const runSearch = () => {
    const q = searchTerm.trim();
    if (q) {
      setAutoMode(false);
      setQuery(q);
    }
  };

  const findForRole = (role) => {
    setAutoMode(false);
    setQuery(role.query);
    scrollToResults();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Hero: detected skills */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Internships Recommended For You ✨</h1>
              <p className="text-gray-600">
                We found {baseSkills.length} skills in your resume. Here is where you stand for each career path.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {baseSkills.map((s) => (
                  <span key={s} className="bg-white text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">{s}</span>
                ))}
              </div>
            </div>

            {/* Quick wins */}
            {wins.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-600" /> Fastest ways to level up
                </h3>
                <p className="text-sm text-gray-500 mb-3">Learning just one of these skills improves several career paths at once.</p>
                <div className="grid md:grid-cols-3 gap-3">
                  {wins.map((w) => (
                    <div key={w.skill} className="border-l-4 border-blue-500 bg-gray-50 rounded-lg px-4 py-3 text-sm">
                      <p className="font-bold text-gray-900 mb-1">Learn {w.skill}</p>
                      <ul className="text-xs text-gray-600 space-y-0.5">
                        {w.roles.map((r) => (
                          <li key={r.title}>
                            {r.title}: {r.from}% → <span className="text-green-600 font-bold">{r.to}%</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => togglePlanned(w.skill)}
                        className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full border transition ${
                          planned.includes(w.skill)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'text-blue-700 border-blue-200 hover:bg-blue-50'
                        }`}
                      >
                        {planned.includes(w.skill) ? '✓ Added to simulation' : 'Simulate this'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career paths */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Your career paths</h2>
                  <p className="text-sm text-gray-500">Click a missing skill to see your scores if you learn it.</p>
                </div>
                {planned.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-gray-500 font-semibold">Simulating:</span>
                    {planned.map((s) => (
                      <button
                        key={s}
                        onClick={() => togglePlanned(s)}
                        className="flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1 rounded-full font-semibold"
                      >
                        {s} <X size={12} />
                      </button>
                    ))}
                    <button onClick={() => setPlanned([])} className="text-gray-500 underline">Clear</button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {roles.map((r) => {
                  const st = statusOf(r.score);
                  const gained = r.score - r.before;
                  return (
                    <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{r.title}</h3>
                          <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                        </div>
                        <div
                          className="w-14 h-14 shrink-0 rounded-full grid place-items-center"
                          style={{ background: `conic-gradient(${scoreColor(r.score)} ${r.score}%, #e5e7eb 0)` }}
                        >
                          <div className="w-11 h-11 rounded-full bg-white grid place-items-center text-xs font-extrabold text-gray-900">
                            {r.score}%
                          </div>
                        </div>
                      </div>

                      {gained > 0 && (
                        <p className="text-xs text-green-600 font-semibold mb-2">+{gained}% with your planned skills</p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {r.matched.map((s) => (
                          <span key={s} className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1">
                            <Check size={11} /> {s}
                          </span>
                        ))}
                      </div>

                      {r.missing.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Skills to add:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {r.missing.map((s) => (
                              <button
                                key={s}
                                onClick={() => togglePlanned(s)}
                                className="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1 transition"
                              >
                                <Plus size={11} /> {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {r.missing.length === 0 && (
                        <p className="text-xs text-green-700 font-semibold mb-3">You have every core skill for this path.</p>
                      )}

                      <button
                        onClick={() => findForRole(r)}
                        className="mt-auto w-full border border-blue-200 text-blue-700 font-semibold text-sm rounded-lg py-2 hover:bg-blue-50 transition"
                      >
                        Find {r.title} internships
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div ref={resultsRef} className="flex gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search internships (e.g. React intern) and press Enter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={runSearch}
                disabled={loading || !searchTerm.trim()}
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition ${
                  searchTerm.trim() && !loading
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm cursor-pointer'
                    : 'bg-blue-200 text-white cursor-not-allowed'
                }`}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Results header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Results for "{label || '...'}"
                {!loading && !error && (
                  <span className="text-gray-400 font-normal text-sm ml-2">({internships.length} jobs)</span>
                )}
              </h2>
              {!autoMode && (
                <button
                  onClick={() => { setAutoMode(true); setQuery(''); setSearchTerm(''); }}
                  className="text-sm text-blue-600 font-semibold hover:underline"
                >
                  Back to best matches
                </button>
              )}
            </div>

            {/* Improvement analysis for the listed jobs */}
            {!loading && !error && tips.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-1">📈 How to improve these matches</h3>
                <p className="text-sm text-gray-500 mb-3">Learning these skills could improve your scores for the internships below:</p>
                <div className="space-y-2">
                  {tips.map((t) => (
                    <div key={t.skill} className="border-l-4 border-blue-500 bg-gray-50 rounded-lg px-4 py-2 text-sm">
                      <b>{t.skill}</b> → average match{' '}
                      <span className="text-green-600 font-bold">+{t.avgGain}%</span>
                      <span className="text-gray-500"> (required in {t.jobs} of these internships)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                <p className="text-gray-700 font-medium">Finding your best matches...</p>
                <p className="text-gray-500 text-sm mt-1">This may take a few seconds.</p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-red-700 font-semibold">Unable to load internships</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <p className="text-red-500 text-xs mt-2">Please check that the backend server is running.</p>
              </div>
            )}

            {!loading && !error && internships.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-500">
                No internships found. Try a different keyword.
              </div>
            )}

            {/* Job cards */}
            {!loading && !error && internships.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {internships.map((internship, idx) => (
                  <div
                    key={internship.applyUrl || `${internship.company}-${internship.title}-${idx}`}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-12 h-12 shrink-0 rounded-lg ${getLogoColor(internship.company)} flex items-center justify-center font-bold text-sm`}>
                            {internship.logo}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{internship.title}</h3>
                            <p className="text-xs text-gray-500 truncate">{internship.company}</p>
                          </div>
                        </div>
                        {internship.source && (
                          <span className="shrink-0 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                            {internship.source}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                        {internship.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{internship.location}</span>
                          </div>
                        )}
                        {internship.salary && <span>💰 {internship.salary}</span>}
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">{shortText(internship.description)}</p>

                      {/* Match score */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-14 h-14 shrink-0 rounded-full grid place-items-center"
                          style={{
                            background: internship.score == null
                              ? '#e5e7eb'
                              : `conic-gradient(${scoreColor(internship.score)} ${internship.score}%, #e5e7eb 0)`,
                          }}
                        >
                          <div className="w-11 h-11 rounded-full bg-white grid place-items-center text-xs font-extrabold text-gray-900">
                            {internship.score == null ? 'N/A' : `${internship.score}%`}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {internship.score == null
                            ? 'No recognizable skills found in this listing'
                            : `You match ${internship.matched.length} of ${internship.required.length} required skills`}
                        </p>
                      </div>

                      {internship.matched.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {internship.matched.map((s) => (
                            <span key={s} className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded">✓ {s}</span>
                          ))}
                        </div>
                      )}

                      {internship.missing.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Missing skills:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {internship.missing.map((s) => (
                              <button
                                key={s}
                                onClick={() => togglePlanned(s)}
                                title="Click to simulate learning this skill"
                                className="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-medium px-2.5 py-1 rounded transition"
                              >
                                ✗ {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={() => toggleSave(internship)}
                          className={`flex items-center justify-center gap-2 flex-1 border rounded-lg py-2 font-semibold text-sm transition ${
                            isSaved(internship)
                              ? 'bg-blue-50 border-blue-300 text-blue-600'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Bookmark size={16} fill={isSaved(internship) ? 'currentColor' : 'none'} />
                          {isSaved(internship) ? 'Saved' : 'Save'}
                        </button>
                        <a
                          href={internship.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleApply(internship)}
                          className={`flex-1 flex items-center justify-center gap-2 font-semibold text-sm rounded-lg transition py-2 text-white ${
                            appliedIds.has(jobId(internship))
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {appliedIds.has(jobId(internship)) ? 'Applied ✓' : 'Apply Now'}{' '}
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default InternshipsRecommended;