import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { 
  Clock, 
  Search, 
  Circle, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Mail, 
  X, 
  User, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  XCircle,
  AlertCircle
} from "lucide-react";

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

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchPendingVolunteers();
  }, []);

  const fetchPendingVolunteers = () => {
    axios.get(`${BASE_URL}/center/pending-volunteers`)
      .then(res => {
        setPendingVolunteers(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching pending volunteers:", error);
        setLoading(false);
      });
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    // If it's an absolute path from the DB sample, extract the filename
    const filename = path.split(/[\\/]/).pop();
    return `${BASE_URL}/uploads/volunteers/${filename}`;
  };

  const handleApprove = (volunteerId) => {
    axios.put(`${BASE_URL}/center/verify-volunteer/${volunteerId}`, { status: "approved" })
      .then(() => {
        setPendingVolunteers(prev => prev.filter(v => v._id !== volunteerId));
        showNotification("success", "Volunteer approved successfully");
        setDetailModalOpen(false);
      })
      .catch(err => {
        console.error("Error approving volunteer:", err);
        showNotification("error", "Failed to approve volunteer");
      });
  };

  const handleReject = (volunteerId) => {
    axios.put(`${BASE_URL}/center/verify-volunteer/${volunteerId}`, { status: "rejected" })
      .then(() => {
        setPendingVolunteers(prev => prev.filter(v => v._id !== volunteerId));
        showNotification("success", "Volunteer registration rejected");
        setDetailModalOpen(false);
      })
      .catch(err => {
        console.error("Error rejecting volunteer:", err);
        showNotification("error", "Failed to reject volunteer");
      });
  };

  const filteredVolunteers = pendingVolunteers.filter(volunteer => {
    const name = volunteer.volunteer_name || "";
    const email = volunteer.volunteer_email || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const openDetailModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setDetailModalOpen(true);
  };

  const notificationTimeoutRef = React.useRef(null);

  const showNotification = (type, message) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ show: true, type, message });
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
          
          {/* ── Page Title ── */}
          <div className="fu mb-8" style={{ animationDelay: "0ms" }}>
            <h1 className="text-[2rem] font-bold text-slate-100 leading-none" style={{ fontFamily: "'Playfair Display',serif" }}>
              Pending Volunteer Approvals
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">Review and verify volunteer registrations</p>
          </div>

          {/* Stats Bar */}
          <div className="fu bg-[#161b22] border border-[#30363d] rounded-xl p-4 mb-8 flex items-center justify-between" style={{ animationDelay: "50ms" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400/10 rounded-lg flex items-center justify-center text-xl text-amber-400">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-200">Pending Actions</div>
                <div className="text-xs text-slate-500">Items requiring your attention</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400 leading-none">{filteredVolunteers.length}</div>
              <div className="text-xs text-slate-500 font-mono">requests</div>
            </div>
          </div>
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
                <Search className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
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
                        <img src={getImageUrl(volunteer.volunteer_photo)} alt={volunteer.volunteer_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-100 truncate">{volunteer.volunteer_name}</h3>
                        <p className="text-sm text-slate-500 font-mono truncate">{volunteer.volunteer_email}</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-amber-400/10 text-amber-400 ring-amber-400/20">
                            <Circle className="w-1.5 h-1.5 fill-current text-amber-400" />
                            Pending Review
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-slate-500 flex-shrink-0" />
                      <span className="text-slate-300 font-medium">{volunteer.district_id?.districtName || "Not specified"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-slate-500 flex-shrink-0" />
                      <span className="text-slate-500 font-mono text-xs">
                        {new Date(volunteer.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-slate-500 flex-shrink-0" />
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
                      <ShieldCheck size={20} />
                      Review & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="fu bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d] p-12 text-center" style={{ animationDelay: "100ms" }}>
              <div className="text-6xl mb-4 opacity-30 text-amber-400 flex justify-center">
                <CheckCircle2 size={48} />
              </div>
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
                      <img src={getImageUrl(selectedVolunteer.volunteer_photo)} alt={selectedVolunteer.volunteer_name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2 text-slate-100" style={{ fontFamily: "'Playfair Display',serif" }}>{selectedVolunteer.volunteer_name}</h2>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-slate-400 flex items-center gap-1 text-sm font-mono">
                          <Mail size={16} />
                          {selectedVolunteer.volunteer_email}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
                        <Circle className="w-1.5 h-1.5 fill-current text-amber-400" />
                        Pending Approval
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setDetailModalOpen(false)} className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all flex-shrink-0 text-sm">
                    <X size={16} />
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
                        <User className="w-5 h-5 text-amber-400" />
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
                          <p className="text-sm text-slate-200">{selectedVolunteer.district_id?.districtName || "Not specified"}</p>
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
                              <AlertTriangle size={16} className="text-amber-400" />
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
                        <FileText className="w-5 h-5 text-amber-400" />
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
                              <ExternalLink size={16} />
                              Open Full Size
                            </button>
                          </div>
                          <div className="border-2 border-[#30363d] rounded-xl overflow-hidden bg-[#0d1117]">
                            <img 
                              src={getImageUrl(selectedVolunteer.volunteer_photo)} 
                              alt="Profile" 
                              className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                              onClick={() => window.open(getImageUrl(selectedVolunteer.volunteer_photo), '_blank')}
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
                              <ExternalLink size={16} />
                              Open Full Size
                            </button>
                          </div>
                          <div className="border-2 border-amber-400/30 rounded-xl overflow-hidden bg-amber-400/5">
                            <img 
                              src={getImageUrl(selectedVolunteer.volunteer_proof)} 
                              alt="ID Proof" 
                              className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                              onClick={() => window.open(getImageUrl(selectedVolunteer.volunteer_proof), '_blank')}
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
                    <CheckCircle2 size={20} />
                    Approve Volunteer
                  </button>
                  <button 
                    onClick={() => handleReject(selectedVolunteer._id)} 
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-500/20"
                  >
                    <XCircle size={20} />
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
                  {notification.type === "success" ? <CheckCircle2 size={24} className="text-emerald-400" /> : <AlertCircle size={24} className="text-red-400" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold mb-1">{notification.type === "success" ? "Success!" : "Error"}</h3>
                  <p className="text-sm opacity-90">{notification.message}</p>
                </div>
                <button 
                  onClick={() => setNotification({ show: false, type: "", message: "" })}
                  className="text-current hover:opacity-70 transition-opacity"
                >
                  <X size={20} />
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