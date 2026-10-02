import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import {
  User, Pencil, MapPin, Code2, GraduationCap, SlidersHorizontal, Clock,
  FileText, Download, Calendar, Send, Bookmark, Target,
} from 'lucide-react';

/* ---------------- localStorage helpers ---------------- */
const BLANK_PROFILE = {
  name: '', email: '', phone: '', location: '', college: '', gradYear: '',
  degree: '', classOf: '', bio: '', photoUrl: '',
  skills: [],
  education: { degreeLine: '', years: '', institute: '', class12: '', class12Year: '', class10: '', class10Year: '' },
  resume: { fileName: '', updatedOn: '', sizeMB: '' },
  preferences: { roles: '', location: '', mode: '', stipend: '' },
  stats: { recommended: 24, applied: 8, saved: 3 },
  recentActivity: [],
};

function loadProfileFromStorage() {
  try {
    const raw = localStorage.getItem('userProfile');
    if (!raw) return BLANK_PROFILE;
    const saved = JSON.parse(raw);
    return {
      ...BLANK_PROFILE, ...saved,
      education: { ...BLANK_PROFILE.education, ...(saved.education || {}) },
      resume: { ...BLANK_PROFILE.resume, ...(saved.resume || {}) },
      preferences: { ...BLANK_PROFILE.preferences, ...(saved.preferences || {}) },
      stats: { ...BLANK_PROFILE.stats, ...(saved.stats || {}) },
    };
  } catch {
    return BLANK_PROFILE;
  }
}

function persist(profile) {
  try { localStorage.setItem('userProfile', JSON.stringify(profile)); } catch {}
}

function calcCompletion(p) {
  const checks = [p.name, p.email, p.phone, p.location, p.college, p.bio, p.skills?.length > 0,
    p.education?.degreeLine, p.resume?.fileName, p.preferences?.roles];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

/* ---------------- Main component ---------------- */
const Profile = () => {
  const [profile, setProfile] = useState(loadProfileFromStorage);
  const completion = calcCompletion(profile);
  const displayName = profile.name?.trim() || 'Your Name';

  const updateProfile = (patch) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 flex flex-wrap items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-white shadow flex items-center justify-center flex-shrink-0 overflow-hidden">
                {profile.photoUrl
                  ? <img src={profile.photoUrl} alt={displayName} className="w-full h-full object-cover" />
                  : <User size={32} className="text-blue-500" />}
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900">{displayName}</h1>
                  <Pencil size={16} className="text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {profile.degree || 'Add your degree'}{profile.classOf ? `  ·  Class of ${profile.classOf}` : ''}
                </p>
                {profile.college && (
                  <p className="text-sm text-gray-500 mt-2 flex items-start gap-1.5">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    {profile.college}{profile.location ? `, ${profile.location}` : ''}
                  </p>
                )}
                {profile.bio && <p className="text-sm text-gray-700 mt-2 leading-relaxed">{profile.bio}</p>}
              </div>
              <RingStat percent={completion} />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-5">
              <div className="space-y-5">
                <PersonalInfoCard profile={profile} onSave={updateProfile} />
                <ResumeCard resume={profile.resume} />
              </div>

              <div className="space-y-5">
                <SkillsCard skills={profile.skills} onSave={(skills) => updateProfile({ skills })} />
                <EducationCard education={profile.education} onSave={(education) => updateProfile({ education })} />
              </div>

              <div className="space-y-5">
                <QuickStats stats={profile.stats} completion={completion} />
                <PreferencesCard prefs={profile.preferences} onSave={(preferences) => updateProfile({ preferences })} />
                <RecentActivity items={profile.recentActivity} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

/* ---------------- Building blocks ---------------- */

function CardHeader({ icon, title, editing, onEditToggle }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="flex items-center gap-2 font-bold text-gray-900 text-sm">{icon}{title}</h3>
      {onEditToggle && (
        <button onClick={onEditToggle} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
          <Pencil size={12} />{editing ? 'Done' : 'Edit'}
        </button>
      )}
    </div>
  );
}

function LabeledValue({ label, value, editing, onChange, placeholder }) {
  return (
    <div className="mb-3.5">
      <div className="text-xs font-medium text-gray-400">{label}</div>
      {editing
        ? <input value={value} onChange={onChange} placeholder={placeholder}
            className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        : <div className={`text-sm font-bold ${value ? 'text-gray-900' : 'text-gray-400 font-medium'}`}>{value || 'Not added'}</div>}
    </div>
  );
}

function RingStat({ percent }) {
  const r = 34, c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-center gap-4 ml-auto">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} stroke="#e5e7eb" strokeWidth="7" fill="none" />
        <circle cx="44" cy="44" r={r} stroke="#2563eb" strokeWidth="7" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 44 44)" />
        <text x="44" y="49" textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">{percent}%</text>
      </svg>
      <div>
        <div className="text-sm font-bold text-gray-900">Profile Completion</div>
        <div className="text-xs font-semibold text-blue-600">Complete your profile →</div>
      </div>
    </div>
  );
}

