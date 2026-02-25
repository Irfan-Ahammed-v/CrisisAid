import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVolunteerTheme } from "../../../context/VolunteerThemeContext";

axios.defaults.withCredentials = true;

const VolunteerAssignments = () => {
  const { theme } = useVolunteerTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Modal & Update State
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  const handleAddRemark = async () => {
    if (!remark.trim()) return alert("Please enter a remark");
    setUpdating(true);
    try {
      await axios.patch(`http://localhost:5000/volunteer/tasks/${selectedTask._id}/remark`, { remark });
      alert("Remark added successfully");
      fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add remark");
    } finally {
      setUpdating(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!proofFile) return alert("Please upload proof of completion");
    setUpdating(true);
    const formData = new FormData();
    formData.append("proof", proofFile);

    try {
      await axios.patch(`http://localhost:5000/volunteer/tasks/${selectedTask._id}/complete`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Task marked as completed!");
      fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete task");
    } finally {
      setUpdating(false);
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

  const getPriorityColor = (priority) => {
    const p = priority?.toLowerCase();
    if (isDark) {
      switch (p) {
        case "high": return "text-rose-400 bg-rose-400/10 border-rose-400/20";
        case "medium": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
        case "low": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
        default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
      }
    } else {
      switch (p) {
        case "high": return "text-rose-700 bg-rose-50 border-rose-200";
        case "medium": return "text-amber-700 bg-amber-50 border-amber-200";
        case "low": return "text-emerald-700 bg-emerald-50 border-emerald-200";
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
            {["all", "accepted", "completed"].map((f) => (
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
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border w-fit ${getStatusColor(task.task_status)}`}>
                      {task.task_status}
                    </span>
                    {task.request_id?.request_priority && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border w-fit ${getPriorityColor(task.request_id.request_priority)}`}>
                        {task.request_id.request_priority} Priority
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className={`text-lg font-bold mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {task.request_id?.camp_id?.camp_name || task.disaster_id?.disaster_name || "Relief Mission"}
                </h3>
                <div className={`text-xs mb-3 flex flex-col gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {(task.request_id?.camp_id?.camp_address || task.request_id?.camp_id?.place) && (
                    <div className="flex items-center gap-1 opacity-80 italic">
                      <span>📍 {task.request_id?.camp_id?.camp_address}</span>
                      {task.request_id?.camp_id?.place && <span>{task.request_id?.camp_id?.camp_address ? `, ${task.request_id?.camp_id?.place}` : task.request_id?.camp_id.place}</span>}
                    </div>
                  )}
                </div>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} text-sm font-medium mb-2 line-clamp-1`}>
                  {task.request_id?.request_details ? (task.request_id.request_details.split(' ').slice(0, 8).join(' ') + '...') : "Action Required"}
                </p>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-xs mb-4 line-clamp-2`}>
                  {task.remarks || task.request_id?.request_details || "No specific instructions provided. Please contact the center for details."}
                </p>
                
                <div className={`mt-4 pt-4 border-t flex justify-between items-center ${isDark ? 'border-[#30363d]' : 'border-slate-100'}`}>
                   <div className="flex items-center gap-2">
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>🏛️</div>
                     <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                       {task.center_id?.center_name || "Assigned by Center"}
                     </span>
                   </div>
                   
                   <button 
                     onClick={() => {
                        setSelectedTask(task);
                        setRemark(task.remarks || "");
                        setIsModalOpen(true);
                     }}
                     className={`text-sm font-medium transition-colors ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}>
                     View Details →
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DETAIL MODAL */}
        {isModalOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 border ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}`}>
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b flex justify-between items-center ${isDark ? 'border-[#30363d] bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Mission Details</h2>
                <button onClick={() => setIsModalOpen(false)} className={`text-2xl ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>&times;</button>
              </div>

              {/* Modal Content */}
              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Camp / Location</label>
                    <p className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {selectedTask.request_id?.camp_id?.camp_name || "Assigned Area"}
                    </p>
                    {(selectedTask.request_id?.camp_id?.camp_address || selectedTask.request_id?.camp_id?.place) && (
                      <p className={`text-sm mt-1 opacity-80 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {selectedTask.request_id?.camp_id?.camp_address}
                        {selectedTask.request_id?.camp_id?.place && (selectedTask.request_id?.camp_id?.camp_address ? `, ${selectedTask.request_id?.camp_id.place}` : selectedTask.request_id?.camp_id.place)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Assigning Center</label>
                    <p className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {selectedTask.center_id?.center_name || "Central Command"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Disaster Type</label>
                    <p className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {selectedTask.disaster_id?.disaster_name || "Relief Mission"}
                    </p>
                  </div>
                  <div>
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Priority Level</label>
                    <div className="mt-1">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getPriorityColor(selectedTask.request_id?.request_priority)}`}>
                         {selectedTask.request_id?.request_priority || "Standard"}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Mission Description</label>
                  <p className={`mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {selectedTask.request_id?.request_details || "No further details provided."}
                  </p>
                </div>

                {selectedTask.task_status !== 'completed' && (
                  <div className="space-y-6 pt-6 border-t border-dashed border-slate-700">
                    {/* Add Remark */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Mission Remarks</label>
                      <textarea 
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="Add updates or notes about the mission..."
                        className={`w-full p-4 rounded-xl border text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${
                          isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                        rows="3"
                      ></textarea>
                      <button 
                        onClick={handleAddRemark}
                        disabled={updating}
                        className={`mt-2 text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                          isDark ? 'bg-slate-700 text-emerald-400 hover:bg-slate-600' : 'bg-slate-100 text-emerald-700 hover:bg-slate-200'
                        }`}
                      >
                        Update Remarks
                      </button>
                    </div>

                    {/* Completion Proof */}
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-100'}`}>
                      <label className={`block text-sm font-bold mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>Complete Mission</label>
                      <div className="flex flex-col gap-4">
                        <input 
                          type="file" 
                          onChange={(e) => setProofFile(e.target.files[0])}
                          className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-xs file:font-semibold
                            file:bg-emerald-500/10 file:text-emerald-400
                            hover:file:bg-emerald-500/20`}
                        />
                        <button 
                          onClick={handleCompleteTask}
                          disabled={updating || !proofFile}
                          className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg ${
                            isDark 
                              ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/10' 
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 text-sm'
                          } disabled:opacity-50`}
                        >
                          {updating ? "Processing..." : "Submit Completion Proof"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTask.task_status === 'completed' && (
                  <div className="space-y-6">
                    <div className={`mt-6 p-4 rounded-xl border ${isDark ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">✅</span>
                        <span className="text-sm font-bold tracking-tight">Mission successfully completed</span>
                      </div>
                      {selectedTask.remarks && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          <span className="font-bold">Completion Remarks:</span> {selectedTask.remarks}
                        </p>
                      )}
                    </div>

                    {selectedTask.proof_image && (
                      <div>
                        <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Completion Proof</label>
                        <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                           <img 
                             src={`http://localhost:5000/uploads/${selectedTask.proof_image}`} 
                             alt="Completion Proof" 
                             className="w-full h-auto object-cover max-h-64"
                             onError={(e) => {
                               e.target.onerror = null;
                               e.target.src = "https://via.placeholder.com/400x200?text=Proof+Image+Not+Found";
                             }}
                           />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerAssignments;
