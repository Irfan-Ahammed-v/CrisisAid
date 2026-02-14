import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const PendingApprovals = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    const samplePendingVolunteers = [
      {
        _id: "v1",
        volunteer_name: "Rajesh Kumar",
        volunteer_email: "rajesh.kumar@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-12T10:30:00"),
        district_id: { name: "Ernakulam" },
        center_id: null
      },
      {
        _id: "v2",
        volunteer_name: "Priya Menon",
        volunteer_email: "priya.menon@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-12T09:15:00"),
        district_id: { name: "Thrissur" },
        center_id: null
      },
      {
        _id: "v3",
        volunteer_name: "Arun Nair",
        volunteer_email: "arun.nair@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-11T16:45:00"),
        district_id: { name: "Kottayam" },
        center_id: null
      },
      {
        _id: "v4",
        volunteer_name: "Lakshmi Pillai",
        volunteer_email: "lakshmi.p@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-11T14:20:00"),
        district_id: { name: "Alappuzha" },
        center_id: null
      },
      {
        _id: "v5",
        volunteer_name: "Deepak Menon",
        volunteer_email: "deepak.menon@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-10T18:30:00"),
        district_id: { name: "Kollam" },
        center_id: null
      },
      {
        _id: "v6",
        volunteer_name: "Kavya Nair",
        volunteer_email: "kavya.nair@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-10T15:45:00"),
        district_id: { name: "Ernakulam" },
        center_id: null
      }
    ];

    setPendingVolunteers(samplePendingVolunteers);
    setLoading(false);
  };

  const filteredVolunteers = pendingVolunteers.filter(volunteer => {
    const matchesSearch = volunteer.volunteer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.volunteer_email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const openDetailModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setDetailModalOpen(true);
  };

  const handleApprove = (volunteerId) => {
    setPendingVolunteers(prev => prev.filter(v => v._id !== volunteerId));
    showNotification("success", "Volunteer approved successfully");
    setDetailModalOpen(false);
  };

  const handleReject = (volunteerId) => {
    setPendingVolunteers(prev => prev.filter(v => v._id !== volunteerId));
    showNotification("success", "Volunteer registration rejected");
    setDetailModalOpen(false);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-amber-400 mb-4"></div>
          <p className="text-slate-400 text-lg font-medium">Loading pending volunteers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #0d1117; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
        @keyframes toastIn { from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        .fu { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .rh:hover { background: rgba(255,255,255,0.022); }
      `}</style>

      <div className="min-h-screen bg-[#0d1117] text-slate-300">
        {/* Subtle grid texture */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(232,162,62,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,162,62,0.025) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />

        {/* Header */}
        <div className="relative z-10 bg-[#161b22] border-b border-[#30363d] shadow-2xl sticky top-0">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="fu" style={{ animationDelay: "0ms" }}>
                <button
                  onClick={() => navigate(-1)}
                  className="text-amber-400 hover:text-amber-300 font-medium mb-3 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Volunteer Management
                </button>
                <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3" style={{ fontFamily: "'Playfair Display',serif" }}>
                  <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Pending Volunteer Approvals
                </h1>
                <p className="text-slate-500 mt-1">Review and verify volunteer registrations</p>
              </div>
              
              {/* Stats */}
              <div className="text-center bg-amber-400/10 rounded-xl p-4 border border-amber-400/20">
                <div className="text-3xl font-bold text-amber-400">{filteredVolunteers.length}</div>
                <div className="text-sm text-amber-400 font-semibold">Pending Approval{filteredVolunteers.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {/* Search Bar */}
          <div className="fu bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d] p-6 mb-6" style={{ animationDelay: "50ms" }}>
            <div className="max-w-2xl">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Search Pending Volunteers</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-[#30363d] text-slate-200 placeholder-slate-600 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 outline-none transition-all"
                />
                <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Volunteers Grid */}
          {filteredVolunteers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVolunteers.map((volunteer, idx) => (
                <div
                  key={volunteer._id}
                  className="fu bg-[#161b22] rounded-2xl shadow-2xl border border-amber-400/20 hover:border-amber-400/40 transition-all overflow-hidden"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-amber-400/10 to-amber-400/5 p-5 border-b border-[#30363d]">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full border-2 border-amber-400 overflow-hidden flex-shrink-0 bg-[#21262d]">
                        <img src={volunteer.volunteer_photo} alt={volunteer.volunteer_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-100 truncate">{volunteer.volunteer_name}</h3>
                        <p className="text-sm text-slate-500 font-mono truncate">{volunteer.volunteer_email}</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-amber-400/10 text-amber-400 ring-amber-400/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Pending Review
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-slate-300 font-medium">{volunteer.district_id?.name || "Not specified"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-slate-500 font-mono text-xs">
                        {new Date(volunteer.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-slate-500 font-mono text-xs">
                        {new Date(volunteer.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 bg-[#0d1117]/50 border-t border-[#21262d]">
                    <button
                      onClick={() => openDetailModal(volunteer)}
                      className="w-full px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Review & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="fu bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d] p-12 text-center" style={{ animationDelay: "100ms" }}>
              <div className="text-6xl mb-4 opacity-30">✅</div>
              <h3 className="text-xl font-bold text-slate-100 mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>No Pending Approvals</h3>
              <p className="text-slate-500">All volunteer registrations have been processed</p>
            </div>
          )}
        </div>

        {/* Professional Detail Modal */}
        {detailModalOpen && selectedVolunteer && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl max-w-5xl w-full my-8" style={{ animation: "scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-amber-400/10 to-amber-400/5 p-6 rounded-t-2xl border-b border-[#30363d]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full border-4 border-amber-400 overflow-hidden bg-[#21262d] flex-shrink-0">
                      <img src={selectedVolunteer.volunteer_photo} alt={selectedVolunteer.volunteer_name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2 text-slate-100" style={{ fontFamily: "'Playfair Display',serif" }}>{selectedVolunteer.volunteer_name}</h2>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-slate-400 flex items-center gap-1 text-sm font-mono">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {selectedVolunteer.volunteer_email}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Pending Approval
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setDetailModalOpen(false)} className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all flex-shrink-0 text-sm">
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Personal Info */}
                  <div className="lg:col-span-1 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2">
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Full Name</p>
                          <p className="text-sm text-slate-200 font-semibold">{selectedVolunteer.volunteer_name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Email Address</p>
                          <p className="text-sm text-slate-300 font-mono">{selectedVolunteer.volunteer_email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">District</p>
                          <p className="text-sm text-slate-200">{selectedVolunteer.district_id?.name || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Registration Date</p>
                          <p className="text-sm text-slate-300 font-mono">
                            {new Date(selectedVolunteer.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                        <div className="pt-4">
                          <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4">
                            <p className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Action Required
                            </p>
                            <p className="text-sm text-amber-400/80">
                              Please verify the volunteer's identity documents carefully before approval.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Documents */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2 border-b border-[#30363d] pb-2">
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Verification Documents
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Photo */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-slate-300">Profile Photo</h4>
                            <button 
                              onClick={() => window.open(selectedVolunteer.volunteer_photo, '_blank')}
                              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Open Full Size
                            </button>
                          </div>
                          <div className="border-2 border-[#30363d] rounded-xl overflow-hidden bg-[#0d1117]">
                            <img 
                              src={selectedVolunteer.volunteer_photo} 
                              alt="Profile" 
                              className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                              onClick={() => window.open(selectedVolunteer.volunteer_photo, '_blank')}
                            />
                          </div>
                          <p className="text-xs text-slate-600 text-center mt-2">Click image to view full size</p>
                        </div>

                        {/* ID Proof */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-slate-300">ID Proof Document</h4>
                            <button 
                              onClick={() => window.open(selectedVolunteer.volunteer_proof, '_blank')}
                              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Open Full Size
                            </button>
                          </div>
                          <div className="border-2 border-amber-400/30 rounded-xl overflow-hidden bg-amber-400/5">
                            <img 
                              src={selectedVolunteer.volunteer_proof} 
                              alt="ID Proof" 
                              className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                              onClick={() => window.open(selectedVolunteer.volunteer_proof, '_blank')}
                            />
                          </div>
                          <p className="text-xs text-slate-600 text-center mt-2">Verify identity document carefully</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-[#0d1117]/50 border-t border-[#30363d] rounded-b-2xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleApprove(selectedVolunteer._id)} 
                    className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve Volunteer
                  </button>
                  <button 
                    onClick={() => handleReject(selectedVolunteer._id)} 
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-500/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reject Application
                  </button>
                  <button 
                    onClick={() => setDetailModalOpen(false)} 
                    className="px-6 py-3 bg-[#21262d] hover:bg-[#2d333b] text-slate-300 border border-[#30363d] rounded-xl font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification.show && (
          <div className="fixed top-6 right-6 z-50" style={{ animation: "toastIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
            <div className={`backdrop-blur-sm rounded-xl shadow-2xl border-l-4 p-4 min-w-[350px] ${
              notification.type === "success" 
                ? "bg-emerald-950/90 border-emerald-700/40 text-emerald-300" 
                : "bg-red-950/90 border-red-700/40 text-red-300"
            }`}>
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.type === "success" ? "bg-emerald-400/20" : "bg-red-400/20"
                }`}>
                  <svg className={`w-6 h-6 ${notification.type === "success" ? "text-emerald-400" : "text-red-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={notification.type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold mb-1">{notification.type === "success" ? "Success!" : "Error"}</h3>
                  <p className="text-sm opacity-90">{notification.message}</p>
                </div>
                <button 
                  onClick={() => setNotification({ show: false, type: "", message: "" })}
                  className="text-current hover:opacity-70 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PendingApprovals;