import React from "react";
import { Link } from "react-router";
import { useVolunteerTheme } from "../../context/VolunteerThemeContext";

const VolunteerFooter = () => {
  const { theme } = useVolunteerTheme();
  const isDark = theme === "dark";

  const navigation = [
    { name: "Dashboard", href: "/volunteer/dashboard" },
    { name: "Active Requests", href: "/volunteer/requests" },
    { name: "My Assignments", href: "/volunteer/assignments" },
    { name: "Profile", href: "/volunteer/profile" },
    { name: "Feedback", href: "/volunteer/feedback" },
    { name: "Gallery", href: "/volunteer/gallery" },
  ];

  return (
    <footer className={`transition-colors duration-300 border-t ${
      isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/volunteer/home" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black italic">
                C
              </div>
              <span className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                CrisisAid <span className="text-emerald-500 italic">Volunteer</span>
              </span>
            </Link>
            <p className={`text-xs font-medium max-w-[240px] text-center md:text-left ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Empowering responders with real-time data to save lives and manage relief efforts effectively.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-xs font-black uppercase tracking-widest transition-colors hover:text-emerald-500 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
          isDark ? 'border-[#30363d]' : 'border-slate-100'
        }`}>
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            © 2026 CrisisAid. Official Responder Portal.
          </p>
          <div className="flex items-center gap-6">
          </div>
        </div>
      </div>
    </footer>
  );
};

export default VolunteerFooter;
