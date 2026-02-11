import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); //BACKEND
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If user not loaded yet, don't render navbar
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/guest/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            // onClick={() => navigate("/camp")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CA</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              CrisisAid
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* Role-based action */}
            {user.role === "camp" && (
              <button
                onClick={() => navigate("/camp/new-request")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Request Help
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center border-2 border-slate-300">
                  <span className="text-white font-semibold text-sm">
                    {user.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>

                <svg
                  className={`w-4 h-4 text-slate-600 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border overflow-hidden animate-fadeIn">
                  <div className="px-4 py-3 bg-blue-50 border-b">
                    <p className="text-sm font-bold">{user.name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      {user.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="py-2">
                    <MenuItem label="My Profile" onClick={() => navigate("/camp/profile")} />
                    <MenuItem label="My Requests" onClick={() => navigate("/camp/requests")} />
                  </div>

                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

const MenuItem = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
  >
    {label}
  </button>
);

export default NavBar;
