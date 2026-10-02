import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Briefcase, Send, Bookmark, FileUp, Settings, Lock } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasResume } = useResume();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <User size={20} />, label: 'My Profile', path: '/profile' },
    { icon: <Briefcase size={20} />, label: 'Recommended Internships', path: '/internships', locked: true },
    { icon: <Send size={20} />, label: 'Applied Internships', path: '/applied' },
    { icon: <Bookmark size={20} />, label: 'Saved Internships', path: '/saved' },
    { icon: <FileUp size={20} />, label: 'Resume Upload', path: '/resume' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-4 sticky top-0">
      <div className="flex items-center gap-2 mb-10 px-2">
         <div className="nav-logo-icon">
                <svg viewBox="0 0 16 16" fill="none" style={{width: '14px', height: '14px'}}>
                  <path d="M8 1l1.5 3 3.5.5-2.5 2.5.5 3.5L8 9l-3 1.5.5-3.5L3 4.5 6.5 4 8 1z" fill="white"/>
                </svg>
              </div>
        <span className="font-bold text-sm leading-tight text-gray-800">InternIQ</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const isLocked = item.locked && !hasResume;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isLocked ? 'opacity-50' : ''} ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
              {isLocked && <Lock size={14} className="ml-auto" />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto bg-blue-50 p-4 rounded-xl">
        <p className="text-sm font-bold text-gray-800 mb-1">Need Help?</p>
        <p className="text-xs text-gray-500 mb-3">Contact our support team for assistance.</p>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold">
          Get Support
        </button>
      </div>
    </div>
  );
};

export default Sidebar;