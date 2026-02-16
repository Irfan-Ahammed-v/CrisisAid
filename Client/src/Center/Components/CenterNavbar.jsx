import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const CenterNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
    { name: "Dashboard", path: "/center", end: true, icon: "📊" },
    { name: "Requests", path: "/center/requests", icon: "📋" },
    { name: "Disasters", path: "/center/disaster-reports", icon: "🚨" },
    { name: "Volunteers", path: "/center/volunteer-management", icon: "🤝" },
    { name: "Camps", path: "/center/camp-management", icon: "🏕️" },
    { name: "Approvals", path: "/center/pending-approvals", icon: "⏳" },
  ];

  const centerName = user?.center_name || user?.name || "Center Portal";
  const initials = centerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
      `}</style>
      <nav className="bg-[#161b22]/95 backdrop-blur-md border-b border-[#30363d] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-8">
              <button
                type="button"
                className="flex-shrink-0 flex items-center gap-3 cursor-pointer group bg-transparent border-none"
                onClick={() => navigate("/center")}
                aria-label="Go to Center Dashboard"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
                  🏛️
                </div>
                <div className="flex flex-col">
                  <span
                    className="font-bold text-slate-100 text-lg tracking-tight leading-none"
                    style={{ fontFamily: "'Playfair Display',serif" }}
                  >
                    CrisisAid
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold group-hover:text-amber-400 transition-colors">
                    Center Portal
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
                          ? "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20 shadow-sm"
                          : "text-slate-400 hover:text-slate-100 hover:bg-[#21262d]"
                      }`
                    }
                  >
                    <span className="opacity-70">{link.icon}</span>
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Side (Profile & Mobile Toggle) */}
            <div className="flex items-center gap-4">
              
              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#21262d] transition-all border border-transparent hover:border-[#30363d] group"
                >
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                      {centerName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {user?.email || "Center Admin"}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-sm font-bold text-amber-400 shadow-inner group-hover:border-amber-400/30 transition-colors">
                    {initials}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl py-2 transform origin-top-right transition-all z-50">
                    <div className="px-4 py-3 border-b border-[#21262d] mb-1 md:hidden">
                      <p className="text-sm font-bold text-white truncate">{centerName}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    
                    <NavLink
                      to="/center/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-amber-400/10 text-amber-400 border-l-2 border-amber-400"
                            : "text-slate-300 hover:bg-[#21262d] hover:text-white border-l-2 border-transparent"
                        }`
                      }
                    >
                      <span>👤</span> Profile Settings
                    </NavLink>
                    
                    <div className="h-px bg-[#21262d] my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors text-left"
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
                  className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d] focus:outline-none transition-colors border border-transparent hover:border-[#30363d]"
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
          <div className="xl:hidden bg-[#161b22] border-b border-[#30363d] shadow-2xl">
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
                        ? "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20"
                        : "text-slate-400 hover:text-slate-100 hover:bg-[#21262d]"
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

export default CenterNavbar;