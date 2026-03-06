import axios from "axios";
import React, { useEffect, useState } from "react";
import { 
  MapPin, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight,
  Map as MapIcon,
  Globe,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddPlace = () => {
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [place, setPlace] = useState("");
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editPlace, setEditPlace] = useState("");

  const BASE_URL = "http://localhost:5000";

  const fetchDistricts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/districts`);
      setDistricts(res.data?.districts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlaces = async (id) => {
    if (!id) {
      setPlaces([]);
      return;
    }
    setIsDataLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/places/${id}`);
      setPlaces(res.data?.places || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    fetchPlaces(districtId);
  }, [districtId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!districtId) return;
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/admin/place/${districtId}`, { place_name: place });
      setPlace("");
      fetchPlaces(districtId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(`${BASE_URL}/admin/place/${editId}`, { place_name: editPlace });
      setIsEditOpen(false);
      fetchPlaces(districtId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this place?")) return;
    await axios.delete(`${BASE_URL}/admin/place/${id}`);
    fetchPlaces(districtId);
  };

  const selectedDistrict = districts.find(d => d._id === districtId)?.districtName || "";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Select */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe size={80} />
          </div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-4 px-2">Jurisdiction Scope</label>
          <div className="relative z-10">
            <div className="relative group/select">
              <MapIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/select:text-indigo-400 transition-colors" />
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] focus:border-indigo-500/30 rounded-2xl pl-12 pr-4 py-4 text-slate-200 outline-none appearance-none cursor-pointer transition-all font-bold text-sm"
              >
                <option value="">Choose Parent District</option>
                {districts.map((d) => (
                  <option key={d._id} value={d._id}>{d.districtName}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                <ChevronRight size={16} className="rotate-90" />
              </div>
            </div>
          </div>
          <AnimatePresence>
            {districtId && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 flex items-center gap-3 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest italic">Active Context: {selectedDistrict}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Form */}
        <div className={`transition-all duration-500 ${districtId ? 'opacity-100' : 'opacity-20 grayscale pointer-events-none'}`}>
          <div className="bg-[#0d1117] border border-[#30363d] rounded-[2rem] p-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-4 px-2">Register Localization</label>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  required
                  placeholder="e.g. Kozhikode North"
                  className="w-full bg-[#161b22] border border-[#30363d] focus:border-indigo-500/30 rounded-2xl pl-12 pr-5 py-4 text-slate-200 outline-none transition-all placeholder:text-slate-800 font-bold text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl px-8 py-4 font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center min-w-[120px]"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Deploy"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* List Table */}
      <AnimatePresence mode="wait">
        {districtId ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d1117]/50 border border-[#30363d] rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#161b22] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#30363d]">
                    <th className="py-5 px-8 w-20">ID</th>
                    <th className="py-5 px-6">Geographic Label</th>
                    <th className="py-5 px-8 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]/30">
                  {isDataLoading ? (
                    <tr>
                      <td colSpan="3" className="py-20 text-center">
                        <Loader2 size={24} className="animate-spin mx-auto text-indigo-500 mb-4" />
                        <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Syncing regional data...</p>
                      </td>
                    </tr>
                  ) : places.length > 0 ? (
                    places.map((p, i) => (
                      <tr key={p._id} className="text-slate-300 hover:bg-[#1c2128] transition-colors group">
                        <td className="py-5 px-8 font-mono text-slate-500 text-xs">{String(i + 1).padStart(2, '0')}</td>
                        <td className="py-5 px-6">
                           <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                <MapPin size={12} />
                              </div>
                              <span className="font-bold text-slate-200">{p.place_name}</span>
                           </div>
                        </td>
                        <td className="py-5 px-8">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditId(p._id);
                                setEditPlace(p.place_name);
                                setIsEditOpen(true);
                              }}
                              className="w-9 h-9 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="w-9 h-9 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-20 text-center">
                        <p className="text-slate-600 text-xs font-black uppercase tracking-[0.2em]">No localized spots registered</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center rounded-[3rem] border-2 border-dashed border-[#30363d] bg-[#161b22]/10"
          >
            <div className="w-16 h-16 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-slate-800 mx-auto mb-6">
              <Search size={28} />
            </div>
            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Select jurisdiction to view localized assets</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-6" onClick={() => setIsEditOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#161b22] border border-[#30363d] rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-100 mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display',serif" }}>Update Locale</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-8">Modify Geographic Identity</p>
                <form onSubmit={handleUpdate}>
                  <div className="relative mb-8">
                     <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
                     <input
                      type="text"
                      value={editPlace}
                      onChange={(e) => setEditPlace(e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500/50 rounded-2xl pl-12 pr-4 py-4 text-slate-200 outline-none font-bold shadow-inner"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 py-4 bg-[#21262d] text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2d333b] transition-all">Dismiss</button>
                    <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all">Sync</button>
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

export default AddPlace;