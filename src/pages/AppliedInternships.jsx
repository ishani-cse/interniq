import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { getApplications, withdrawApplication } from '../components/applications';
import { MapPin, Clock, DollarSign, ChevronDown, Trash2 } from 'lucide-react';

const LOGO_COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-yellow-100 text-yellow-600',
  'bg-green-100 text-green-600',
  'bg-orange-100 text-orange-600',
  'bg-pink-100 text-pink-600',
];

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

const getLogoColor = (name = '') => {
  let hash = 0;
  for (const ch of name) hash += ch.charCodeAt(0);
  return LOGO_COLORS[hash % LOGO_COLORS.length];
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const AppliedInternships = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState('Most Recent');
  // Real data: user ne jo apply kiya wahi yahan aayega
  const [applications, setApplications] = useState(() => getApplications());

  const getStatusBadge = (status) => {
    const statusStyles = {
      Applied: { bg: 'bg-blue-50', text: 'text-blue-600' },
      'Interview Scheduled': { bg: 'bg-green-50', text: 'text-green-600' },
      'Offer Received': { bg: 'bg-purple-50', text: 'text-purple-600' },
      Rejected: { bg: 'bg-red-50', text: 'text-red-600' },
    };
    return statusStyles[status] || statusStyles.Applied;
  };

  const tabCounts = {
    All: applications.length,
    Applied: applications.filter((a) => a.status === 'Applied').length,
    Interview: applications.filter((a) => a.status === 'Interview Scheduled').length,
    Offer: applications.filter((a) => a.status === 'Offer Received').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  const statusForTab = {
    Applied: 'Applied',
    Interview: 'Interview Scheduled',
    Offer: 'Offer Received',
    Rejected: 'Rejected',
  };

  const filteredApplications = applications
    .filter((a) => activeTab === 'All' || a.status === statusForTab[activeTab])
    .sort((a, b) =>
      sortBy === 'Oldest First'
        ? new Date(a.appliedAt) - new Date(b.appliedAt)
        : new Date(b.appliedAt) - new Date(a.appliedAt)
    );

  const handleWithdraw = (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    withdrawApplication(id);
    setApplications(getApplications());
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Your Applied Internships ✨
                  </h1>
                  <p className="text-gray-600">
                    Track the status of all your internship applications in one place.
                  </p>
                </div>
                <div className="text-5xl opacity-20">📋</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-3">
              {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab} ({tabCounts[tab]})
                </button>
              ))}

              {/* Sort Dropdown */}
              <div className="ml-auto">
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
                  >
                    <option>Most Recent</option>
                    <option>Oldest First</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-3 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                  <p className="text-gray-500 font-medium">
                    {applications.length === 0
                      ? "You haven't applied to any internship yet. Apply to one and it will show up here."
                      : 'No applications in this category'}
                  </p>
                </div>
              ) : (
                filteredApplications.map((app) => {
                  const badgeStyle = getStatusBadge(app.status);
                  return (
                    <div
                      key={app.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
                    >
                      <div className="p-5 flex items-center justify-between">
                        {/* Left Side - Company Info */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div
                            className={`w-16 h-16 rounded-lg ${getLogoColor(
                              app.company
                            )} flex items-center justify-center font-bold text-sm flex-shrink-0`}
                          >
                            {getInitials(app.company)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm mb-1">{app.title}</h3>
                            <p className="text-xs text-gray-500 mb-2">{app.company}</p>

                            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                <span>{app.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{app.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign size={12} />
                                <span>{app.salary}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Middle - Applied Date */}
                        <div className="text-center mx-6">
                          <p className="text-xs text-gray-500 mb-1">Applied on</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(app.appliedAt)}
                          </p>
                        </div>

                        {/* Right Side - Status and Actions */}
                        <div className="text-right">
                          <div
                            className={`${badgeStyle.bg} ${badgeStyle.text} px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block`}
                          >
                            {app.status}
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1">
                              👁 View Details →
                            </button>
                            <button
                              onClick={() => handleWithdraw(app.id)}
                              title="Withdraw application"
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppliedInternships;