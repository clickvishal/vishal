import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { useQuiz } from '../context/QuizContext';
import {
  Sparkles,
  Home,
  LayoutGrid,
  Zap,
  Info,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Search,
} from 'lucide-react';

interface HeaderProps {
  onOpenAuth: (initialTab: 'login' | 'signup') => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenSearch }) => {
  const { currentPath, navigate } = useRouter();
  const { user, isAdmin, logout } = useQuiz();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Categories', path: '/categories', icon: LayoutGrid },
    { label: 'Daily Quiz', path: '/quiz/brain-challenge', icon: Zap },
    { label: 'About', path: '/about', icon: Info },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070b15]/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Left Zone: Quiz Nova Brand Lockup */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
            title="Quiz Nova Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md border border-indigo-400/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 fill-white/20" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              Quiz Nova
            </span>
          </Link>

          {/* Center Zone: Island Capsule Navigation Bar (Exact Match to Reference) */}
          <nav className="hidden md:flex items-center bg-[#0d1424]/90 border border-slate-800/80 rounded-full px-2 py-1.5 shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(link.path);

              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Zone: Search pill, Login, Sign Up, Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Pill */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-[#0d1424] hover:bg-[#131d33] border border-slate-800 rounded-full transition-colors cursor-pointer"
              title="Search quizzes (Q)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search...</span>
            </button>

            {/* Admin discrete button (Only shown to authenticated admins) */}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className={`p-2 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  currentPath.startsWith('/admin')
                    ? 'bg-slate-800 text-indigo-400'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                }`}
                title="Admin Dashboard"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-[#0e1628] border border-slate-800 rounded-full transition-colors cursor-pointer"
                  aria-expanded={profileDropdownOpen}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-[#0e1628] rounded-xl shadow-2xl border border-slate-800 py-1.5 z-50 animate-in fade-in duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                      User Dashboard
                    </button>
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      Admin Management
                    </button>
                    <div className="my-1 border-t border-slate-800" />
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-full shadow-md transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-400 hover:text-white bg-[#0e1628] rounded-full border border-slate-800"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-[#0e1628] rounded-full border border-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0a0f1d] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => handleNavClick('/dashboard')}
              className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2.5 ${
                currentPath === '/dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>User Dashboard</span>
            </button>
            <button
              onClick={() => handleNavClick('/admin')}
              className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2.5 ${
                currentPath === '/admin' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin Dashboard UI</span>
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-800">
            {user ? (
              <div className="flex items-center justify-between p-2.5 bg-[#0e1628] rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg text-xs"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2 text-center text-xs font-semibold text-slate-200 bg-[#0e1628] hover:bg-slate-800 border border-slate-800 rounded-full transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="w-full py-2 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
