import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Building2, 
  MapPin, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  MoreVertical,
  Layers,
  Activity,
  Map as MapIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Centers = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [centerMap, setCenterMap] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [district, setDistrict] = useState("");
  const [editId, setEditId] = useState(null);

  const BASE_URL = "http://localhost:5000";

  const fetchDistricts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/districts`);
      setData(res.data?.districts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCenters = async (districtId) => {
    if (!districtId) return;
    setLoadingId(districtId);
    try {
      const res = await axios.get(`${BASE_URL}/admin/centers/${districtId}`);
      setCenterMap((prev) => ({
        ...prev,
        [districtId]: res.data?.centers || [],
      }));
    } finally {
      setLoadingId(null);
    }
  };

  const toggleExpand = (districtId) => {
    if (expandedId === districtId) {
      setExpandedId(null);
    } else {
      setExpandedId(districtId);
      fetchCenters(districtId);
    }
  };

  const filteredData = data.filter((d) =>
    d.districtName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { districtName: district };
    try {
      if (editId) {
        await axios.put(`${BASE_URL}/admin/district/${editId}`, payload);
      } else {
        await axios.post(`${BASE_URL}/admin/addDistrict`, payload);
      }
      setIsOpen(false);
      resetForm();
      fetchDistricts();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setDistrict("");
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this district?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin/district/${id}`);
      fetchDistricts();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
             <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
               <Building2 size={24} />
             </div>
             District and Center Infrastructure
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Cross-district relief network management.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <Plus size={18} /> New District
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search districts by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#161b22] border border-[#30363d] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl pl-12 pr-6 py-4 text-slate-200 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border border-[#30363d] rounded-2xl text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
           <Activity size={14} className="text-emerald-500" />
           {filteredData.length} active Districts
        </div>
      </div>

      {/* District List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredData.map((d, i) => (
          <div
            key={d._id}
            className={`bg-[#161b22] border rounded-2xl overflow-hidden transition-all duration-300 ${
              expandedId === d._id ? 'border-indigo-500/30 ring-1 ring-indigo-500/10' : 'border-[#30363d] hover:border-[#484f58]'
            }`}
          >
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors ${
                  expandedId === d._id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#21262d] text-slate-500 border border-[#30363d]'
                }`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {d.districtName}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                     <span className="text-indigo-400/80 text-xs font-bold uppercase tracking-widest">
                       {d.CentersCount || 0} Registered Centers
                     </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleExpand(d._id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    expandedId === d._id
                      ? "bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20"
                      : "bg-[#21262d] text-slate-400 border border-[#30363d] hover:text-slate-200"
                  }`}
                >
                  {expandedId === d._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {expandedId === d._id ? "Hide Centers" : "View Centers"}
                </button>
                <div className="h-8 w-[1px] bg-[#30363d] mx-1" />
                <button
                  onClick={() => {
                    setEditId(d._id);
                    setDistrict(d.districtName);
                    setIsOpen(true);
                  }}
                  className="w-10 h-10 rounded-xl bg-[#21262d] border border-[#30363d] flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
                  title="Configure Jurisdiction"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(d._id)}
                  className="w-10 h-10 rounded-xl bg-[#21262d] border border-[#30363d] flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title="Remove Jurisdiction"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === d._id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-[#30363d]/50 bg-[#0d1117]/50"
                >
                  <div className="p-6 overflow-hidden">
                    {loadingId === d._id ? (
                      <div className="py-12 text-center flex flex-col items-center">
                        <div className="w-8 h-8 border-[3px] border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">Fetching facility metrics...</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-[#30363d]/50 bg-[#161b22]/30">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-[#1c2128]/50 text-slate-500 text-[10px] uppercase tracking-widest font-black border-b border-[#30363d]/50">
                              <th className="py-4 px-6">Assisted Facility</th>
                              <th className="py-4 px-4 text-center">Relief Camps</th>
                              <th className="py-4 px-4 text-center">Operation Status</th>
                              <th className="py-4 px-6 text-right">Address</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#30363d]/30">
                            {(centerMap[d._id] || []).map((c) => (
                              <tr key={c._id} className="text-slate-300 text-sm hover:bg-[#21262d]/40 transition-colors group">
                                <td className="py-5 px-6">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Building2 size={14} />
                                      </div>
                                      <span className="font-bold text-slate-100">{c.center_name}</span>
                                   </div>
                                </td>
                                <td className="py-5 px-4 text-center">
                                  <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                    {c.campCount || 0} Camps
                                  </span>
                                </td>
                                <td className="py-5 px-4 text-center">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    c.center_status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]' :
                                    'bg-red-500/10 text-red-400 border border-red-500/20'
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${c.center_status === 'OPEN' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                    {c.center_status}
                                  </span>
                                </td>
                                <td className="py-5 px-6 text-right">
                                  <div className="flex flex-col items-end">
                                    <span className="text-slate-400 text-xs font-medium">{c.center_address || 'Unspecified Zone'}</span>
                                    <button className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter mt-1 hover:text-indigo-300 transition-colors">Route Map</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {(!centerMap[d._id] || centerMap[d._id].length === 0) && (
                           <div className="py-12 text-center flex flex-col items-center">
                              <Layers size={32} className="text-slate-700 mb-3" />
                              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No active Centers registered for this District</p>
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#161b22] border border-[#30363d] rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                  <MapIcon size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-100 tracking-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
                  {editId ? "Update District" : "New District Entry"}
                </h2>
                <p className="text-slate-500 text-sm mt-2 mb-8 uppercase tracking-widest"> District Control</p>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <div className="relative group">
                       <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                       <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500/50 rounded-2xl pl-12 pr-4 py-4 text-slate-200 outline-none transition-all placeholder:text-slate-800"
                        placeholder="e.g. Kozhikode Central"
                        autoFocus
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-4 bg-[#21262d] text-slate-400 rounded-2xl font-bold hover:bg-[#2d333b] transition-all">Dismiss</button>
                    <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                      {editId ? "Confirm Entry" : "Commit Entry"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Centers;