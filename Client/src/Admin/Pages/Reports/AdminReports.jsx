import { useEffect, useState } from "react";
import axios from "axios";
import { 
  AlertTriangle, 
  MapPin, 
  Building2, 
  Calendar, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  Info,
  Layers,
  LayoutGrid,
  Tent
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = "http://localhost:5000/api";

export default function AdminReports() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [districts, setDistricts] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchData();
    fetchMetadata();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin/disasters`);
      setDisasters(res.data.disasters || []);
    } catch (err) {
      console.error("Fetch disasters error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [distRes, typeRes] = await Promise.all([
        axios.get(`${BASE_URL}/admin/districts`),
        axios.get(`${BASE_URL}/admin/disaster-types`)
      ]);
      setDistricts(distRes.data || []);
      setTypes(typeRes.data || []);
    } catch (err) {
      console.error("Metadata fetch error:", err);
    }
  };

  const filteredDisasters = disasters.filter(d => {
    const matchesSearch = d.disaster_details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.disaster_type?.disaster_type_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = !districtFilter || d.district_id?._id === districtFilter;
    const matchesType = !typeFilter || d.disaster_type?._id === typeFilter;
    return matchesSearch && matchesDistrict && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 p-6 lg:p-10 pb-24">
      {/* Header Section */}
      <header className="max-w-[1400px] mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/5">
                <AlertTriangle size={24} />
              </div>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Crisis Alert System</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Disaster <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Reports</span>
            </h1>
            <p className="text-slate-500 mt-3 text-sm font-bold uppercase tracking-widest max-w-xl">
              Real-time situational awareness across the disaster response network
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#161b22] p-2 rounded-2xl border border-[#30363d] shadow-2xl">
            <div className="px-6 py-2 border-r border-[#30363d]/50">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Logs</p>
               <p className="text-xl font-black text-white leading-none">{disasters.length}</p>
            </div>
            <div className="px-6 py-2">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Active Alerts</p>
               <p className="text-xl font-black text-red-500 leading-none">{disasters.filter(d => d.disaster_status !== 'resolved').length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="max-w-[1400px] mx-auto mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search report details or types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-[#30363d] rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white focus:outline-none focus:border-red-500/40 focus:ring-4 focus:ring-red-500/5 transition-all outline-none placeholder:text-slate-600"
          />
        </div>

        <div className="md:col-span-3 flex items-center bg-[#161b22] border border-[#30363d] rounded-2xl px-5 relative">
          <MapPin size={18} className="text-slate-500" />
          <select 
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full bg-transparent border-none py-4 text-sm font-black text-white focus:ring-0 cursor-pointer appearance-none ml-2 uppercase tracking-widest"
          >
            <option value="" className="bg-[#161b22]">All Districts</option>
            {districts.map(d => (
              <option key={d._id} value={d._id} className="bg-[#161b22]">{d.districtName}</option>
            ))}
          </select>
          <Filter size={14} className="text-slate-600 absolute right-5 pointer-events-none" />
        </div>

        <div className="md:col-span-3 flex items-center bg-[#161b22] border border-[#30363d] rounded-2xl px-5 relative">
          <Layers size={18} className="text-slate-500" />
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-transparent border-none py-4 text-sm font-black text-white focus:ring-0 cursor-pointer appearance-none ml-2 uppercase tracking-widest"
          >
            <option value="" className="bg-[#161b22]">All Categories</option>
            {types.map(t => (
              <option key={t._id} value={t._id} className="bg-[#161b22]">{t.disaster_type_name}</option>
            ))}
          </select>
          <Filter size={14} className="text-slate-600 absolute right-5 pointer-events-none" />
        </div>

        <button 
          onClick={fetchData}
          className="md:col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:border-red-500/40 transition-all font-black text-xs uppercase tracking-widest"
        >
          Refresh Feed
        </button>
      </div>

      {/* Reports Grid */}
      <div className="max-w-[1400px] mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-[2.5rem] h-[500px] animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredDisasters.map(d => (
                <motion.div
                  key={d._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#161b22] border border-[#30363d] rounded-[2.5rem] overflow-hidden group hover:border-red-500/40 transition-all duration-500 shadow-xl relative flex flex-col"
                >
                  {/* Image Header */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <img 
                      src={`http://localhost:5000/uploads/disasters/${d.disaster_photo}`}
                      alt={d.disaster_type?.disaster_type_name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-[#161b22]/20 to-transparent" />
                    
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <div className="px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-2">
                        <AlertTriangle size={12} />
                        {d.disaster_type?.disaster_type_name || "Emergency"}
                      </div>
                    </div>

                    <div className="absolute top-6 right-6">
                      <div className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                        <Clock size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                      <Calendar size={14} className="text-red-500" />
                      {new Date(d.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-8 italic">
                      "{d.disaster_details}"
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0d1117]/60 border border-[#30363d]/50 rounded-2xl p-4">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 leading-none">Reporting Center</p>
                          <p className="text-xs text-slate-200 font-bold truncate flex items-center gap-1.5">
                            <Building2 size={12} className="text-red-500" />
                            {d.center_id?.center_name || "Regional Ops"}
                          </p>
                        </div>
                        <div className="bg-[#0d1117]/60 border border-[#30363d]/50 rounded-2xl p-4">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 leading-none">Target Relif Camp</p>
                          <p className="text-xs text-slate-200 font-bold truncate flex items-center gap-1.5">
                            <Tent size={12} className="text-red-500" />
                            {d.reliefcamp_id?.camp_name || "Standby Status"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-[#30363d]/50">
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Tracking</span>
                         </div>
                         <button 
                           onClick={() => setSelectedDisaster(d)}
                           className="flex items-center gap-2 text-[10px] font-black text-white hover:text-red-500 transition-colors uppercase tracking-[0.2em] group/btn"
                         >
                           Analyze Report <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredDisasters.length === 0 && !loading && (
              <div className="col-span-full py-32 text-center rounded-[3rem] border-2 border-dashed border-[#30363d] bg-[#161b22]/40">
                <div className="w-24 h-24 rounded-full bg-[#1c2128] border border-[#30363d] flex items-center justify-center text-slate-700 mx-auto mb-8 shadow-2xl">
                  <LayoutGrid size={48} />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">No anomalies detected</h3>
                <p className="text-slate-500 mt-4 text-sm font-bold uppercase tracking-[0.3em]">The monitored spectrum is currently clear</p>
                <button 
                  onClick={() => {setDistrictFilter(""); setTypeFilter(""); setSearchQuery("");}}
                  className="mt-10 px-12 py-5 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-500/5"
                >
                   Clear Surveillance Filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedDisaster && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl transition-all"
            onClick={() => setSelectedDisaster(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#161b22] border border-[#30363d] w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Modal Image Section */}
              <div className="md:w-1/2 relative bg-black min-h-[400px]">
                <img 
                  src={`http://localhost:5000/uploads/disasters/${selectedDisaster.disaster_photo}`}
                  alt="Disaster Scale"
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#161b22]" />
                <div className="absolute top-10 left-10">
                   <div className="px-6 py-3 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                     <AlertTriangle size={18} /> {selectedDisaster.disaster_type?.disaster_type_name}
                   </div>
                </div>
              </div>

              {/* Modal Info Section */}
              <div className="md:w-1/2 p-10 md:p-16 overflow-y-auto no-scrollbar relative">
                <button 
                  onClick={() => setSelectedDisaster(null)}
                  className="absolute top-10 right-10 p-4 bg-[#21262d] hover:bg-[#2d333b] text-slate-400 hover:text-white rounded-2xl transition-all border border-[#30363d]"
                >
                   <ChevronRight size={24} className="rotate-180" />
                </button>

                <div className="mb-12">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-[2px] bg-red-500" />
                     <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Comprehensive Audit Report</p>
                   </div>
                   <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-6">Log Record: Dist-{selectedDisaster._id.slice(-6).toUpperCase()}</h2>
                   
                   <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] rounded-xl border border-[#30363d] text-[10px] font-black uppercase tracking-widest">
                        <MapPin size={14} className="text-red-500" /> {selectedDisaster.district_id?.districtName}
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] rounded-xl border border-[#30363d] text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Clock size={14} /> {new Date(selectedDisaster.createdAt).toLocaleTimeString()}
                      </div>
                   </div>
                </div>

                <div className="bg-[#0d1117]/80 border border-[#30363d]/50 rounded-3xl p-8 mb-12 shadow-inner">
                   <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Info size={16} className="text-red-500" /> Situational intelligence
                   </h5>
                   <p className="text-lg text-white font-medium leading-relaxed italic opacity-90">
                     "{selectedDisaster.disaster_details}"
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-[#1c2128] border border-[#30363d] rounded-[2rem]">
                      <h6 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Origin Hub</h6>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                           <Building2 size={24} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-white">{selectedDisaster.center_id?.center_name}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Reporting Entity</p>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 bg-[#1c2128] border border-[#30363d] rounded-[2rem]">
                      <h6 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Relief Operations</h6>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                           <Tent size={24} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-white">{selectedDisaster.reliefcamp_id?.camp_name || "Deploy to Camp"}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Assigned Sector</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-12 flex items-center justify-between pt-8 border-t border-[#30363d]">
                   <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Integrated CrisisAid Intelligence System v2.0</p>
                   <div className="flex gap-4">
                      <button className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-red-600/20">Initiate Dispatch</button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

