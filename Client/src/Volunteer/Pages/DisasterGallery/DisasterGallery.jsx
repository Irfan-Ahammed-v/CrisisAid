import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVolunteerTheme } from "../../../context/VolunteerThemeContext";

axios.defaults.withCredentials = true;

const DisasterGallery = () => {
  const { theme } = useVolunteerTheme();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  const isDark = theme === "dark";

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/volunteer/disasters");
      setDisasters(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch disasters", error);
      setLoading(false); 
    }
  };

  const filteredDisasters = disasters.filter(d => {
    if (filter === "all") return true;
    return d.disaster_status === filter;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>Loading disasters...</p>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Disaster Watch</h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>Real-time updates on active relief operations.</p>
          </div>
          
          <div className={`flex border rounded-lg p-1 transition-colors duration-300 ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200 shadow-sm'}`}>
             {["active", "resolved", "all"].map((f) => (
               <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    filter === f
                      ? isDark ? "bg-[#21262d] text-white shadow-sm" : "bg-slate-100 text-emerald-700 shadow-sm"
                      : isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
             ))}
          </div>
        </div>

        {filteredDisasters.length === 0 ? (
          <div className={`border rounded-2xl p-16 text-center transition-colors duration-300 ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="text-6xl mb-4">🌪️</div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No disasters found</h3>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>There are no {filter} disasters reported at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDisasters.map((disaster) => (
              <div key={disaster._id} className={`border rounded-2xl overflow-hidden transition-all group shadow-lg ${
                isDark ? 'bg-[#161b22] border-[#30363d] hover:border-slate-500' : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}>
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={`http://localhost:5000/${disaster.disaster_photo}`} 
                    alt={disaster.disaster_details}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${
                      disaster.disaster_status === 'active' 
                        ? "bg-red-500/20 border-red-500/30 text-red-200" 
                        : "bg-emerald-500/20 border-emerald-500/30 text-emerald-200"
                    }`}>
                      {disaster.disaster_status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 line-clamp-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{disaster.disaster_details}</h3>
                  
                  <div className="space-y-2 mb-6">
                     <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>📍</span>
                        <span>{disaster.place_id?.place_name || "Unknown Location"}, {disaster.district_id?.district_name}</span>
                     </div>
                     <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>🗓️</span>
                        <span>Reported: {new Date(disaster.createdAt).toLocaleDateString()}</span>
                     </div>
                  </div>
                  
                  <button className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors border ${
                    isDark 
                      ? 'bg-[#21262d] hover:bg-[#30363d] text-white border-[#30363d]' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    View Situation Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterGallery;
