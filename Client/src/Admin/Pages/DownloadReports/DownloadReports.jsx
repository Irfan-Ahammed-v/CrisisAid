import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Download, 
  ChevronDown, 
  Settings2,
  Database,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

const DownloadReports = () => {
  const [downloading, setDownloading] = useState(false);
  const [category, setCategory] = useState("");
  const [subFilter, setSubFilter] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [districts, setDistricts] = useState([]);
  
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/districts`);
        setDistricts(res.data.districts || []);
      } catch (err) {
        console.error("Fetch districts failed", err);
      }
    };
    fetchDistricts();
  }, []);

  const categories = [
    { id: 'centers', name: 'Relief Centers' },
    { id: 'volunteers', name: 'Volunteer Force' },
    { id: 'camps', name: 'Emergency Camps' },
    { id: 'disasters', name: 'Crisis Archives' },
  ];

  const getSubfilters = () => {
    switch (category) {
      case 'volunteers':
        return [
          { value: 'approved', label: 'Verified Only' },
          { value: 'pending', label: 'Pending Review' },
          { value: 'rejected', label: 'Access Denied' },
        ];
      case 'disasters':
        return [
          { value: 'active', label: 'Active Alerts' },
          { value: 'resolved', label: 'Resolved Cases' },
          { value: 'rejected', label: 'False Alarms' },
        ];
      default:
        return [];
    }
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map(item => 
      headers.map(header => {
        let val = item[header];
        if (typeof val === 'object' && val !== null) {
          val = val.center_name || val.districtName || val.camp_name || val.disaster_type_name || val.name || JSON.stringify(val);
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

  const handleDownload = async () => {
    if (!category) return;
    setDownloading(true);
    try {
      let endpoint = "";
      let dataKey = "";
      
      switch (category) {
        case 'centers':
          endpoint = `/admin/all-centers?districtId=${districtId}`;
          dataKey = "centers";
          break;
        case 'volunteers':
          endpoint = `/admin/volunteers?status=${subFilter}&districtId=${districtId}`;
          dataKey = "volunteers";
          break;
        case 'camps':
          endpoint = `/admin/all-camps?districtId=${districtId}`;
          dataKey = "camps";
          break;
        case 'disasters':
          endpoint = `/admin/disasters?status=${subFilter}&districtId=${districtId}`;
          dataKey = "disasters";
          break;
        default:
          return;
      }

      const response = await axios.get(`${BASE_URL}${endpoint}`);
      const data = response.data[dataKey] || [];
      
      if (data.length === 0) {
        alert("No records found for current selection.");
        return;
      }

      const csvContent = convertToCSV(data);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${category}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failure:", error);
      alert("Failed to generate report.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            Data <span className="text-indigo-500">Exporter</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Configure Extractor Settings</p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#161b22] border border-[#30363d] rounded-[2.5rem] p-10 shadow-2xl space-y-8"
        >
          {/* Category Dropdown */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Database size={12} className="text-indigo-500" /> Report Category
            </label>
            <div className="relative group">
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 pointer-events-none" size={18} />
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setSubFilter(""); }}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-2xl py-4 h-16 px-6 text-sm font-bold text-white appearance-none focus:outline-none focus:border-indigo-500 transition-all uppercase tracking-widest cursor-pointer"
              >
                <option value="" disabled>Select category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* District Dropdown */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} className="text-slate-500" /> District Filter
              </label>
              <div className="relative group">
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-2xl py-4 px-6 text-[10px] font-black text-slate-300 appearance-none focus:outline-none focus:border-slate-500 transition-all uppercase tracking-widest cursor-pointer"
                >
                  <option value="">Global (All)</option>
                  {districts.map(d => (
                    <option key={d._id} value={d._id}>{d.districtName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Dropdown (Conditional) */}
            <div className={`space-y-3 transition-opacity duration-300 ${!category || getSubfilters().length === 0 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Settings2 size={12} className="text-slate-500" /> Status Spec
              </label>
              <div className="relative group">
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <select
                  value={subFilter}
                  onChange={(e) => setSubFilter(e.target.value)}
                  disabled={!category || getSubfilters().length === 0}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-2xl py-4 px-6 text-[10px] font-black text-slate-300 appearance-none focus:outline-none focus:border-slate-500 transition-all uppercase tracking-widest cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="">Full Spectrum</option>
                  {getSubfilters().map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleDownload}
              disabled={!category || downloading}
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#30363d] disabled:cursor-not-allowed rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-xl shadow-indigo-600/10"
            >
              {downloading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Download size={18} />
                  Download Report
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DownloadReports;
