import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVolunteerTheme } from "../../../context/VolunteerThemeContext";

axios.defaults.withCredentials = true;

const VolunteerRequests = () => {
  const { theme } = useVolunteerTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const isDark = theme === "dark";

  const getPriorityStyles = (priority) => {
    const config = {
      critical: {
        dark: "text-red-400 bg-red-400/10 border-red-400/20",
        light: "text-red-700 bg-red-50 border-red-200"
      },
      high: {
        dark: "text-orange-400 bg-orange-400/10 border-orange-400/20",
        light: "text-orange-700 bg-orange-50 border-orange-200"
      },
      medium: {
        dark: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        light: "text-amber-700 bg-amber-50 border-amber-200"
      },
      low: {
        dark: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        light: "text-blue-700 bg-blue-50 border-blue-200"
      }
    };
    
    const style = config[priority?.toLowerCase()] || config.medium;
    return isDark ? style.dark : style.light;
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/volunteer/active-requests");
      setRequests(res.data);
      console.log(requests);
      
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch requests", error);
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setProcessing(requestId);
    try {
      await axios.post(`http://localhost:5000/volunteer/accept-request/${requestId}`);
      alert("Task accepted successfully!");
      // Filter out the accepted request
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error("Failed to accept task", error);
      alert(error.response?.data?.message || "Failed to accept task");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={isDark ? "text-slate-400" : "text-slate-500"}>Searching for active requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>New Requests</h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
            Help is needed in these camps. Join a mission today.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className={`border rounded-2xl p-16 text-center transition-colors duration-300 ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="text-6xl mb-4">🏠</div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>All caught up!</h3>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>There are no active requests in your area at the moment. Keep an eye out!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div key={request._id} className={`border rounded-2xl p-6 transition-all group shadow-md flex flex-col ${
                isDark 
                  ? 'bg-[#161b22] border-[#30363d] hover:border-emerald-500/30 shadow-[#000000]/20' 
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg shadow-slate-200/50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getPriorityStyles(request.request_priority)}`}>
                    {request.request_priority || 'Urgent'}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Available slots: {request.estimated_volunteers - (request.accepted_volunteers || 0)}
                  </span>
                </div>
                
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {request.camp_id?.camp_name || "Disaster Relief Camp"}
                </h3>
                
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-6 flex-grow`}>
                  {request.request_details || request.request_description || "A call for volunteers has been issued for this location. Your assistance can save lives and provide much-needed support to the community."}
                </p>

                <div className={`pt-4 border-t ${isDark ? 'border-[#30363d]' : 'border-slate-100'} space-y-4`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Progress</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-semibold'}>
                      {request.accepted_volunteers || 0} / {request.estimated_volunteers} volunteers
                    </span>
                  </div>
                  
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${((request.accepted_volunteers || 0) / request.estimated_volunteers) * 100}%` }}
                    ></div>
                  </div>

                  <button 
                    disabled={processing === request._id}
                    onClick={() => handleAccept(request._id)}
                    className={`w-full py-3 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50 ${
                      isDark 
                        ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/10' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                    }`}
                  >
                    {processing === request._id ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : "Accept Mission"}
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

export default VolunteerRequests;
