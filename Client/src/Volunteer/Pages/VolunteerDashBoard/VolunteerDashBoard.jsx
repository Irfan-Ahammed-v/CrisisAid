import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useVolunteerTheme } from "../../../context/VolunteerThemeContext";
import { 
  Radio, 
  Camera, 
  IdCard, 
  Clock, 
  Ban, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Hand, 
  Phone, 
  Book, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  ClipboardList, 
  UserPlus, 
  PhoneCall, 
  GraduationCap,
  Megaphone,
  User,
  Heart
} from "lucide-react";

axios.defaults.withCredentials = true;

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useVolunteerTheme();

  const [loading, setLoading] = useState(true);
  const [volunteer, setVolunteer] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [availability, setAvailability] = useState(true);

  const [photo, setPhoto] = useState(null);
  const [proof, setProof] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [volunteer_phone, setPhone] = useState("");
  const [volunteer_address, setAddress] = useState("");
  
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
        setVolunteer(res.data.volunteer);
        setVerificationStatus(res.data.volunteer.verification_status);


        setAvailability(res.data.volunteer.availability);

        // Fetch stats
        const taskRes = await axios.get("http://localhost:5000/volunteer/tasks");
        const tasks = taskRes.data;
        setStats({
          assigned: tasks.length,
          completed: tasks.filter(t => t.task_status === 'completed').length,
          pending: tasks.filter(t => t.task_status === 'assigned' || t.task_status === 'accepted').length
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
  if (!photo || !proof || !volunteer_phone.trim() || !volunteer_address.trim()) {
    alert("All fields (photo, proof, phone, and address) are required");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(photo.type) || !allowedTypes.includes(proof.type)) {
    alert("Only JPG, JPEG, PNG images are allowed");
    return;
  }

  const formData = new FormData();
  formData.append("volunteer_photo", photo);
  formData.append("volunteer_proof", proof);
  formData.append("volunteer_phone", volunteer_phone);
  formData.append("volunteer_address", volunteer_address);

  try {
    await axios.put(
      "http://localhost:5000/volunteer/complete-profile",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("Profile completed successfully! Your account is now under review.");
    window.location.reload();
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
          <p className={isDark ? "text-slate-400" : "text-slate-500"}>Establishing secure link...</p>
        </div>
      </div>
    );
  }

  // 1. INITIAL SETUP STATE
  if (!volunteer.profileCompleted) {
    return (
      <div className={`min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 ${isDark ? 'bg-[#0d1117]' : 'bg-slate-50'}`}>
        <div className={`w-full max-w-2xl rounded-3xl p-10 border shadow-2xl relative overflow-hidden transition-all duration-500 ${
          isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'
        }`}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 animate-pulse"></div>
          
          <div className="text-center mb-10">
              <Radio size={48} className="text-emerald-500" />
            <h3 className={`text-3xl font-black mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Activate Your Profile
            </h3>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              To join the frontline and start accepting missions, we need to verify your identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Photo Upload */}
            <div className="space-y-3">
              <label className={`block text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Mission Identity (Photo)
              </label>
              <div 
                className={`relative h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden ${
                  photoPreview 
                    ? 'border-emerald-500/50' 
                    : isDark ? 'bg-slate-800/50 border-slate-700 hover:border-slate-500' : 'bg-slate-50 border-slate-300 hover:border-emerald-400'
                }`}
                onClick={() => document.getElementById('photo-input').click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Preview" />
                ) : (
                  <>
                    <Camera size={32} className="opacity-60 group-hover:scale-110 transition-transform" />
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Select Face Portrait</span>
                  </>
                )}
                <input id="photo-input" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </div>
            </div>

            {/* Proof Upload */}
            <div className="space-y-3">
              <label className={`block text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Operational ID (Proof)
              </label>
              <div 
                className={`relative h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden ${
                  proofPreview 
                    ? 'border-blue-500/50' 
                    : isDark ? 'bg-slate-800/50 border-slate-700 hover:border-slate-500' : 'bg-slate-50 border-slate-300 hover:border-blue-400'
                }`}
                onClick={() => document.getElementById('proof-input').click()}
              >
                {proofPreview ? (
                  <img src={proofPreview} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Preview" />
                ) : (
                  <>
                    <IdCard size={32} className="opacity-60 group-hover:scale-110 transition-transform" />
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Select ID Card / Doc</span>
                  </>
                )}
                <input id="proof-input" type="file" accept="image/*" className="hidden" onChange={handleProofChange} />
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            {/* Phone Input */}
            <div>
              <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Contact Number
              </label>
              <input
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={volunteer_phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-5 py-4 rounded-xl border outline-none font-medium transition-all ${
                  isDark 
                    ? 'bg-[#0d1117] border-[#30363d] text-white focus:border-emerald-500/50' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Address Input */}
            <div>
              <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Residential Address
              </label>
              <textarea
                placeholder="Enter your full residential address..."
                value={volunteer_address}
                onChange={(e) => setAddress(e.target.value)}
                rows="3"
                className={`w-full px-5 py-4 rounded-xl border outline-none font-medium transition-all resize-none ${
                  isDark 
                    ? 'bg-[#0d1117] border-[#30363d] text-white focus:border-emerald-500/50' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500'
                }`}
              />
            </div>
          </div>

          <button
            onClick={submitProfile}
            className={`w-full py-4 rounded-xl font-black text-lg shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 ${
              photo && proof
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-emerald-500/20 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
            disabled={!photo || !proof || !volunteer_phone.trim() || !volunteer_address.trim()}
          >
            <span>Initialize Security Check</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // 2. UNDER REVIEW STATE
  if (verificationStatus === "pending") {
    return (
      <div className={`min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 ${isDark ? 'bg-[#0d1117]' : 'bg-slate-50'}`}>
        <div className={`w-full max-w-xl rounded-3xl p-10 border shadow-2xl text-center relative overflow-hidden ${
          isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'
        }`}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse"></div>
          
          <div className="relative mb-8">
             <div className="w-24 h-24 bg-amber-500/10 rounded-full mx-auto flex items-center justify-center animate-pulse">
                <Clock size={48} className="text-amber-500" />
             </div>
             <div className="absolute bottom-0 right-1/2 translate-x-12 bg-amber-500 p-1.5 rounded-full border-4 border-[#161b22]">
                <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
             </div>
          </div>

          <h3 className={`text-3xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Mission Clearance Pending
          </h3>
          <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Your credentials have been submitted. Our command center is currently verifying your profile for field deployment.
          </p>

          <div className={`p-6 rounded-2xl border text-left space-y-4 mb-2 ${
            isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Operational Checklist</h4>
            <div className="space-y-3">
               {[
                 { label: "Credentials Received", done: true },
                 { label: "Identity Verification", done: false },
                 { label: "Regional Assignment", done: false }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                     {item.done ? '✓' : i + 1}
                   </div>
                   <span className={`text-sm font-medium ${item.done ? 'text-slate-200' : 'text-slate-500'}`}>{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-6">
            Expected clearance within 24-48 hours. You will be notified once active.
          </p>
        </div>
      </div>
    );
  }

  // 3. REJECTED STATE
  if (verificationStatus === "rejected") {
    return (
      <div className={`min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 ${isDark ? 'bg-[#0d1117]' : 'bg-slate-50'}`}>
        <div className={`w-full max-w-xl rounded-3xl p-10 border shadow-2xl text-center relative overflow-hidden ${
          isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'
        }`}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
          
            <Ban size={48} className="text-red-500" />

          <h3 className={`text-3xl font-black mb-4 tracking-tight text-red-500`}>
            Clearance Denied
          </h3>
          <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            We encountered issues validating your operational profile. This is usually due to blurry documents or mismatched information.
          </p>

          <div className={`p-6 rounded-2xl border text-left mb-8 ${
            isDark ? 'bg-red-900/10 border-red-500/20' : 'bg-red-50 border-red-100'
          }`}>
             <h4 className="text-red-500 font-bold mb-3 flex items-center gap-2">
                 <AlertTriangle size={18} className="text-red-500" /> Rectification Required
             </h4>
             <ul className="text-sm space-y-2 text-slate-400">
                <li>• Ensure the photo clearly shows your face</li>
                <li>• ID proof must be legible and unexpired</li>
                <li>• Information must match registration data</li>
             </ul>
          </div>

          <button 
            onClick={() => {
              setVerificationStatus(null); // Reset local state to show setup screen
              setVolunteer({...volunteer, profileCompleted: false});
            }}
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-lg transition-all shadow-lg hover:shadow-red-500/20"
          >
            Resubmit Operational Profile
          </button>
        </div>
      </div>
    );
  }

  // 4. APPROVED STATE (Original Dashboard)
  return (
    <div className="font-sans">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* WELCOME HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className={`text-4xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome back, Volunteer! <span className="animate-bounce inline-block">👋</span>
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
            icon={<ClipboardList size={22} />} 
            color="emerald" 
            sub="Tasks needing attention"
            isDark={isDark}
          />
          <StatCard 
            label="Completed Missions" 
            value={stats.completed} 
            icon={<CheckCircle2 size={22} />} 
            color="blue" 
            sub="Lives successfully impacted"
            isDark={isDark}
          />
          <StatCard 
            label="Total Hours" 
            value="--" 
            icon={<Clock size={22} />} 
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
                <Zap size={20} className="text-emerald-500" /> Quick Actions
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <QuickAction 
                  label="New Requests" 
                  icon={<Hand size={24} />} 
                  onClick={() => navigate('/volunteer/requests')} 
                  color="text-emerald-500"
                  isDark={isDark}
                />
                <QuickAction 
                  label="View Tasks" 
                  icon={<ClipboardList size={24} />} 
                  onClick={() => navigate('/volunteer/assignments')} 
                  color="text-emerald-400"
                  isDark={isDark}
                />
                <QuickAction 
                  label="Update Profile" 
                  icon={<User size={24} />} 
                  onClick={() => navigate('/volunteer/profile')} 
                  color="text-blue-400"
                  isDark={isDark}
                />
                <QuickAction 
                  label="Contact Center" 
                  icon={<PhoneCall size={24} />} 
                  onClick={() => alert("Feature coming soon")} 
                  color="text-amber-400"
                  isDark={isDark}
                />
                <QuickAction 
                  label="Resources" 
                  icon={<Book size={24} />} 
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
               <div className={`w-24 h-24 rounded-full mb-4 flex items-center justify-center ${
                 isDark ? 'bg-slate-800 text-emerald-400 shadow-lg shadow-black/20' : 'bg-slate-100 text-emerald-600 shadow-inner'
               }`}>
                 <Heart size={40} fill="currentColor" className="animate-pulse" />
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
