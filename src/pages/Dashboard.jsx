import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { User, Briefcase, FileCheck, UserPlus, MapPin, DollarSign, Bookmark, Clock, Eye, Bell, AlertCircle } from 'lucide-react';

function loadProfile() {
  try {
    const raw = localStorage.getItem('userProfile');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

const Dashboard = () => {
  const profile = loadProfile();
  const firstName = profile.name?.trim()?.split(' ')[0] || 'Student';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">

            {/* Welcome Hero — matches the gradient card used on Profile & Settings */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white shadow flex items-center justify-center flex-shrink-0">
                <User size={26} className="text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Welcome back, {firstName}! 👋</h1>
                <p className="text-sm text-gray-600 mt-1">Here's what's happening with your internship search today.</p>
              </div>
            </div>

            {/* 3 STATS CARDS IN ONE ROW */}
            <div className="grid grid-cols-3 gap-5 mb-8">

              {/* Card 1 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Internships Recommended</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">24</p>
                    <p className="text-xs text-gray-500 mt-2">Based on your profile</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Briefcase size={18} className="text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-blue-600">+5 this week →</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Internships Applied</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">8</p>
                    <p className="text-xs text-gray-500 mt-2">Track your progress</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <FileCheck size={18} className="text-green-600" />
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-green-600">3 pending review →</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Profile Completion</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">85%</p>
                    <p className="text-xs text-gray-500 mt-2">Almost complete!</p>
                  </div>
                  <div className="bg-orange-50 p-2 rounded-lg">
                    <UserPlus size={18} className="text-orange-600" />
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-orange-600">Add skills to reach 100% →</p>
                </div>
              </div>
            </div>

            {/* MAIN 2-COLUMN LAYOUT: LEFT (Internships) | RIGHT (Skills + Resume + Activity) */}
            <div className="flex gap-6">

              {/* LEFT COLUMN - Internship Cards (70% width) */}
              <div className="flex-[2] space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Recommended Internships</h2>
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All →</button>
                </div>

                {/* 2 Internship Cards in a Row */}
                <div className="grid grid-cols-2 gap-5">

                  {/* Internship Card 1 */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Data Science Intern</h3>
                        <p className="text-xs text-gray-500">TechCorp Solutions</p>
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">95% Match</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>Bangalore</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>₹25k/mo</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">Python</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">ML</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">SQL</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold">Apply Now</button>
                      <button className="p-2 border border-gray-200 rounded-lg">
                        <Bookmark size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Internship Card 2 */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Frontend Dev Intern</h3>
                        <p className="text-xs text-gray-500">WebDev Studios</p>
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">88% Match</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>Remote</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>₹20k/mo</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">React</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">JavaScript</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">CSS</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold">Apply Now</button>
                      <button className="p-2 border border-gray-200 rounded-lg">
                        <Bookmark size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Row of Internship Cards */}
                <div className="grid grid-cols-2 gap-5">

                  {/* Internship Card 3 */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">ML Engineer Intern</h3>
                        <p className="text-xs text-gray-500">AI Innovations</p>
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">92% Match</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>Hyderabad</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>₹30k/mo</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">Python</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">TensorFlow</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">Deep Learning</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold">Apply Now</button>
                      <button className="p-2 border border-gray-200 rounded-lg">
                        <Bookmark size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Internship Card 4 */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Full Stack Dev Intern</h3>
                        <p className="text-xs text-gray-500">StartUp Hub</p>
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">85% Match</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>Mumbai</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>₹22k/mo</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">Node.js</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">React</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md">MongoDB</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold">Apply Now</button>
                      <button className="p-2 border border-gray-200 rounded-lg">
                        <Bookmark size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Skills, Resume, Activity (30% width) */}
              <div className="flex-1 space-y-5">

                {/* Skill Profile */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm">Skill Profile</h3>
                    <button className="text-xs font-medium text-blue-600">+ Add Skill</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] rounded-md">Python</span>
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] rounded-md">Machine Learning</span>
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] rounded-md">SQL</span>
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] rounded-md">HTML</span>
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] rounded-md">JavaScript</span>
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 text-[11px] rounded-md">Git</span>
                  </div>
                  <p className="text-[10px] text-gray-500 pt-3 border-t border-gray-100">
                    Your skills are used by our AI to recommend the best internship matches.
                  </p>
                </div>

                {/* Resume Upload */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Resume Upload</h3>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-1.5 rounded">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">Resume_2024.pdf</p>
                        <p className="text-[10px] text-green-600">Uploaded successfully ✓</p>
                      </div>
                      <button className="text-[10px] text-gray-400 hover:text-gray-600">Change</button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Recent Activity</h3>
                  <div className="space-y-3">

                    <div className="flex gap-2">
                      <div className="bg-green-100 p-1.5 rounded h-7 w-7 flex items-center justify-center">
                        <Clock size={12} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-800">Applied to Data Science Intern at TechCorp Solutions</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="bg-blue-100 p-1.5 rounded h-7 w-7 flex items-center justify-center">
                        <Bell size={12} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-800">New recommendation: ML Engineer at AI Innovations</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">5 hours ago</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="bg-purple-100 p-1.5 rounded h-7 w-7 flex items-center justify-center">
                        <Eye size={12} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-800">Profile viewed by WebDev Studios</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Yesterday</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="bg-red-100 p-1.5 rounded h-7 w-7 flex items-center justify-center">
                        <AlertCircle size={12} className="text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-800">Deadline approaching: Frontend Developer at StartUp Hub</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;