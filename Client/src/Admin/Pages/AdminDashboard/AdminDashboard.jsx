import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { 
  Building2, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ChevronRight,
  ExternalLink,
  PlusCircle,
  FileText,
  LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    centers: 0,
    volunteers: 0,
    activeDisasters: 0,
    resolvedRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metricCards = [
    {
      label: "Relief Centers",
      value: stats.centers,
      icon: Building2,
      trend: "+2 this week",
      trendUp: true,
      color: "indigo",
      description: "Total registered centers"
    },
    {
      label: "Active Volunteers",
      value: stats.volunteers,
      icon: Users,
      trend: "+12 new today",
      trendUp: true,
      color: "emerald",
      description: "Verified field personnel"
    },
    {
      label: "Active Alerts",
      value: stats.activeDisasters,
      icon: AlertCircle,
      trend: "Critical priority",
      trendUp: false,
      color: "red",
      description: "Ongoing emergency reports"
    },
    {
      label: "Resolved Cases",
      value: stats.resolvedRequests,
      icon: CheckCircle2,
      trend: "84% success rate",
      trendUp: true,
      color: "blue",
      description: "Completed assistance requests"
    },
  ];

  const recentActivity = [
    { id: 1, type: "center", text: "New center 'SafeHaven' approved in Kozhikode", time: "2 hours ago", status: "success" },
    { id: 2, type: "alert", text: "Flash flood alert reported near Wayanad", time: "4 hours ago", status: "urgent" },
    { id: 3, type: "volunteer", text: "15 volunteers joined the relief mission", time: "6 hours ago", status: "info" },
    { id: 4, type: "report", text: "Monthly casualty report finalized for Feb 2024", time: "1 day ago", status: "default" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[2.5rem] font-bold text-slate-100 leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
            Operational Overview
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Central control for disaster relief coordination.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => navigate("/admin/Reports")}
             className="flex items-center gap-2 px-5 py-2.5 bg-[#161b22] border border-[#30363d] text-slate-300 rounded-xl text-sm font-bold hover:bg-[#21262d] transition-all"
           >
             <FileText size={16} /> Reports
           </button>
           <button 
             onClick={() => navigate("/admin/MasterEntries")}
             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
           >
             <PlusCircle size={16} /> New Entry
           </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {metricCards.map((card) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            className="group relative bg-[#161b22] border border-[#30363d] hover:border-indigo-500/50 rounded-3xl p-6 transition-all duration-300 shadow-xl"
          >
            <div className="flex items-start justify-between mb-6">
               <div className={`p-3 rounded-2xl bg-${card.color}-500/10 text-${card.color}-400 ring-1 ring-${card.color}-500/20`}>
                 <card.icon size={22} />
               </div>
               <div className={`flex items-center gap-1 text-xs font-bold ${card.trendUp ? 'text-emerald-400' : 'text-slate-500'}`}>
                 {card.trend}
                 {card.trendUp ? <ArrowUpRight size={12} /> : null}
               </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{card.label}</p>
              <h3 className="text-4xl font-bold text-slate-100 mt-2 font-mono">{card.value}</h3>
              <p className="text-slate-600 text-[10px] mt-4 font-bold tracking-widest uppercase">{card.description}</p>
            </div>
            
            {/* Subtle bottom accent */}
            <div className={`absolute bottom-0 left-6 right-6 h-[2px] bg-${card.color}-500/30 blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity`} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-2 bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="p-6 border-b border-[#30363d]/50 flex items-center justify-between bg-[#1c2128]/30">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Clock size={20} className="text-indigo-400" />
              Intelligence Feed
            </h2>
            <button className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Refresh Feed
            </button>
          </div>
          <div className="divide-y divide-[#30363d]/50 flex-1 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-5 flex items-start gap-4 hover:bg-[#21262d]/30 transition-colors group">
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  activity.status === 'success' ? 'bg-emerald-500' :
                  activity.status === 'urgent' ? 'bg-red-500 animate-pulse' :
                  activity.status === 'info' ? 'bg-indigo-500' : 'bg-slate-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-300 font-medium group-hover:text-slate-100 transition-colors">{activity.text}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all">
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
          <button className="p-4 bg-[#1c2128]/50 text-slate-400 text-xs font-bold hover:text-slate-200 uppercase tracking-widest border-t border-[#30363d]/50 transition-colors text-center w-full">
            View System Logs
          </button>
        </motion.div>

        {/* Quick Management */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h2 className="text-lg font-bold text-slate-200 px-2 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-indigo-400" />
            Quick Access
          </h2>
          <div className="space-y-3">
            {[
              { name: "Manage Centers", path: "/admin/Centers", color: "blue" },
              { name: "Volunteer Network", path: "/admin/Volunteers", color: "emerald" },
              { name: "Crisis Monitoring", path: "/admin/Reports", color: "red" },
              { name: "System Settings", path: "/admin/MasterEntries", color: "indigo" },
              { name: "Audit & Exports", path: "/admin/DownloadReports", color: "purple" }
            ].map((action) => (
              <button
                key={action.name}
                onClick={() => navigate(action.path)}
                className="w-full bg-[#161b22] border border-[#30363d] hover:border-indigo-500/50 hover:bg-[#1c2128] rounded-2xl p-4 flex items-center justify-between group transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-${action.color}-500/10 border border-${action.color}-500/20 flex items-center justify-center text-${action.color}-400 group-hover:scale-110 transition-transform`}>
                    <ChevronRight size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-slate-100">{action.name}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={16} className="text-indigo-400" />
                </div>
              </button>
            ))}
          </div>
          
          {/* Quick Support Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 relative overflow-hidden group shadow-2xl">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
             <h3 className="text-white font-bold text-lg relative z-10">System Status: Stable</h3>
             <p className="text-indigo-100 text-xs mt-2 relative z-10 opacity-80 leading-relaxed">
               All relief networks are operational. Request latency is at 45ms.
             </p>
             <button className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest backdrop-blur-md transition-all relative z-10">
               Open Heath Dashboard
             </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;