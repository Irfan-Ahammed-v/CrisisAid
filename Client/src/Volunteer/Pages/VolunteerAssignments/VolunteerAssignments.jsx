import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVolunteerTheme } from "../../../context/VolunteerThemeContext";

axios.defaults.withCredentials = true;

const VolunteerAssignments = () => {
  const { theme } = useVolunteerTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const isDark = theme === "dark";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/volunteer/tasks");
      setTasks(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.task_status === filter;
  });

  const getStatusColor = (status) => {
    if (isDark) {
      switch (status) {
        case "pending": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
        case "accepted": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
        case "completed": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
        default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
      }
    } else {
      switch (status) {
        case "pending": return "text-amber-700 bg-amber-50 border-amber-200";
        case "accepted": return "text-blue-700 bg-blue-50 border-blue-200";
        case "completed": return "text-emerald-700 bg-emerald-50 border-emerald-200";
        default: return "text-slate-600 bg-slate-50 border-slate-200";
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>Loading assignments...</p>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Assignments</h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>Manage all your assigned disaster relief tasks.</p>
          </div>
          
          <div className={`flex border rounded-lg p-1 transition-colors duration-300 ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200 shadow-sm'}`}>
            {["all", "pending", "accepted", "completed"].map((f) => (
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

        {filteredTasks.length === 0 ? (
          <div className={`border rounded-2xl p-16 text-center transition-colors duration-300 ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="text-6xl mb-4">📝</div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No assignments found</h3>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>You don't have any tasks matching this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task._id} className={`border rounded-2xl p-6 transition-all group shadow-md ${
                isDark 
                  ? 'bg-[#161b22] border-[#30363d] hover:border-emerald-500/30 shadow-[#000000]/20' 
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg shadow-slate-200/50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(task.task_status)}`}>
                    {task.task_status}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 line-clamp-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{task.disaster_id?.disaster_name || "Disaster Relief"}</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4 line-clamp-3`}>
                  {task.remarks || "No specific instructions provided. Please contact the center for details."}
                </p>
                
                <div className={`mt-4 pt-4 border-t flex justify-between items-center ${isDark ? 'border-[#30363d]' : 'border-slate-100'}`}>
                   <div className="flex items-center gap-2">
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>🏛️</div>
                     <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Assigned by Center</span>
                   </div>
                   
                   <button className={`text-sm font-medium transition-colors ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}>
                     View Details →
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

export default VolunteerAssignments;
