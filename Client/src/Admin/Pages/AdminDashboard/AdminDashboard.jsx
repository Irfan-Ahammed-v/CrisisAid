import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { 
  Building2, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ChevronRight,
  PlusCircle,
  FileText,
  MapPin,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";

// 1. Move static constants outside to prevent re-renders
const BASE_URL = "http://localhost:5000";
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6', '#ec4899'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 } // Fast stagger
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    centers: 0,
    volunteers: 0,
    activeDisasters: 0,
    resolvedRequests: 0,
  });
  const [analyticsData, setAnalyticsData] = useState({
    disasterByType: [],
    disasterByDistrict: [],
    statusStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          axios.get(`${BASE_URL}/admin/dashboard-stats`),
          axios.get(`${BASE_URL}/admin/analytics-stats`)
        ]);
        if (isMounted) {
          setStats(statsRes.data);
          setAnalyticsData(analyticsRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // 2. Memoize metric cards for stability
  const metricCards = useMemo(() => [
    { label: "Relief Centers", value: stats.centers, icon: Building2, trend: "+2 this week", trendUp: true, color: "indigo", description: "Total registered centers" },
    { label: "Active Volunteers", value: stats.volunteers, icon: Users, trend: "+12 new today", trendUp: true, color: "emerald", description: "Verified field personnel" },
    { label: "Active Alerts", value: stats.activeDisasters, icon: AlertCircle, trend: "Critical priority", trendUp: false, color: "red", description: "Ongoing emergency reports" },
    { label: "Resolved Cases", value: stats.resolvedRequests, icon: CheckCircle2, trend: "84% success rate", trendUp: true, color: "blue", description: "Completed assistance requests" },
  ], [stats]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-none">
            Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-indigo-500">Intelligence</span>
          </h1>
          <p className="text-slate-500 mt-4 text-sm font-bold uppercase tracking-[0.3em]">Operational Command Center</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => navigate("/admin/Reports")}
             className="flex items-center gap-2 px-8 py-4 bg-[#161b22] border border-[#30363d] text-slate-300 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:border-red-500/30 transition-all"
           >
             <FileText size={16} className="text-red-500" /> Disaster Logs
           </button>
           <button 
             onClick={() => navigate("/admin/MasterEntries")}
             className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_0_30px_-5px_rgba(79,70,229,0.35)]"
           >
             <PlusCircle size={16} /> Configuration Hub
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
            className="group relative bg-[#161b22] border border-[#30363d] hover:border-indigo-500/40 rounded-[2.5rem] p-8 transition-all duration-300 shadow-2xl"
          >
            <div className="flex items-start justify-between mb-8">
               <div className={`p-4 rounded-2xl bg-${card.color}-500/10 text-${card.color}-400 ring-1 ring-${card.color}-500/20`}>
                 <card.icon size={24} />
               </div>
               <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${card.trendUp ? 'text-emerald-400' : 'text-slate-500'}`}>
                 {card.trend}
                 {card.trendUp ? <ArrowUpRight size={14} /> : null}
               </div>
            </div>
            <div>
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-2">{card.label}</p>
              <h3 className="text-4xl font-black text-slate-100 tracking-tighter">{card.value}</h3>
              <p className="text-slate-600 text-[9px] mt-6 font-bold tracking-[0.2em] leading-relaxed opacity-60 uppercase">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Primary Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Bar Chart - 8 Columns */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="xl:col-span-8 bg-[#161b22] border border-[#30363d] rounded-[3rem] p-10 overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-xl font-black text-slate-200 flex items-center gap-3 tracking-tight">
                <MapPin size={24} className="text-orange-500" />
                Regional Incident Intensity
              </h2>
              <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Cross-District Comparative Analysis</p>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <BarChart data={analyticsData.disasterByDistrict}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="900" 
                  tickFormatter={(val) => val.substring(0, 8)}
                  dy={10}
                />
                <YAxis stroke="#475569" fontSize={10} fontWeight="900" />
                <Tooltip 
                  cursor={{ fill: '#30363d', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#ef4444', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorBarDash)" 
                  radius={[8, 8, 0, 0]} 
                  barSize={45} 
                  animationDuration={1500}
                />
                <defs>
                  <linearGradient id="colorBarDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart - 4 Columns */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="xl:col-span-4 bg-[#161b22] border border-[#30363d] rounded-[3rem] p-10 overflow-hidden shadow-2xl"
        >
          <div className="mb-12">
            <h2 className="text-xl font-black text-slate-200 flex items-center gap-3 tracking-tight">
              <TrendingUp size={24} className="text-indigo-500" />
              Category Mix
            </h2>
            <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Disaster Type Distribution</p>
          </div>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <PieChart>
                <Pie
                  data={analyticsData.disasterByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={1500}
                >
                  {analyticsData.disasterByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '14px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-y-4 mt-8">
            {analyticsData.disasterByType.slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Advanced Trends Visualization */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#161b22] border border-[#30363d] rounded-[3rem] p-12 overflow-hidden shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-4 tracking-tighter">
              <Activity size={32} className="text-emerald-500" />
              Resolution Efficiency Metrics
            </h2>
            <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-[0.4em]">Historical Resolution Success Tracking</p>
          </div>
        </div>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <AreaChart data={analyticsData.statusStats}>
              <defs>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                fontSize={10} 
                fontWeight="900" 
                dy={15}
                tickFormatter={(val) => val.toUpperCase()}
              />
              <YAxis stroke="#475569" fontSize={10} fontWeight="900" dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '16px' }}
                itemStyle={{ color: '#10b981', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#10b981" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorResolved)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
