import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Users, 
  Search, 
  MapPin, 
  Building2, 
  Filter, 
  Phone, 
  ShieldCheck, 
  Mail,
  ChevronRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Clock,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [centers, setCenters] = useState([]);

  const [district, setDistrict] = useState("");
  const [center, setCenter] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vRes = await axios.get(`${BASE_URL}/admin/volunteers`);
        setVolunteers(vRes.data?.volunteers || []);
        
        const dRes = await axios.get(`${BASE_URL}/admin/districts`);
        setDistricts(dRes.data?.districts || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!district) {
      setCenters([]);
      return;
    }
    axios.get(`${BASE_URL}/admin/centers/${district}`).then(res => setCenters(res.data?.centers || []));
    setCenter("");
  }, [district]);

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const filteredVolunteers = volunteers.filter(v => {
    const vDistrictId = v.district_id?._id || v.district_id;
    const vCenterId = v.center_id?._id || v.center_id;
    
    const matchesDistrict = !district || vDistrictId === district;
    const matchesCenter = !center || vCenterId === center;
    const matchesSearch = !searchQuery || v.volunteer_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesCenter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
             <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
               <Users size={24} />
             </div>
             Volunteer Force
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Central directory of verified personnel and field responders.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 shadow-xl shadow-indigo-500/5">
           <ShieldCheck size={14} />
           {filteredVolunteers.length} Active Personnel
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-[2rem] p-3 flex flex-col lg:flex-row items-center gap-3 shadow-2xl">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500/50 rounded-[1.5rem] pl-14 pr-6 py-4 text-slate-200 outline-none transition-all placeholder:text-slate-700"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
           <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-2xl px-4 py-3.5 min-w-[200px] flex-1">
              <MapPin size={16} className="text-slate-500" />
              <select
                className="bg-transparent border-none text-xs font-bold text-slate-300 outline-none w-full cursor-pointer appearance-none"
                value={district}
                onChange={e => setDistrict(e.target.value)}
              >
                <option value="">All Districts</option>
                {districts.map(d => <option key={d._id} value={d._id}>{d.districtName}</option>)}
              </select>
           </div>

           <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-2xl px-4 py-3.5 min-w-[200px] flex-1">
              <Building2 size={16} className="text-slate-500" />
              <select
                className="bg-transparent border-none text-xs font-bold text-slate-300 outline-none w-full cursor-pointer appearance-none disabled:opacity-30"
                value={center}
                disabled={!district}
                onChange={e => setCenter(e.target.value)}
              >
                <option value="">All Centers</option>
                {centers.map(c => <option key={c._id} value={c._id}>{c.center_name}</option>)}
              </select>
           </div>

           <button 
             onClick={() => {setDistrict(""); setCenter(""); setSearchQuery("");}}
             className="p-4 bg-[#0d1117] border border-[#30363d] text-slate-500 hover:text-indigo-400 rounded-2xl transition-all hover:bg-indigo-500/5"
             title="Reset Filters"
           >
              <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredVolunteers.length > 0 ? (
            filteredVolunteers.map(v => (
              <motion.div
                key={v._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#161b22] border border-[#30363d] rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300"
              >
                {/* Status Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${getStatusColor(v.verification_status)}`}>
                    <CheckCircle2 size={10} />
                    {v.verification_status}
                  </div>
                </div>

                <div className="flex items-start gap-5 mb-6 relative z-10">
                   <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#21262d] to-[#1c2128] border-2 border-[#30363d] group-hover:border-indigo-500/40 transition-colors">
                        <img
                          src={`${BASE_URL}/uploads/volunteers/${v.volunteer_photo}`}
                          alt={v.volunteer_name}
                          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?background=21262d&color=6366f1&bold=true&length=1&name=${v.volunteer_name}`;
                          }}
                        />
                      </div>
                      {v.availability && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-[3.5px] border-[#161b22] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse" />
                      )}
                   </div>
                   <div className="pt-2">
                      <h4 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors tracking-tight line-clamp-1">{v.volunteer_name}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                        <Mail size={12} className="text-indigo-400" />
                        {v.volunteer_email}
                      </p>
                   </div>
                </div>

                <div className="space-y-3 relative z-10 mb-6">
                   <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#0d1117]/60 border border-[#30363d]/50 rounded-2xl p-3 group-hover:bg-[#0d1117]/80 transition-colors">
                         <div className="flex items-center gap-2 mb-1">
                            <MapPin size={10} className="text-indigo-400" />
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">District</p>
                         </div>
                         <p className="text-xs text-slate-200 font-bold truncate">{v.district_id?.districtName || 'Emergency Pool'}</p>
                      </div>
                      <div className="bg-[#0d1117]/60 border border-[#30363d]/50 rounded-2xl p-3 group-hover:bg-[#0d1117]/80 transition-colors">
                         <div className="flex items-center gap-2 mb-1">
                            <Building2 size={10} className="text-indigo-400" />
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Base</p>
                         </div>
                         <p className="text-xs text-slate-200 font-bold truncate">{v.center_id?.center_name || 'Global Ops'}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-3 bg-[#0d1117]/40 rounded-2xl px-4 py-3 border border-transparent group-hover:border-[#30363d]/30 transition-all">
                      <div className="w-8 h-8 rounded-xl bg-[#21262d] flex items-center justify-center text-indigo-400 shrink-0">
                         <Phone size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest line-clamp-1">Direct Link</p>
                         <p className="text-xs text-slate-200 font-bold tabular-nums">{v.volunteer_phone || "Not Registered"}</p>
                      </div>
                      <a 
                        href={`tel:${v.volunteer_phone}`}
                        className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95"
                      >
                        <ChevronRight size={14} />
                      </a>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-[#30363d]/50 group-hover:border-indigo-500/20 transition-colors">
                   <div className="flex items-center gap-2">
                      <Clock size={12} className="text-slate-600" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                        Since {new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                   </div>
                   <div 
                     onClick={() => setSelectedVolunteer(v)}
                     className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-wider group-hover:translate-x-1 transition-transform cursor-pointer"
                   >
                      Full Profile <ChevronRight size={12} />
                   </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center rounded-[3rem] border-2 border-dashed border-[#30363d] bg-[#161b22]/40"
            >
              <div className="w-20 h-20 rounded-full bg-[#1c2128] border border-[#30363d] flex items-center justify-center text-slate-600 mx-auto mb-6 shadow-2xl">
                <Users size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-200">No personnel discovered</h3>
              <p className="text-slate-500 mt-2 text-sm uppercase tracking-[0.2em] font-medium">Refine your search parameters to scan the network</p>
              <button 
                onClick={() => {setDistrict(""); setCenter(""); setSearchQuery("");}}
                className="mt-8 px-10 py-4 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-600/10"
              >
                 Reset Surveillance Parameters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedVolunteer && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedVolunteer(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#161b22] border border-[#30363d] w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-8 right-8 z-30">
                <button 
                  onClick={() => setSelectedVolunteer(null)}
                  className="p-3 bg-[#21262d] hover:bg-[#2d333b] text-slate-400 hover:text-white rounded-2xl transition-all border border-[#30363d]"
                >
                  <ChevronRight size={24} className="rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Sidebar: Photo & Actions */}
                <div className="lg:col-span-4 bg-[#0d1117] p-8 lg:p-10 border-r border-[#30363d]/50">
                  <div className="relative mb-8">
                    <div className="w-full aspect-square rounded-[2rem] overflow-hidden border-4 border-[#161b22] shadow-2xl">
                      <img
                        src={`${BASE_URL}/uploads/volunteers/${selectedVolunteer.volunteer_photo}`}
                        alt={selectedVolunteer.volunteer_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?background=21262d&color=6366f1&bold=true&length=1&name=${selectedVolunteer.volunteer_name}`;
                        }}
                      />
                    </div>
                    {selectedVolunteer.availability && (
                      <div className="absolute -bottom-2 -right-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Available Now
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className={`w-full py-4 rounded-2xl border flex flex-col items-center justify-center text-center px-4 ${getStatusColor(selectedVolunteer.verification_status)}`}>
                       <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Verification Status</p>
                       <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                         <ShieldCheck size={16} />
                         {selectedVolunteer.verification_status}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Right Content: Details */}
                <div className="lg:col-span-8 p-8 lg:p-12 space-y-10 max-h-[85vh] overflow-y-auto no-scrollbar">
                  <div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">{selectedVolunteer.volunteer_name}</h2>
                    <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic flex items-center gap-2">
                      <div className="w-8 h-[1px] bg-indigo-500/50" /> Personnel Identification System
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <section className="space-y-6">
                      <div>
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <MapPin size={14} className="text-indigo-400" /> Operational Area
                        </h5>
                        <div className="space-y-3">
                          <div className="bg-[#0d1117] p-4 rounded-2xl border border-[#30363d]/50">
                            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-1">Administrative District</p>
                            <p className="text-sm text-slate-200 font-bold">{selectedVolunteer.district_id?.districtName || 'System Emergency Pool'}</p>
                          </div>
                          <div className="bg-[#0d1117] p-4 rounded-2xl border border-[#30363d]/50">
                            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-1">Deployment Center</p>
                            <p className="text-sm text-slate-200 font-bold">{selectedVolunteer.center_id?.center_name || 'Global Operations Hub'}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <MapPin size={14} className="text-indigo-400" /> Resident Address
                        </h5>
                        <div className="bg-[#0d1117] p-4 rounded-2xl border border-[#30363d]/50">
                          <p className="text-sm text-slate-300 leading-relaxed italic">{selectedVolunteer.volunteer_address || 'No registered resident terminal address'}</p>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6">
                      <div className="pt-4 h-full">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <ShieldAlert size={14} className="text-indigo-400" /> Identity verification Proof
                        </h5>
                        <div 
                          className="group relative bg-[#0d1117] border border-[#30363d] rounded-[2.5rem] h-64 lg:h-[calc(100%-2rem)] overflow-hidden cursor-pointer shadow-2xl"
                          onClick={() => window.open(`${BASE_URL}/uploads/volunteers/${selectedVolunteer.volunteer_proof}`, '_blank')}
                        >
                          <img
                            src={`${BASE_URL}/uploads/volunteers/${selectedVolunteer.volunteer_proof}`}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            alt="Identity Proof"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center backdrop-blur-[2px]">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-3 scale-90 group-hover:scale-100 transition-transform duration-500">
                               <ShieldCheck size={28} />
                            </div>
                            <p className="text-xs font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">Inspect Credential</p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="pt-8 border-t border-[#30363d]/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-0.5">Registration Epoch</span>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                          <Calendar size={14} className="text-indigo-500" /> {new Date(selectedVolunteer.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-0.5">Internal Trace ID</span>
                       <p className="text-[10px] font-mono text-indigo-500/50 font-bold">#VOL-{selectedVolunteer._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
