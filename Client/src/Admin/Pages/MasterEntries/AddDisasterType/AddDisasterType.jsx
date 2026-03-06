import axios from "axios";
import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2,
  Activity,
  ShieldAlert,
  Search,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddDisasterType = () => {
  const [disasterName, setDisasterName] = useState("");
  const [disasterTypes, setDisasterTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editDisasterName, setEditDisasterName] = useState("");

  const BASE_URL = "http://localhost:5000";

  const fetchDisasterTypes = async () => {
    setIsDataLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/disaster-types`);
      setDisasterTypes(res.data?.disaster_types || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasterTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!disasterName.trim()) return;
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/admin/new-disaster`, { disaster_name: disasterName });
      setDisasterName("");
      fetchDisasterTypes();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editDisasterName.trim()) return;
    setIsLoading(true);
    try {
      await axios.put(`${BASE_URL}/admin/disaster-type/${editId}`, { disaster_name: editDisasterName });
      setIsEditOpen(false);
      fetchDisasterTypes();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`${BASE_URL}/admin/disaster-type/${id}`);
      fetchDisasterTypes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <ShieldAlert size={100} />
        </div>
        
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="p-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Response Protocol Configuration</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 relative z-10">
          <div className="relative flex-1">
             <ShieldAlert size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
             <input
              type="text"
              value={disasterName}
              onChange={(e) => setDisasterName(e.target.value)}
              placeholder="e.g. Seismic Event, Tropical Cyclone..."
              required
              className="w-full bg-[#161b22] border border-[#30363d] focus:border-red-500/30 rounded-2xl pl-12 pr-5 py-4 text-slate-200 outline-none transition-all placeholder:text-slate-800 font-bold text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-500 text-white rounded-2xl px-10 py-4 font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 flex items-center justify-center min-w-[200px]"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Authorize Protocol"}
          </button>
        </form>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {isDataLoading ? (
            <div className="col-span-full py-20 text-center">
              <Loader2 size={32} className="animate-spin mx-auto text-red-500 mb-4" />
              <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Scanning disaster directives...</p>
            </div>
          ) : disasterTypes.length > 0 ? (
            disasterTypes.map((type, i) => (
              <motion.div 
                key={type._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#161b22] border border-[#30363d] rounded-[2rem] p-6 hover:border-red-500/30 transition-all group shadow-xl relative overflow-hidden"
              >
                <div className="absolute -top-2 -right-2 text-4xl font-black text-white/[0.02] italic select-none">#{i + 1}</div>
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
                    <Activity size={16} />
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                          setEditId(type._id);
                          setEditDisasterName(type.disaster_type_name);
                          setIsEditOpen(true);
                        }}
                      className="w-9 h-9 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(type._id, type.disaster_type_name)}
                      className="w-9 h-9 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h4 className="text-slate-100 font-bold text-lg group-hover:text-red-400 transition-colors uppercase tracking-tight relative z-10">{type.disaster_type_name}</h4>
                
                <div className="mt-6 pt-6 border-t border-[#30363d]/50 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active State</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:translate-x-1 group-hover:text-red-500 transition-all" />
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center rounded-[3rem] border-2 border-dashed border-[#30363d] bg-[#161b22]/10"
            >
               <div className="w-16 h-16 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-slate-800 mx-auto mb-6">
                 <AlertTriangle size={28} />
               </div>
               <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">No high-priority protocols defined</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-6" onClick={() => setIsEditOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#161b22] border border-[#30363d] rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-100 mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display',serif" }}>Refine Directive</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-8">Synchronize Protocol Definition</p>
                <form onSubmit={handleUpdate}>
                  <div className="relative mb-8">
                     <Activity size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
                     <input
                      type="text"
                      value={editDisasterName}
                      onChange={(e) => setEditDisasterName(e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#30363d] focus:border-red-500/50 rounded-2xl pl-12 pr-4 py-4 text-slate-200 outline-none font-bold uppercase tracking-tight shadow-inner"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 py-4 bg-[#21262d] text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2d333b] transition-all">Abort</button>
                    <button type="submit" className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all">Submit Sync</button>
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

export default AddDisasterType;