function PersonalInfoCard({ profile, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const field = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const toggle = () => { editing ? onSave(draft) : setDraft(profile); setEditing((v) => !v); };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <CardHeader icon={<User size={16} className="text-blue-600" />} title="Personal Information" editing={editing} onEditToggle={toggle} />
      <LabeledValue label="Full Name" value={draft.name} editing={editing} onChange={field('name')} placeholder="e.g. Ishani Mohanty" />
      <LabeledValue label="Email" value={draft.email} editing={editing} onChange={field('email')} placeholder="you@email.com" />
      <LabeledValue label="Phone" value={draft.phone} editing={editing} onChange={field('phone')} placeholder="+91 98765 43210" />
      <LabeledValue label="Location" value={draft.location} editing={editing} onChange={field('location')} placeholder="City, State" />
      <LabeledValue label="College" value={draft.college} editing={editing} onChange={field('college')} placeholder="Your college" />
      <LabeledValue label="Graduation Year" value={draft.gradYear} editing={editing} onChange={field('gradYear')} placeholder="2027" />
    </div>
  );
}

function ResumeCard({ resume }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 text-sm"><FileText size={16} className="text-red-500" />Resume</h3>
        <span className="text-xs font-bold text-blue-600 cursor-pointer">View / Download</span>
      </div>
      {resume?.fileName ? (
        <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
              <FileText size={16} className="text-red-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{resume.fileName}</div>
              <div className="text-[11px] text-gray-400">
                {resume.updatedOn ? `Updated on ${resume.updatedOn}` : ''}{resume.sizeMB ? ` · ${resume.sizeMB} MB` : ''}
              </div>
            </div>
          </div>
          <Download size={16} className="text-gray-400" />
        </div>
      ) : (
        <div className="text-sm text-gray-400">No resume uploaded yet.</div>
      )}
    </div>
  );
}

function SkillsCard({ skills, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(skills);
  const [input, setInput] = useState('');
  const toggle = () => { editing ? onSave(draft) : setDraft(skills); setEditing((v) => !v); };
  const add = () => { if (input.trim()) { setDraft([...draft, input.trim()]); setInput(''); } };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <CardHeader icon={<Code2 size={16} className="text-blue-600" />} title="Skills" editing={editing} onEditToggle={toggle} />
      <div className="text-xs font-bold text-gray-400 mb-2">Technical Skills</div>
      <div className={`flex flex-wrap gap-2 ${editing ? 'mb-3' : ''}`}>
        {(editing ? draft : skills).length === 0 && <span className="text-sm text-gray-400">No skills added yet.</span>}
        {(editing ? draft : skills).map((sk) => (
          <span key={sk} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
            {sk}
            {editing && <button onClick={() => setDraft(draft.filter((x) => x !== sk))} className="font-bold">×</button>}
          </span>
        ))}
      </div>
      {editing && (
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Add a skill" className="flex-1 text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          <button onClick={add} className="text-sm font-bold border border-gray-200 rounded-lg px-3">Add</button>
        </div>
      )}
    </div>
  );
}

