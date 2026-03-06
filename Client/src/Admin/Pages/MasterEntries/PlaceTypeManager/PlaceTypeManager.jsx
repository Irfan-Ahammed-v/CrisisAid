import React, { useState } from "react";
import AddPlace from "../AddPlace/AddPlace";
import AddType from "../AddType/AddType";
import AddDisasterType from "../AddDisasterType/AddDisasterType";
import { 
  Settings, 
  MapPin, 
  Layers, 
  AlertTriangle,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PlaceTypeManager = () => {
  const [activeTab, setActiveTab] = useState("place");

  const tabs = [
    { id: "place", name: "Regional Places", icon: MapPin, color: "indigo" },
    { id: "type", name: "Request Categories", icon: Layers, color: "emerald" },
    { id: "disaster", name: "Disaster Protocols", icon: AlertTriangle, color: "red" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
             <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
               <Settings size={24} />
             </div>
             System Configuration
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Define global entities, location hierarchies, and emergency protocols.</p>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex flex-wrap gap-3 p-2 bg-[#161b22] border border-[#30363d] rounded-[2rem] w-fit shadow-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-[1.5rem] text-sm font-bold transition-all flex items-center gap-3 group ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-500 hover:text-slate-300 hover:bg-[#21262d]"
            }`}
          >
            <tab.icon size={18} className={activeTab === tab.id ? "text-white" : `text-slate-600 group-hover:text-indigo-400 transition-colors`} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-[2.5rem] p-4 lg:p-10 shadow-2xl relative overflow-hidden min-h-[600px]">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 h-full"
          >
            {activeTab === "place" && <AddPlace />}
            {activeTab === "type" && <AddType />}
            {activeTab === "disaster" && <AddDisasterType />}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Help Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {tabs.map(tab => (
          <div key={tab.id} className="bg-[#161b22]/50 border border-[#30363d] rounded-[2rem] p-6 group hover:border-indigo-500/30 transition-all">
             <div className="flex items-center justify-between mb-4">
               <div className={`p-2 rounded-xl bg-${tab.color}-500/10 text-${tab.color}-400 ring-1 ring-${tab.color}-500/20`}>
                 <tab.icon size={16} />
               </div>
               <Info size={14} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
             </div>
             <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-2">{tab.name}</h4>
             <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
               {tab.id === 'place' && "Register specific landing zones and village-level locations for field coordination."}
               {tab.id === 'type' && "Define resource categories and assistance levels for incoming requests."}
               {tab.id === 'disaster' && "Standardize emergency classifications to trigger automated response protocols."}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceTypeManager;
