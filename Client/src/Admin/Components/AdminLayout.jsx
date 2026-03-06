import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  AlertCircle, 
  Download, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Bell,
  ChevronRight,
  User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/guest/login", { replace: true });
    }
  }, [user, loading, navigate]);

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
      navigate("/guest/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin", end: true, icon: LayoutDashboard },
    { name: "Centers", path: "/admin/Centers", icon: Building2 },
    { name: "Volunteers", path: "/admin/Volunteers", icon: Users },
    { name: "Reports", path: "/admin/Reports", icon: AlertCircle },
    { name: "Downloads", path: "/admin/DownloadReports", icon: Download },
    { name: "Master Entries", path: "/admin/MasterEntries", icon: Settings },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const adminName = user?.name || "Admin Portal";
  const initials = adminName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 flex overflow-hidden font-sans selection:bg-indigo-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        body { margin: 0; background: #0d1117; font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Persistent Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#161b22] border-r border-[#30363d] h-screen sticky top-0 z-40">
        <div className="p-8 border-b border-[#30363d]/50">
          <button 
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3 group bg-transparent border-none cursor-pointer p-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all duration-300">
              <span className="text-xl">🛡️</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-100 text-xl tracking-tight leading-none" style={{ fontFamily: "'Playfair Display',serif" }}>
                CrisisAid
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400/80 font-bold mt-1">
                Admin Console
              </span>
            </div>
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 mt-2">Main Navigation</p>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#21262d]"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <link.icon size={18} className="opacity-80" />
                {link.name}
              </div>
              <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-[#30363d]/50 bg-[#0d1117]/50">
           <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate">{adminName}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">System Admin</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
           </div>
        </div>
      </aside>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Navbar */}
        <header className="h-20 lg:h-16 flex items-center justify-between px-6 bg-[#0d1117]/80 backdrop-blur-xl border-b border-[#30363d] sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="lg:hidden p-2 text-slate-400 hover:bg-[#21262d] rounded-lg"
             >
               <Menu size={24} />
             </button>
             <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] hidden sm:block">
               {navLinks.find(l => l.path === location.pathname)?.name || "Dashboard"}
             </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-100 hover:bg-[#21262d] rounded-xl transition-all group">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0d1117]" />
            </button>
            <div className="h-6 w-[1px] bg-[#30363d] mx-2" />
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 rounded-full border border-transparent hover:border-[#30363d] hover:bg-[#161b22] transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold">
                  {initials}
                </div>
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl py-3 z-50 overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-[#30363d]/50 bg-[#0d1117]/50">
                      <p className="text-sm font-bold text-slate-200">{adminName}</p>
                      <p className="text-xs text-slate-500 mt-1">administrator@crisisaid.gov</p>
                    </div>
                    <div className="p-2">
                       <button 
                        onClick={() => navigate("/admin/MasterEntries")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-400/5 rounded-xl transition-colors"
                       >
                         <Settings size={16} /> settings
                       </button>
                       <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-400/5 rounded-xl transition-colors"
                       >
                         <LogOut size={16} /> Sign Out
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto relative scroll-smooth bg-[#0d1117]">
          {/* Background Gradient Mesh */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
          
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-full">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[50]" 
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-80 bg-[#161b22] border-r border-[#30363d] z-[60] flex flex-col"
            >
              <div className="p-8 flex justify-between items-center border-b border-[#30363d]/50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">🛡️</div>
                    <span className="font-bold text-slate-100 text-xl" style={{ fontFamily: "'Playfair Display',serif" }}>CrisisAid</span>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:bg-[#21262d] rounded-lg">
                   <X size={24} />
                 </button>
              </div>
              <nav className="flex-1 p-6 space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.end}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                        isActive
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-[#21262d]"
                      }`
                    }
                  >
                    <link.icon size={20} />
                    {link.name}
                  </NavLink>
                ))}
              </nav>
              <div className="p-8 border-t border-[#30363d]/50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-400/10 text-red-400 rounded-2xl font-bold hover:bg-red-400/20 transition-all"
                >
                  <LogOut size={20} /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
