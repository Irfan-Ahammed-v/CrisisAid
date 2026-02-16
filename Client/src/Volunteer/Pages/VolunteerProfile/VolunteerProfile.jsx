import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useVolunteerTheme } from "../../../context/VolunteerThemeContext";

const VolunteerProfile = () => {
  const { user } = useAuth();
  const { theme } = useVolunteerTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const isDark = theme === "dark";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/volunteer/profile");
      setProfile(res.data);
      setFormData({
        name: res.data.name,
        phone: res.data.phone,
        address: res.data.address || "",
        skills: res.data.skills?.join(", ") || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s)
      };
      
      await axios.put("http://localhost:5000/volunteer/profile", updatedData);
      setIsEditing(false);
      fetchProfile();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Profile Card */}
          <div className={`w-full md:w-1/3 border rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition-colors duration-300 ${
            isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'
          }`}>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-1 mb-4 shadow-lg">
              <img 
                src={profile?.photo ? `http://localhost:5000/${profile.photo}` : "https://ui-avatars.com/api/?name=" + (profile?.name || "User") + "&background=random"} 
                alt="Profile" 
                className={`w-full h-full object-cover rounded-full ${isDark ? 'bg-[#0d1117]' : 'bg-slate-50'}`}
              />
            </div>
            <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile?.name}</h2>
            <p className={`font-medium text-sm px-3 py-1 rounded-full border ${
              isDark ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-emerald-700 bg-emerald-50 border-emerald-100'
            }`}>
              Verified Volunteer
            </p>
            
            <div className="mt-6 w-full space-y-4 text-left">
              <div className={`p-3 rounded-xl border transition-colors ${
                isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-slate-50 border-slate-100'
              }`}>
                <p className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Email</p>
                <p className={`truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{profile?.email}</p>
              </div>
              <div className={`p-3 rounded-xl border transition-colors ${
                isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-slate-50 border-slate-100'
              }`}>
                <p className={`text-xs uppercase font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Phone</p>
                <p className={isDark ? 'text-slate-200' : 'text-slate-700'}>{profile?.phone}</p>
              </div>
            </div>
          </div>

          {/* Details & Edit Form */}
          <div className={`w-full md:w-2/3 border rounded-2xl p-8 shadow-lg transition-colors duration-300 ${
            isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Personal Information</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isEditing 
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" 
                    : isDark ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                }`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-xs font-semibold uppercase mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      className={`w-full rounded-lg px-4 py-2.5 outline-none transition-all border ${
                        isDark 
                          ? 'bg-[#0d1117] border-[#30363d] text-slate-200 focus:border-emerald-500' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Phone Number</label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      className={`w-full rounded-lg px-4 py-2.5 outline-none transition-all border ${
                        isDark 
                          ? 'bg-[#0d1117] border-[#30363d] text-slate-200 focus:border-emerald-500' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-xs font-semibold uppercase mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Address</label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange}
                    rows="3"
                    className={`w-full rounded-lg px-4 py-2.5 outline-none transition-all border ${
                      isDark 
                        ? 'bg-[#0d1117] border-[#30363d] text-slate-200 focus:border-emerald-500' 
                        : 'bg-white border-slate-200 text-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Skills (comma separated)</label>
                  <input 
                    type="text" 
                    name="skills" 
                    value={formData.skills} 
                    onChange={handleChange}
                    placeholder="e.g. First Aid, Swimming, Driving"
                    className={`w-full rounded-lg px-4 py-2.5 outline-none transition-all border ${
                      isDark 
                        ? 'bg-[#0d1117] border-[#30363d] text-slate-200 focus:border-emerald-500' 
                        : 'bg-white border-slate-200 text-slate-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                    }`}
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className={`text-sm font-semibold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Address</h4>
                  <p className={isDark ? 'text-slate-200' : 'text-slate-700'}>{profile?.address || "Not provided"}</p>
                </div>
                
                <div>
                  <h4 className={`text-sm font-semibold uppercase mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile?.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span key={index} className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                          isDark ? 'bg-[#21262d] border-[#30363d] text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                        }`}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className={`${isDark ? 'text-slate-500' : 'text-slate-400'} italic`}>No skills listed</span>
                    )}
                  </div>
                </div>

                <div className={`mt-8 pt-6 border-t ${isDark ? 'border-[#30363d]' : 'border-slate-100'}`}>
                  <h4 className={`text-sm font-semibold uppercase mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Identity Proof</h4>
                  {profile?.proof ? (
                    <div className={`relative group overflow-hidden rounded-xl border max-w-xs ${isDark ? 'border-[#30363d]' : 'border-slate-200'}`}>
                      <img 
                        src={`http://localhost:5000/${profile.proof}`} 
                        alt="ID Proof" 
                        className="w-full h-40 object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-white text-xs font-bold uppercase tracking-widest text-[10px]">View Document</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-amber-500 text-sm font-medium">⚠️ Proof not uploaded</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