function EducationCard({ education, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(education);
  const field = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const toggle = () => { editing ? onSave(draft) : setDraft(education); setEditing((v) => !v); };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <CardHeader icon={<GraduationCap size={16} className="text-blue-600" />} title="Education" editing={editing} onEditToggle={toggle} />
      <LabeledValue label="Degree" value={draft.degreeLine} editing={editing} onChange={field('degreeLine')} placeholder="B.Tech in Computer Science" />
      <LabeledValue label="Years" value={draft.years} editing={editing} onChange={field('years')} placeholder="2023 - 2027" />
      <LabeledValue label="Institute" value={draft.institute} editing={editing} onChange={field('institute')} placeholder="Your institute" />
      <div className="h-px bg-gray-100 my-3" />
      <LabeledValue label="Class 12" value={draft.class12} editing={editing} onChange={field('class12')} placeholder="Board name" />
      <LabeledValue label="Class 12 Year" value={draft.class12Year} editing={editing} onChange={field('class12Year')} placeholder="2022" />
      <LabeledValue label="Class 10" value={draft.class10} editing={editing} onChange={field('class10')} placeholder="Board name" />
      <LabeledValue label="Class 10 Year" value={draft.class10Year} editing={editing} onChange={field('class10Year')} placeholder="2020" />
    </div>
  );
}

function QuickStats({ stats, completion }) {
  const items = [
    { icon: <Calendar size={16} className="text-blue-600" />, label: 'Internships Recommended', value: stats?.recommended ?? 0 },
    { icon: <Send size={16} className="text-blue-600" />, label: 'Applications Sent', value: stats?.applied ?? 0 },
    { icon: <Bookmark size={16} className="text-blue-600" />, label: 'Saved Internships', value: stats?.saved ?? 0 },
    { icon: <Target size={16} className="text-blue-600" />, label: 'Profile Completion', value: `${completion}%` },
  ];
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-900 text-sm mb-4">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.label} className="border border-gray-100 bg-gray-50 rounded-xl p-3">
            {it.icon}
            <div className="text-lg font-extrabold text-gray-900 mt-1.5">{it.value}</div>
            <div className="text-[11px] text-gray-500">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreferencesCard({ prefs, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(prefs);
  const field = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const toggle = () => { editing ? onSave(draft) : setDraft(prefs); setEditing((v) => !v); };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <CardHeader icon={<SlidersHorizontal size={16} className="text-blue-600" />} title="Preferences" editing={editing} onEditToggle={toggle} />
      <LabeledValue label="Preferred Roles" value={draft.roles} editing={editing} onChange={field('roles')} placeholder="Full Stack, Backend" />
      <LabeledValue label="Preferred Location" value={draft.location} editing={editing} onChange={field('location')} placeholder="Remote / Work From Home" />
      <LabeledValue label="Preferred Mode" value={draft.mode} editing={editing} onChange={field('mode')} placeholder="Internship (On-site / Hybrid)" />
      <LabeledValue label="Expected Stipend" value={draft.stipend} editing={editing} onChange={field('stipend')} placeholder="Not specified" />
    </div>
  );
}

function RecentActivity({ items }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 text-sm"><Clock size={16} className="text-blue-600" />Recent Activity</h3>
        <span className="text-xs font-bold text-blue-600 cursor-pointer">View All</span>
      </div>
      {(!items || items.length === 0) ? (
        <div className="text-sm text-gray-400">No recent activity yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="flex gap-2.5">
              <div className="bg-green-100 h-6 w-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock size={12} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-800">{it.text}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{it.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;