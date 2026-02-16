import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useVolunteerTheme } from "../../../context/VolunteerThemeContext";

axios.defaults.withCredentials = true;

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useVolunteerTheme();

  const [loading, setLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [availability, setAvailability] = useState(true);
  
  const [photo, setPhoto] = useState(null);
  const [proof, setProof] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    assigned: 0,
    completed: 0,
    pending: 0
  });

  const isDark = theme === "dark";

  /* ---------- AUTH + PROFILE CHECK ---------- */
  useEffect(() => {
    const checkVolunteer = async () => {
      try {
        const res = await axios.get("http://localhost:5000/volunteer/home");

        if (res.data.profileCompleted === false) {
          setShowSetupModal(true);
        }

        setAvailability(res.data.volunteer.availability);

        // Fetch stats
        const taskRes = await axios.get("http://localhost:5000/volunteer/tasks");
        const tasks = taskRes.data;
        setStats({
          assigned: tasks.length,
          completed: tasks.filter(t => t.task_status === 'completed').length,
          pending: tasks.filter(t => t.task_status === 'pending' || t.task_status === 'accepted').length
        });

        setLoading(false);
      } catch {
        navigate("/guest/login");
      }
    };

    checkVolunteer();
  }, [navigate]);

  /* ---------- PROFILE COMPLETION HANDLERS ---------- */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProof(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const submitProfile = async () => {
    if (!photo || !proof) {
      alert("Photo and proof are required");
      return;
    }

    const formData = new FormData();
    formData.append("volunteer_photo", photo);
    formData.append("volunteer_proof", proof);

    try {
      await axios.put(
        "http://localhost:5000/volunteer/complete-profile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Profile completed successfully");
      setShowSetupModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  const toggleAvailability = async () => {
    try {
      const res = await axios.patch("http://localhost:5000/volunteer/toggle-availability");
      setAvailability(res.data.availability);
    } catch {
      alert("Failed to update availability");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={isDark ? "text-slate-400" : "text-slate-500"}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* WELCOME HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className={`text-4xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome back, Volunteer! 👋
            </h1>
            <p className={isDark ? "text-slate-400 text-lg" : "text-slate-600 text-lg"}>
              Ready to make a difference today?
            </p>
          </div>
          
          <div className={`flex items-center gap-4 p-2 rounded-xl border transition-colors duration-300 ${
            isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`w-3 h-3 rounded-full ${availability ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-slate-400'}`}></div>
            <div className="text-sm">
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{availability ? "You are Available" : "You are Unavailable"}</p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{availability ? "Receiving new tasks" : "Paused new assignments"}</p>
            </div>
            <button
              onClick={toggleAvailability}
              className={`ml-4 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                availability
                  ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                  : isDark 
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600" 
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              {availability ? "Turn Off" : "Go Online"}
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            label="Active Assignments" 
            value={stats.pending} 
            icon="📋" 
            color="emerald" 
            sub="Tasks needing attention"
            isDark={isDark}
          />
          <StatCard 
            label="Completed Missions" 
            value={stats.completed} 
            icon="✅" 
            color="blue" 
            sub="Lives successfully impacted"
            isDark={isDark}
          />
          <StatCard 
            label="Total Hours" 
            value="--" 
            icon="⏱️" 
            color="amber" 
            sub="Contribution tracking coming soon"
            isDark={isDark}
          />
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: QUICK ACTIONS & ALERTS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <div className={`border rounded-2xl p-6 transition-colors duration-300 ${
              isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                🚀 Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <QuickAction 
                  label="View Tasks" 
                  icon="📋" 
                  onClick={() => navigate('/volunteer/assignments')} 
                  color="text-emerald-400"
                  isDark={isDark}
                />
                <QuickAction 
                  label="Update Profile" 
                  icon="👤" 
                  onClick={() => navigate('/volunteer/profile')} 
                  color="text-blue-400"
                  isDark={isDark}
                />
                <QuickAction 
                  label="Contact Center" 
                  icon="📞" 
                  onClick={() => alert("Feature coming soon")} 
                  color="text-amber-400"
                  isDark={isDark}
                />
                <QuickAction 
                  label="Resources" 
                  icon="📚" 
                  onClick={() => alert("Feature coming soon")} 
                  color="text-purple-400"
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Recent Notifications / Alerts Placeholder */}
            <div className={`border rounded-2xl p-6 transition-colors duration-300 ${
              isDark 
                ? 'bg-gradient-to-r from-emerald-900/20 to-[#161b22] border-emerald-500/20' 
                : 'bg-emerald-50 border-emerald-100'
            }`}>
               <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>📢 Latest Updates</h3>
               <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                 Remember to keep your availability status updated. Centers rely on accurate data for rapid deployment.
               </p>
               <button onClick={() => navigate('/volunteer/profile')} className={`text-sm font-semibold underline ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}>
                 Check Profile Settings →
               </button>
            </div>
          </div>

          {/* RIGHT: PROFILE SNAPSHOT */}
          <div className="space-y-6">
             <div className={`border rounded-2xl p-6 flex flex-col items-center text-center transition-colors duration-300 ${
               isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200 shadow-sm'
             }`}>
               <div className={`w-24 h-24 rounded-full mb-4 flex items-center justify-center text-4xl ${
                 isDark ? 'bg-slate-800' : 'bg-slate-100'
               }`}>
                 🧑‍⚕️
               </div>
               <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Your Impact</h3>
               <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm mt-1 mb-6`}>
                 "Volunteers do not necessarily have the time; they just have the heart."
               </p>
               <button 
                onClick={() => navigate('/volunteer/assignments')}
                className={`w-full py-3 rounded-xl font-semibold transition-all border ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
               >
                 Go to Assignments
               </button>
             </div>
          </div>

        </div>
      </main>

      {/* SETUP MODAL */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className={`w-full max-w-lg rounded-2xl p-8 border shadow-2xl relative overflow-hidden transition-colors duration-300 ${
            isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'
          }`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Complete Your Profile
            </h3>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mb-8`}>
              To start accepting tasks, we need your photo and ID proof for verification.
            </p>

            <div className="space-y-6">
              {/* Photo Upload */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${
                    isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-50 border-slate-300'
                  }`}>
                    {photoPreview ? (
                      <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <span className="text-2xl">📷</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className={`flex-1 block w-full text-sm cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-emerald-500/10 file:text-emerald-400
                      hover:file:bg-emerald-500/20`}
                  />
                </div>
              </div>

              {/* Proof Upload */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>ID Proof Document</label>
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${
                    isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-50 border-slate-300'
                  }`}>
                     {proofPreview ? (
                      <img src={proofPreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <span className="text-2xl">📄</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofChange}
                    className={`flex-1 block w-full text-sm cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-500/10 file:text-blue-400
                      hover:file:bg-blue-500/20`}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={submitProfile}
              className="mt-8 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.02]"
            >
              Save & Verify Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* Components */
const StatCard = ({ label, value, icon, color, sub, isDark }) => {
  const themes = {
    emerald: {
      dark: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      light: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    blue: {
      dark: "text-blue-400 bg-blue-400/10 border-blue-400/20",
      light: "text-blue-600 bg-blue-50 border-blue-100"
    },
    amber: {
      dark: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      light: "text-amber-600 bg-amber-50 border-amber-100"
    }
  };

  const style = isDark ? themes[color].dark : themes[color].light;

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 hover:shadow-md ${
      isDark ? 'bg-[#161b22] border-[#30363d] hover:border-slate-600' : 'bg-white border-slate-200 hover:border-emerald-200 shadow-sm'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${style} text-2xl`}>
          {icon}
        </div>
        <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</span>
      </div>
      <h3 className={`font-semibold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{label}</h3>
      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</p>
    </div>
  );
};

const QuickAction = ({ label, icon, onClick, color, isDark }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all group ${
      isDark 
        ? 'bg-[#0d1117] border-[#30363d] hover:border-slate-500 hover:bg-[#21262d]' 
        : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-white hover:shadow-sm shadow-inner'
    }`}
  >
    <div className={`text-3xl mb-3 group-hover:scale-110 transition-transform ${color}`}>{icon}</div>
    <span className={`text-sm font-medium transition-colors ${
      isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-emerald-600'
    }`}>{label}</span>
  </button>
);


export default VolunteerDashboard;
