import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, UserCircle, User, LogOut, ChevronDown } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { useSaved } from '../context/SavedContext';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Profile', path: '/profile' },
  { label: 'Internships', path: '/internships' },
  { label: 'Applications', path: '/applied' },
];

// Reads the same 'userProfile' key that SignupModal / Profile page use,
// so the name shown here always matches the Profile page.
function loadProfileName() {
  try {
    const raw = localStorage.getItem('userProfile');
    if (!raw) return 'Your Name';
    const saved = JSON.parse(raw);
    return saved.name?.trim() || 'Your Name';
  } catch {
    return 'Your Name';
  }
}

const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearResume } = useResume();
  const { clearSaved } = useSaved();
  const studentName = loadProfileName();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const goToProfile = () => {
    setMenuOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setMenuOpen(false);
    clearResume(); // Recommended Internships get locked again
    clearSaved();  // saved internships belong to the logged-in user
    navigate('/', { replace: true });
  };

  return (
    <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center sticky top-0 z-20">
      <div className="w-full flex items-center justify-between px-8 h-full">

        {/* Left Side: Navigation Links */}
        <nav className="flex items-center gap-8 h-full">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`h-full flex items-center text-sm font-semibold transition-colors relative ${
                  isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {item.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Notification & User */}
        <div className="flex items-center gap-5">
          <div className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
            <Bell size={19} className="group-hover:text-blue-600 transition-colors" />
            <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full border-2 border-white font-bold leading-none">
              3
            </span>
          </div>

          {/* User menu */}
          <div className="relative pl-5 border-l border-gray-100" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors"
            >
              <p className="text-xs font-bold text-gray-900">{studentName}</p>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-50">
                <UserCircle size={22} className="text-blue-500" />
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-30"
              >
                <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900 truncate">{studentName}</p>
                  <p className="text-xs text-gray-500">Student account</p>
                </div>

                <button
                  role="menuitem"
                  onClick={goToProfile}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} />
                  My Profile
                </button>

                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default TopNav;