import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useVolunteerTheme } from "../../context/VolunteerThemeContext";

const VolunteerNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useVolunteerTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/guest/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/volunteer", end: true, icon: "📊" },
    { name: "Assignments", path: "/volunteer/assignments", icon: "📋" },
    { name: "Disasters", path: "/volunteer/disasters", icon: "🌪️" },
    { name: "Feedback", path: "/volunteer/feedback", icon: "💬" },
    { name: "My Profile", path: "/volunteer/profile", icon: "👤" },
  ];

  const volunteerName = user?.name || "Volunteer";
  const initials = volunteerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
      `}</style>
      <nav className={`${isDark ? 'bg-[#161b22]/95 border-[#30363d]' : 'bg-white/95 border-slate-200'} backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-8">
              <button
                type="button"
                className="flex-shrink-0 flex items-center gap-3 cursor-pointer group bg-transparent border-none"
                onClick={() => navigate("/volunteer")}
                aria-label="Go to Volunteer Dashboard"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-emerald-400/20 group-hover:scale-105 transition-transform">
                  🤝
                </div>
                <div className="flex flex-col text-left">
                  <span
                    className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'} text-lg tracking-tight leading-none`}
                    style={{ fontFamily: "'Playfair Display',serif" }}
                  >
                    CrisisAid
                  </span>
                  <span className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'} font-semibold group-hover:text-emerald-400 transition-colors`}>
                    Volunteer Portal
                  </span>
                </div>
              </button>
              <div className="hidden xl:flex xl:items-center xl:space-x-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.end}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        isActive
                          ? "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20 shadow-sm"
                          : isDark 
                            ? "text-slate-400 hover:text-slate-100 hover:bg-[#21262d]"
                            : "text-slate-500 hover:text-emerald-600 hover:bg-slate-100"
                      }`
                    }
                  >
                    <span className="opacity-70">{link.icon}</span>
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Side (Theme Toggle, Profile & Mobile Toggle) */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? "bg-[#21262d] border-[#30363d] text-amber-400 hover:bg-[#30363d]" 
                    : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                }`}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-3 p-1.5 rounded-xl transition-all border border-transparent group ${
                    isDark ? 'hover:bg-[#21262d] hover:border-[#30363d]' : 'hover:bg-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="hidden md:flex flex-col items-end">
                    <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'} group-hover:text-emerald-500 transition-colors`}>
                      {volunteerName}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} font-mono`}>
                      {user?.email || "Volunteer"}
                    </span>
                  </div>
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-bold shadow-inner transition-colors ${
                    isDark 
                      ? 'bg-[#21262d] border-[#30363d] text-emerald-400 group-hover:border-emerald-400/30' 
                      : 'bg-white border-slate-200 text-emerald-600 group-hover:border-emerald-500/30'
                  }`}>
                    {initials}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 w-56 border rounded-xl shadow-2xl py-2 transform origin-top-right transition-all z-50 ${
                    isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`px-4 py-3 border-b mb-1 md:hidden ${isDark ? 'border-[#21262d]' : 'border-slate-100'}`}>
                      <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{volunteerName}</p>
                      <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{user?.email}</p>
                    </div>
                    
                    <NavLink
                      to="/volunteer/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-emerald-400/10 text-emerald-400 border-l-2 border-emerald-400"
                            : isDark 
                              ? "text-slate-300 hover:bg-[#21262d] hover:text-white border-l-2 border-transparent"
                              : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600 border-l-2 border-transparent"
                        }`
                      }
                    >
                      <span>👤</span> Overview
                    </NavLink>
                    
                    <div className={`h-px my-1 ${isDark ? 'bg-[#21262d]' : 'bg-slate-100'}`} />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center xl:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`inline-flex items-center justify-center p-2 rounded-lg focus:outline-none transition-colors border border-transparent ${
                    isDark 
                      ? 'text-slate-400 hover:text-white hover:bg-[#21262d] hover:border-[#30363d]' 
                      : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMobileMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`xl:hidden border-b shadow-2xl transition-colors duration-300 ${
            isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'
          }`}>
            <div className="px-4 pt-3 pb-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20"
                        : isDark 
                          ? "text-slate-400 hover:text-slate-100 hover:bg-[#21262d]"
                          : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <span className="text-xl opacity-80">{link.icon}</span>
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default VolunteerNavbar;
