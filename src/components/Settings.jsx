import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { useTheme } from '../context/ThemeContext';
import {
  Settings as SettingsIcon, User, Lock, SlidersHorizontal, Eye, Shield, Database,
  Sparkles, Link2, FileText, HelpCircle, Sun, Moon, Monitor, Camera, ChevronRight, Pencil,
} from 'lucide-react';

/* ========== STORAGE HELPERS ========== */
function loadProfile() {
  try {
    const raw = localStorage.getItem('userProfile');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

const BLANK_SETTINGS = {
  matchPreferences: ['skillsMatch', 'location', 'stipend'],
  visibility: 'recruiters',
  language: 'English',
  notifications: { email: true, push: true, weeklyDigest: true, applicationUpdates: true },
  privacy: { shareDataWithPartners: false, showEmailPublicly: false },
};

function loadSettings() {
  try {
    const raw = localStorage.getItem('userSettings');
    if (!raw) return BLANK_SETTINGS;
    const saved = JSON.parse(raw);
    return {
      ...BLANK_SETTINGS, ...saved,
      notifications: { ...BLANK_SETTINGS.notifications, ...(saved.notifications || {}) },
      privacy: { ...BLANK_SETTINGS.privacy, ...(saved.privacy || {}) },
    };
  } catch { return BLANK_SETTINGS; }
}

function persistSettings(s) {
  try { localStorage.setItem('userSettings', JSON.stringify(s)); } catch {}
}

function calcCompletion(p) {
  const checks = [p.name, p.email, p.phone, p.location, p.college, p.bio,
    p.skills?.length > 0, p.education?.degreeLine, p.resume?.fileName, p.preferences?.roles];
  const filled = checks.filter(Boolean).length;
  return checks.length ? Math.round((filled / checks.length) * 100) : 0;
}

const TABS = [
  { key: 'account', label: 'Account', icon: User },
  { key: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { key: 'notifications', label: 'Notifications', icon: SettingsIcon },
  { key: 'privacy', label: 'Privacy', icon: Shield },
  { key: 'data', label: 'Data & Export', icon: Database },
];

const MATCH_OPTIONS = [
  { key: 'skillsMatch', label: 'Skills Match' },
  { key: 'location', label: 'Location' },
  { key: 'stipend', label: 'Stipend' },
  { key: 'remoteWork', label: 'Remote Work' },
  { key: 'workMode', label: 'Work Mode' },
  { key: 'companySize', label: 'Company Size' },
];

/* ========== MAIN SETTINGS PAGE ========== */
const Settings = () => {
  const [profile] = useState(loadProfile);
  const [settings, setSettings] = useState(loadSettings);
  const [activeTab, setActiveTab] = useState('account');
  const completion = calcCompletion(profile);
  const { theme, setTheme } = useTheme(); // Use global theme

  const update = (patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persistSettings(next);
      return next;
    });
  };

  const toggleMatchOption = (key) => {
    const has = settings.matchPreferences.includes(key);
    update({ matchPreferences: has
      ? settings.matchPreferences.filter((k) => k !== key)
      : [...settings.matchPreferences, key] });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopNav />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: 'var(--color-bg-secondary)' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: 'var(--color-bg-tertiary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <SettingsIcon size={22} color="#2563eb" />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-primary)', margin: 0 }}>Settings</h1>
                <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', margin: '4px 0 0 0' }}>Manage your account, preferences and personalize your experience.</p>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#dbeafe' : 'transparent',
                      color: isActive ? '#2563eb' : 'var(--color-text-tertiary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={15} />{tab.label}
                  </button>
                );
              })}
            </div>

            {/* Body: main content + right column */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {activeTab === 'account' && <AccountTab profile={profile} settings={settings} onUpdate={update} />}
                {activeTab === 'preferences' && <PreferencesTab settings={settings} onToggle={toggleMatchOption} />}
                {activeTab === 'notifications' && <NotificationsTab settings={settings} onUpdate={update} />}
                {activeTab === 'privacy' && <PrivacyTab settings={settings} onUpdate={update} />}
                {activeTab === 'data' && <DataTab />}
              </div>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <CompleteProfileCard completion={completion} />
                <QuickLinksCard />
                <AppPreferencesCard settings={settings} onUpdate={update} theme={theme} setTheme={setTheme} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

/* ========== CARD COMPONENT ========== */
function Card({ children, title, icon: Icon, subtitle }) {
  return (
    <div style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderRadius: '12px',
      border: '1px solid var(--color-border)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '20px'
    }}>
      {title && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            margin: 0
          }}>
            {Icon && <Icon size={16} color="#2563eb" />}
            {title}
          </h3>
          {subtitle && (
            <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', margin: '4px 0 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/* ========== ACCOUNT TAB ========== */
function AccountTab({ profile, settings, onUpdate }) {
  const [localSettings, setLocalSettings] = useState(settings);
  
  const update = (patch) => { 
    const next = { ...localSettings, ...patch }; 
    setLocalSettings(next); 
    persistSettings(next);
    onUpdate(patch);
  };

  const toggleMatchOption = (key) => {
    const has = localSettings.matchPreferences.includes(key);
    update({ matchPreferences: has ? localSettings.matchPreferences.filter((k) => k !== key) : [...localSettings.matchPreferences, key] });
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Account Information */}
        <Card title="Account Information" icon={User} subtitle="Update your personal details and contact information.">
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                backgroundColor: 'var(--color-bg-tertiary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <User size={26} color="#93c5fd" />
              </div>
              <div style={{
                position: 'absolute', bottom: '-4px', right: '-4px',
                width: '24px', height: '24px', backgroundColor: 'var(--color-bg-primary)',
                borderRadius: '50%', border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Camera size={12} color="var(--color-text-tertiary)" />
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <FieldRow label="Full Name" value={profile.name || 'Not added'} />
              <FieldRow label="Email" value={profile.email || 'Not added'} />
              <FieldRow label="Phone Number" value={profile.phone || 'Not added'} />
              <FieldRow label="Location" value={profile.location || 'Not added'} />
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card title="Change Password" icon={Lock} subtitle="Keep your account secure.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="password" placeholder="Current Password" style={{
              width: '100%', fontSize: '14px', border: '1px solid var(--color-input-border)',
              backgroundColor: 'var(--color-input-bg)', color: 'var(--color-text-primary)',
              borderRadius: '8px', padding: '8px 12px', outline: 'none'
            }} />
            <input type="password" placeholder="New Password" style={{
              width: '100%', fontSize: '14px', border: '1px solid var(--color-input-border)',
              backgroundColor: 'var(--color-input-bg)', color: 'var(--color-text-primary)',
              borderRadius: '8px', padding: '8px 12px', outline: 'none'
            }} />
            <input type="password" placeholder="Confirm New Password" style={{
              width: '100%', fontSize: '14px', border: '1px solid var(--color-input-border)',
              backgroundColor: 'var(--color-input-bg)', color: 'var(--color-text-primary)',
              borderRadius: '8px', padding: '8px 12px', outline: 'none'
            }} />
            <button style={{
              width: '100%', backgroundColor: '#2563eb', color: 'white',
              padding: '10px', borderRadius: '8px', fontSize: '14px',
              fontWeight: '700', border: 'none', cursor: 'pointer',
              marginTop: '8px'
            }}>Update Password</button>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Your Preferences */}
        <Card title="Your Preferences" icon={SlidersHorizontal} subtitle="Tell us what matters most to you.">
          <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>What matters most to you?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {MATCH_OPTIONS.map((opt) => {
              const active = localSettings.matchPreferences.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  onClick={() => toggleMatchOption(opt.key)}
                  style={{
                    fontSize: '12px', fontWeight: '600', padding: '6px 12px',
                    borderRadius: '20px', border: '1px solid var(--color-border)',
                    backgroundColor: active ? '#2563eb' : 'var(--color-bg-secondary)',
                    color: active ? 'white' : 'var(--color-text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}{active ? ' ✓' : ''}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Profile Visibility */}
        <Card title="Profile Visibility" icon={Eye} subtitle="Control who can see your profile.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { key: 'recruiters', title: 'Visible to all recruiters', desc: 'Recommended for better opportunities' },
              { key: 'verified', title: 'Visible to verified companies only', desc: '' },
              { key: 'private', title: 'Private (only you can see)', desc: '' },
            ].map((opt) => (
              <label key={opt.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input type="radio" name="visibility" checked={localSettings.visibility === opt.key}
                  onChange={() => update({ visibility: opt.key })} style={{ marginTop: '4px', cursor: 'pointer' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{opt.title}</div>
                  {opt.desc && <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{opt.desc}</div>}
                </div>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function FieldRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-tertiary)' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)' }}>{value}</div>
    </div>
  );
}

/* ========== OTHER TABS ========== */
function PreferencesTab({ settings, onToggle }) {
  return (
    <Card title="Internship Match Preferences" icon={SlidersHorizontal} subtitle="These weight how we rank recommendations for you.">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {MATCH_OPTIONS.map((opt) => {
          const active = settings.matchPreferences.includes(opt.key);
          return (
            <button key={opt.key} onClick={() => onToggle(opt.key)}
              style={{
                fontSize: '12px', fontWeight: '600', padding: '6px 12px',
                borderRadius: '20px', border: '1px solid var(--color-border)',
                backgroundColor: active ? '#2563eb' : 'var(--color-bg-secondary)',
                color: active ? 'white' : 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}>
              {opt.label}{active ? ' ✓' : ''}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function NotificationsTab({ settings, onUpdate }) {
  const items = [
    { key: 'email', label: 'Email notifications', desc: 'Get updates about your applications by email' },
    { key: 'push', label: 'Push notifications', desc: 'Get real-time alerts in your browser' },
    { key: 'weeklyDigest', label: 'Weekly digest', desc: 'A summary of new matches every week' },
    { key: 'applicationUpdates', label: 'Application updates', desc: 'Status changes on internships you applied to' },
  ];
  return (
    <Card title="Notifications">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((it) => (
          <div key={it.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{it.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{it.desc}</div>
            </div>
            <Toggle checked={settings.notifications[it.key]}
              onChange={() => onUpdate({ notifications: { ...settings.notifications, [it.key]: !settings.notifications[it.key] } })} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function PrivacyTab({ settings, onUpdate }) {
  return (
    <Card title="Privacy" icon={Shield}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Share data with hiring partners</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Allows partner companies to see anonymized match stats</div>
          </div>
          <Toggle checked={settings.privacy.shareDataWithPartners}
            onChange={() => onUpdate({ privacy: { ...settings.privacy, shareDataWithPartners: !settings.privacy.shareDataWithPartners } })} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Show email publicly on profile</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Recruiters can email you directly</div>
          </div>
          <Toggle checked={settings.privacy.showEmailPublicly}
            onChange={() => onUpdate({ privacy: { ...settings.privacy, showEmailPublicly: !settings.privacy.showEmailPublicly } })} />
        </div>
      </div>
    </Card>
  );
}

function DataTab() {
  return (
    <>
      <Card title="Export Your Data" icon={Database} subtitle="Download a copy of your profile, applications and activity.">
        <button style={{
          fontSize: '14px', fontWeight: '700', border: '1px solid var(--color-border)',
          borderRadius: '8px', padding: '8px 16px', backgroundColor: 'var(--color-bg-secondary)',
          color: 'var(--color-text-primary)', cursor: 'pointer'
        }}>Download my data</button>
      </Card>
      <div style={{
        backgroundColor: '#fee2e2', borderRadius: '12px', border: '1px solid #fecaca',
        padding: '20px'
      }}>
        <h3 style={{ fontWeight: '700', color: '#b91c1c', margin: '0 0 8px 0' }}>Delete Account</h3>
        <p style={{ fontSize: '12px', color: '#dc2626', margin: '0 0 12px 0' }}>This permanently removes your profile and all applications.</p>
        <button style={{
          fontSize: '14px', fontWeight: '700', border: '1px solid #fca5a5',
          color: '#dc2626', borderRadius: '8px', padding: '8px 16px',
          backgroundColor: 'transparent', cursor: 'pointer'
        }}>Delete my account</button>
      </div>
    </>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: '40px', height: '24px', borderRadius: '12px',
      display: 'flex', alignItems: 'center',
      backgroundColor: checked ? '#2563eb' : '#d1d5db',
      border: 'none', padding: '2px', cursor: 'pointer',
      justifyContent: checked ? 'flex-end' : 'flex-start'
    }}>
      <span style={{
        width: '20px', height: '20px', backgroundColor: 'white',
        borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }} />
    </button>
  );
}

/* ========== RIGHT COLUMN CARDS ========== */
function CompleteProfileCard({ completion }) {
  return (
    <div style={{
      background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
      borderRadius: '12px', padding: '20px', color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Sparkles size={16} />
        <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>Complete Your Profile</h3>
      </div>
      <p style={{ fontSize: '12px', color: '#dbeafe', margin: '0 0 12px 0' }}>A complete profile helps you get better recommendations.</p>
      <div style={{
        width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: '4px', overflow: 'hidden', marginBottom: '8px'
      }}>
        <div style={{
          height: '100%', backgroundColor: 'white', borderRadius: '4px',
          width: `${completion}%`
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#dbeafe' }}>{completion}% complete</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
}

function QuickLinksCard() {
  const links = [
    { icon: Pencil, label: 'Edit Profile', to: '/profile' },
    { icon: FileText, label: 'Manage Resume', to: '/profile' },
    { icon: Lock, label: 'Change Password', to: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', to: '/settings' },
  ];
  return (
    <Card title="Quick Links" icon={Link2}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link key={l.label} to={l.to} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', fontSize: '14px', color: 'var(--color-text-secondary)',
              textDecoration: 'none', cursor: 'pointer'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={15} />{l.label}
              </span>
              <ChevronRight size={14} />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

function AppPreferencesCard({ settings, onUpdate, theme, setTheme }) {
  return (
    <Card title="App Preferences" icon={Sun}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Theme</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'light', label: 'Light', Icon: Sun },
            { key: 'dark', label: 'Dark', Icon: Moon },
            { key: 'system', label: 'System', Icon: Monitor }
          ].map((t) => (
            <button key={t.key} onClick={() => setTheme(t.key)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '4px', padding: '8px', borderRadius: '8px', fontSize: '12px',
                fontWeight: '600', border: '1px solid var(--color-border)',
                backgroundColor: theme === t.key ? '#2563eb' : 'var(--color-bg-secondary)',
                color: theme === t.key ? 'white' : 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}>
              <t.Icon size={14} />{t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Language</div>
        <select value={settings.language} onChange={(e) => onUpdate({ language: e.target.value })}
          style={{
            width: '100%', fontSize: '14px', border: '1px solid var(--color-input-border)',
            backgroundColor: 'var(--color-input-bg)', color: 'var(--color-text-primary)',
            borderRadius: '8px', padding: '8px 12px', outline: 'none'
          }}>
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>
    </Card>
  );
}

export default Settings;