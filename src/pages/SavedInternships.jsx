import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { MapPin, Bookmark, ChevronDown, ExternalLink } from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useResume } from '../context/ResumeContext';
import { scoreRequired } from '../utils/matching';

const LOGO_COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-orange-100 text-orange-600',
  'bg-indigo-100 text-indigo-600',
];

const getLogoColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % 997;
  return LOGO_COLORS[hash % LOGO_COLORS.length];
};

const shortText = (text = '', max = 200) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max) + '...' : clean;
};

const SavedInternships = () => {
  const navigate = useNavigate();
  const { saved, removeSaved } = useSaved();
  const { resume } = useResume();
  const [sortBy, setSortBy] = useState('Recently Saved');

  const userSkills = resume?.skills || [];

  // Match score is calculated fresh from the current resume
  const items = useMemo(() => {
    const withScores = saved.map((j) => ({
      ...j,
      ...(userSkills.length
        ? scoreRequired(j.required || [], userSkills)
        : { matched: [], missing: [], score: null }),
    }));

    if (sortBy === 'Oldest First') return [...withScores].sort((a, b) => a.savedAt - b.savedAt);
    if (sortBy === 'Best Match') return [...withScores].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    return [...withScores].sort((a, b) => b.savedAt - a.savedAt);
  }, [saved, userSkills, sortBy]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Saved Internships</h1>
                  <p className="text-gray-600">Internships you save will appear here. Keep track of your favorites and apply when you're ready.</p>
                </div>
                <div className="text-5xl opacity-20">📌</div>
              </div>
            </div>

            {items.length > 0 && (
              <>
                {/* Count + Sort */}
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Your Saved Internships ({items.length})</h2>

                  <div className="relative inline-block">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10 bg-white"
                    >
                      <option>Recently Saved</option>
                      <option>Oldest First</option>
                      <option>Best Match</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {items.map((job) => (
                    <div key={job.key} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">

                      <div className="p-5 border-b border-gray-100">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-12 h-12 shrink-0 rounded-lg ${getLogoColor(job.company)} flex items-center justify-center font-bold text-sm`}>
                              {job.logo || '?'}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900 truncate">{job.title}</h3>
                              <p className="text-xs text-gray-500 truncate">{job.company}</p>
                            </div>
                          </div>
                          {job.score != null && (
                            <span className="shrink-0 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                              {job.score}% Match
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{job.location}</span>
                            </div>
                          )}
                          {job.salary && <span>💰 {job.salary}</span>}
                          {job.source && <span>via {job.source}</span>}
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed">{shortText(job.description)}</p>

                        {(job.required || []).length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {job.required.map((skill) => {
                              const have = job.matched.includes(skill);
                              return (
                                <span
                                  key={skill}
                                  className={`text-xs font-medium px-2.5 py-1 rounded ${
                                    have ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {have ? '✓ ' : ''}{skill}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex gap-3 pt-3">
                          <button
                            onClick={() => removeSaved(job.key)}
                            className="flex items-center justify-center gap-2 px-3 py-2 border border-blue-300 bg-blue-50 text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-100 transition"
                          >
                            <Bookmark size={16} fill="currentColor" />
                            Saved
                          </button>
                          <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition py-2"
                          >
                            Apply Now <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {items.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <Bookmark size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-700 font-semibold">No saved internships yet</p>
                <p className="text-sm text-gray-500 mt-1 mb-5">
                  Tap Save on any internship and it will show up here.
                </p>
                <button
                  onClick={() => navigate('/internships')}
                  className="bg-blue-600 text-white font-semibold text-sm rounded-lg px-5 py-2 hover:bg-blue-700 transition"
                >
                  Browse Recommended Internships
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default SavedInternships;