import axios from "axios";
import React, { useEffect, useState } from "react";
import { 
  Package, 
  Layers, 
  Scale, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2,
  Tag,
  Box
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddType = () => {
  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editItemName, setEditItemName] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const BASE_URL = "http://localhost:5000";

  const fetchItems = async () => {
    setIsDataLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin/items`);
      setItems(res.data?.items || []);
      setUnits(res.data?.meta?.units || []);
      setCategories(res.data?.meta?.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/admin/item`, { item_name: itemName, unit, category });
      setItemName("");
      setUnit("");
      setCategory("");
      fetchItems();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(`${BASE_URL}/admin/item/${editId}`, {
        item_name: editItemName,
        unit: editUnit,
        category: editCategory,
      });
      setIsEditOpen(false);
      fetchItems();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await axios.delete(`${BASE_URL}/admin/item/${id}`);
    fetchItems();
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Package size={100} />
        </div>
        
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Plus size={20} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Inventory Registration</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Asset Nomenclature</label>
            <div className="relative">
              <Box size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Medical Kit"
                required
                className="w-full bg-[#161b22] border border-[#30363d] focus:border-emerald-500/30 rounded-2xl pl-12 pr-4 py-4 text-slate-200 outline-none transition-all placeholder:text-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Quantification</label>
            <div className="relative">
              <Scale size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                className="w-full bg-[#161b22] border border-[#30363d] focus:border-emerald-500/30 rounded-2xl pl-12 pr-4 py-4 text-slate-200 outline-none cursor-pointer appearance-none font-bold text-sm"
              >
                <option value="">Select Unit</option>
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Logistics Class</label>
            <div className="relative">
              <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-[#161b22] border border-[#30363d] focus:border-emerald-500/30 rounded-2xl pl-12 pr-4 py-4 text-slate-200 outline-none cursor-pointer appearance-none font-bold text-sm"
              >
                <option value="">Select Class</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-[56px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Commit Stock"}
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-[#0d1117]/50 border border-[#30363d] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-emerald-500/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#161b22] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#30363d]">
                <th className="py-5 px-8 w-20">REF</th>
                <th className="py-5 px-6">Resource Allocation</th>
                <th className="py-5 px-6 text-center">Unit</th>
                <th className="py-5 px-6 text-center">Priority Group</th>
                <th className="py-5 px-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]/30">
              {isDataLoading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 size={24} className="animate-spin mx-auto text-emerald-500 mb-4" />
                    <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Compiling database...</p>
                  </td>
                </tr>
              ) : items.map((item, i) => (
                <tr key={item._id} className="text-slate-300 hover:bg-[#1c2128] transition-all group">
                  <td className="py-5 px-8 font-mono text-slate-500 text-xs">{String(i + 1).padStart(2, '0')}</td>
                  <td className="py-5 px-6">
                     <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                          <Package size={14} />
                        </div>
                        <span className="font-bold text-slate-200">{item.item_name}</span>
                     </div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className="px-3 py-1 bg-[#21262d] border border-[#30363d] text-slate-400 rounded-full text-[9px] font-black uppercase tracking-tighter">{item.unit}</span>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 rounded-full text-[9px] font-black uppercase tracking-widest">
                       <Tag size={10} />
                       {item.category}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditId(item._id);
                          setEditItemName(item.item_name);
                          setEditUnit(item.unit);
                          setEditCategory(item.category);
                          setIsEditOpen(true);
                        }}
                        className="w-9 h-9 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all shadow-sm"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="w-9 h-9 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && !isDataLoading && (
            <div className="py-20 text-center">
               <Layers size={32} className="text-slate-800 mx-auto mb-4" />
               <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Operational inventory is empty</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-6" onClick={() => setIsEditOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#161b22] border border-[#30363d] rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-100 mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display',serif" }}>Update Asset</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-8">Synchronize Resource Specifications</p>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">Asset Identity</label>
                    <div className="relative">
                      <Box size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
                      <input
                        type="text"
                        value={editItemName}
                        onChange={(e) => setEditItemName(e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500/50 rounded-2xl pl-12 pr-4 py-4 text-slate-200 outline-none font-bold shadow-inner"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">Unit</label>
                      <select
                        value={editUnit}
                        onChange={(e) => setEditUnit(e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500/50 rounded-2xl px-4 py-4 text-slate-200 outline-none font-bold appearance-none cursor-pointer"
                      >
                        {units.map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-[#0d1117] border border-[#30363d] focus:border-indigo-500/50 rounded-2xl px-4 py-4 text-slate-200 outline-none font-bold appearance-none cursor-pointer"
                      >
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 py-4 bg-[#21262d] text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Abort</button>
                    <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Finalize</button>
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

export default AddType;
