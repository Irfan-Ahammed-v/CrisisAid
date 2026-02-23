import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const Requests = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyAction, setReplyAction] = useState("");
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/center/getrequests");
        
        setRequests(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load requests:", err);
        showNotification("error", "Failed to load requests");
        setLoading(false);
      }
    };

    const fetchVolunteers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/center/volunteers");
        setVolunteers(res.data);
      } catch (err) {
        console.error("Failed to load volunteers:", err);
      }
    };

    fetchRequests();
    fetchVolunteers();
  }, []);

  const loadSampleData = () => {
    // Only keeping volunteers for now as I haven't checked the volunteer route
    const sampleVolunteers = [
      { _id: "vol1", volunteer_name: "Anitha Thomas",  volunteer_email: "anitha.t@email.com",  availability: "available", assigned_task: null },
      { _id: "vol2", volunteer_name: "Suresh Babu",    volunteer_email: "suresh.b@email.com",   availability: "available", assigned_task: null },
      { _id: "vol3", volunteer_name: "Maya Krishnan",  volunteer_email: "maya.k@email.com",     availability: "busy",      assigned_task: "Food Distribution - Green Meadows" },
      { _id: "vol4", volunteer_name: "Deepak Menon",   volunteer_email: "deepak.m@email.com",   availability: "available", assigned_task: null },
      { _id: "vol5", volunteer_name: "Kavya Nair",     volunteer_email: "kavya.n@email.com",    availability: "available", assigned_task: null },
      { _id: "vol6", volunteer_name: "Ravi Kumar",     volunteer_email: "ravi.k@email.com",     availability: "busy",      assigned_task: "Emergency Response - Riverside" },
      { _id: "vol7", volunteer_name: "Priya Menon",    volunteer_email: "priya.menon@email.com",availability: "available", assigned_task: null },
      { _id: "vol8", volunteer_name: "Arun Nair",      volunteer_email: "arun.nair@email.com",  availability: "available", assigned_task: null }
    ];

    setVolunteers(sampleVolunteers);
  };

  const filteredRequests = requests.filter(request => {
    const matchesPriority = filterPriority === "all" || request.request_priority === filterPriority;
    const matchesStatus = filterStatus === "all" || request.request_status === filterStatus;
    const matchesSearch = request.camp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.request_details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesStatus && matchesSearch;
  });

  const openReplyModal = (request, action) => {
    setSelectedRequest(request);
    setReplyAction(action);
    setReplyMessage("");
    setReplyModalOpen(true);
  };

  const handleSubmitReply = async () => {
    if (!replyMessage.trim()) {
      showNotification("error", "Please enter a reply message");
      return;
    }
    
    try {
      const status = replyAction === "accept" ? "accepted" : "rejected";
      await axios.put(`http://localhost:5000/center/updateRequest/${selectedRequest._id}`, {
        status,
        reply: replyMessage
      });
      
      showNotification("success", `Request ${status === "accepted" ? "accepted" : "rejected"} successfully`);
      
      // Update local state
      setRequests(prev => prev.map(req =>
        req._id === selectedRequest._id
          ? { ...req, request_status: status, request_reply: replyMessage }
          : req
      ));
      
      setReplyModalOpen(false);
      setSelectedRequest(null);
      setReplyMessage("");
      setReplyAction("");
    } catch (err) {
      console.error("Failed to update request:", err);
      showNotification("error", "Failed to update request status");
    }
  };

  const openAssignModal = (request) => {
    setSelectedRequest(request);
    setSelectedVolunteers([]);
    setAssignModalOpen(true);
  };

  const handleAssignVolunteers = async () => {
    if (selectedVolunteers.length === 0) {
      showNotification("error", "Please select at least one volunteer");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/center/assignVolunteers/${selectedRequest._id}`, {
        volunteerIds: selectedVolunteers
      });

      showNotification("success", `Assigned ${selectedVolunteers.length} volunteer(s) to this request`);
      
      // Update requests local state
      setRequests(prev => prev.map(req =>
        req._id === selectedRequest._id
          ? { ...req, request_status: "assigned", assigned_volunteers: selectedVolunteers }
          : req
      ));
      
      // Update volunteers availability in local state
      setVolunteers(prev => prev.map(vol =>
        selectedVolunteers.includes(vol._id)
          ? { ...vol, availability: false }
          : vol
      ));
      
      setAssignModalOpen(false);
      setSelectedRequest(null);
      setSelectedVolunteers([]);
    } catch (err) {
      console.error("Failed to assign volunteers:", err);
      showNotification("error", "Failed to assign volunteers");
    }
  };

  const toggleVolunteerSelection = (volunteerId) => {
    setSelectedVolunteers(prev =>
      prev.includes(volunteerId) ? prev.filter(id => id !== volunteerId) : [...prev, volunteerId]
    );
  };

  const notificationTimeoutRef = useRef(null);

  const showNotification = (type, message) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ show: true, type, message });
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);
  // ── Badge configs ──
  const PRI_BADGE = {
    critical: { label: "Critical", dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/10",     ring: "ring-red-400/20",     bar: "bg-red-500" },
    high:     { label: "High",     dot: "bg-orange-400",  text: "text-orange-400",  bg: "bg-orange-400/10",  ring: "ring-orange-400/20",  bar: "bg-orange-500" },
    medium:   { label: "Medium",   dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10",   ring: "ring-amber-400/20",   bar: "bg-amber-400" },
    low:      { label: "Low",      dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20", bar: "bg-emerald-500" },
  };
  const STAT_BADGE = {
    pending:  { label: "Pending",  dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10",   ring: "ring-amber-400/20" },
    accepted: { label: "Accepted", dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20" },
    rejected: { label: "Rejected", dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/10",     ring: "ring-red-400/20" },
    assigned: { label: "Assigned", dot: "bg-blue-400",    text: "text-blue-400",    bg: "bg-blue-400/10",    ring: "ring-blue-400/20" },
  };

  function PriBadge({ p, isAi }) {
    const c = PRI_BADGE[p] || PRI_BADGE.low;
    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${c.bg} ${c.text} ${c.ring}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
          {c.label}
        </span>
        {isAi && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter bg-amber-400/20 text-amber-500 border border-amber-400/30 animate-pulse">
            AI Predicted
          </span>
        )}
      </div>
    );
  }
  function StatBadge({ s }) {
    const c = STAT_BADGE[s] || STAT_BADGE.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${c.bg} ${c.text} ${c.ring}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {c.label}
      </span>
    );
  }

  const getPriorityIcon = (priority) => {
    const icons = { critical: "🚨", high: "⚠️", medium: "📌", low: "ℹ️" };
    return icons[priority?.toLowerCase()] || "📋";
  };

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
          body { margin: 0; background: #0d1117; }
        `}</style>
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#30363d] border-t-amber-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-sm font-medium" style={{ fontFamily: "'DM Sans',sans-serif" }}>
              Loading requests…
            </p>
          </div>
        </div>
      </>
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
        @keyframes toastIn { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fu  { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        select option { background: #161b22; }
      `}</style>

      <div className="min-h-screen bg-[#0d1117] text-slate-300">

        {/* Amber grid texture */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(232,162,62,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,162,62,0.025) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 py-10">

          {/* ── Page Title ── */}
          <div className="fu mb-8" style={{ animationDelay: "0ms" }}>
            <h1 className="text-[2rem] font-bold text-slate-100 leading-none flex items-center gap-3"
              style={{ fontFamily: "'Playfair Display',serif" }}>
              <span>📋</span> Requests Management
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">Review, approve, and assign relief requests</p>
          </div>

          {/* ── Toolbar ── */}
          <div className="fu bg-[#161b22] border border-[#30363d] rounded-2xl p-5 mb-5 shadow-xl" style={{ animationDelay: "50ms" }}>
            <div className="flex flex-wrap items-end gap-4">

              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Search</p>
                <div className="relative flex items-center">
                  <svg className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by camp name or details…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] focus:border-amber-400/50 focus:shadow-[0_0_0_3px_rgba(232,162,62,0.07)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                    style={{ fontFamily: "'DM Sans',sans-serif" }}
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Priority</p>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] rounded-xl px-3 py-2.5 text-sm text-slate-400 outline-none cursor-pointer transition-all"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}>
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Status</p>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] rounded-xl px-3 py-2.5 text-sm text-slate-400 outline-none cursor-pointer transition-all"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="assigned">Assigned</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Clear */}
              {(filterPriority !== "all" || filterStatus !== "pending" || searchTerm) && (
                <button
                  onClick={() => { setFilterPriority("all"); setFilterStatus("pending"); setSearchTerm(""); }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#21262d] text-slate-400 border border-[#30363d] hover:text-slate-200 hover:border-[#484f58] transition-all">
                  Clear Filters
                </button>
              )}
            </div>

            {/* Summary row */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#21262d]">
              <span className="text-xs font-mono text-slate-600">
                Showing {filteredRequests.length} of {requests.length} requests
              </span>
              <span className="text-lg font-bold text-slate-300 font-mono">{filteredRequests.length}
                <span className="text-xs text-slate-600 font-normal ml-1.5">Active</span>
              </span>
            </div>
          </div>

          {/* ── Requests List ── */}
          <div className="fu space-y-4" style={{ animationDelay: "100ms" }}>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request, i) => {
                const pri = PRI_BADGE[request.request_priority] || PRI_BADGE.low;
                const date = new Date(request.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric"
                });
                const initials = request.camp_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

                return (
                  <div key={request._id}
                    className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl hover:border-[#484f58] transition-all"
                    style={{ animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both` }}>

                    {/* Priority accent bar */}
                    <div className={`h-0.5 w-full ${pri.bar}`} />

                    {/* Card Header */}
                    <div className="flex items-start gap-4 p-5 border-b border-[#21262d]">
                      <div className="w-11 h-11 rounded-xl bg-[#21262d] border border-[#30363d] flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-bold text-slate-100" style={{ fontFamily: "'Playfair Display',serif" }}>
                              {request.camp_name}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {request.camp_location}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs font-mono text-slate-600">{date}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          <PriBadge p={request.request_priority} isAi={request.isAiGenerated} />
                          <StatBadge s={request.request_status} />
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono text-slate-500 bg-[#21262d] ring-1 ring-[#30363d]">
                            👥 {request.estimated_people_affected}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">

                      {/* Details */}
                      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-3.5 text-xs text-slate-500 leading-relaxed mb-4">
                        {request.request_details}
                      </div>

                      {/* Items */}
                      <div className="mb-4">
                        <p className="text-xs uppercase tracking-widest text-slate-600 mb-2.5">
                          Requested Items
                          <span className="ml-1.5 font-mono bg-[#21262d] text-slate-500 px-1.5 py-0.5 rounded text-[10px]">
                            {request.items.length}
                          </span>
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          {request.items.map((item, idx) => (
                            <div key={idx}
                              className="flex items-center justify-between p-2.5 bg-[#0d1117] border border-[#21262d] rounded-xl">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-slate-300 truncate">{item.itemName}</div>
                                <div className="text-xs font-mono mt-0.5">
                                  <span className="text-amber-400 font-bold">{item.qty}</span>
                                  <span className="text-slate-600 ml-1">{item.unit}</span>
                                </div>
                              </div>
                              <span className="text-base ml-1.5 flex-shrink-0">📦</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Admin Reply */}
                      {request.request_reply && (request.request_status === "accepted" || request.request_status === "rejected") && (
                        <div className={`mb-4 p-3.5 rounded-xl border ${
                          request.request_status === "accepted"
                            ? "bg-emerald-400/5 border-emerald-400/20"
                            : "bg-red-400/5 border-red-400/20"
                        }`}>
                          <p className={`text-xs uppercase tracking-widest mb-1.5 ${
                            request.request_status === "accepted" ? "text-emerald-500" : "text-red-500"
                          }`}>
                            {request.request_status === "accepted" ? "Admin Response" : "Rejection Reason"}
                          </p>
                          <p className={`text-sm leading-relaxed ${
                            request.request_status === "accepted" ? "text-emerald-400" : "text-red-400"
                          }`}>
                            {request.request_reply}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#21262d]">
                        {request.request_status === "pending" && (
                          <>
                            <button
                              onClick={() => openReplyModal(request, "accept")}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20 hover:bg-emerald-500 hover:text-black hover:ring-emerald-500 transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6 9 17l-5-5" />
                              </svg>
                              Accept
                            </button>
                            <button
                              onClick={() => openAssignModal(request)}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20 hover:bg-blue-500 hover:text-white hover:ring-blue-500 transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Assign Volunteers
                            </button>
                            <button
                              onClick={() => openReplyModal(request, "reject")}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-400/10 text-red-400 ring-1 ring-red-400/20 hover:bg-red-500 hover:text-white hover:ring-red-500 transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18M6 6l12 12" />
                              </svg>
                              Reject
                            </button>
                          </>
                        )}
                        {request.request_status === "accepted" && (
                          <button
                            onClick={() => openAssignModal(request)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20 hover:bg-blue-500 hover:text-white hover:ring-blue-500 transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Assign Volunteers
                          </button>
                        )}
                        {request.request_status === "assigned" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-blue-400/10 text-blue-400 ring-blue-400/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            Volunteers Assigned
                          </span>
                        )}
                        {request.request_status === "rejected" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-red-400/10 text-red-400 ring-red-400/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Request Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-16 text-center">
                <div className="text-4xl mb-3 opacity-30">📭</div>
                <div className="text-slate-400 font-semibold text-sm">No requests found</div>
                <div className="text-slate-600 text-xs mt-1">Try adjusting your filters or search query</div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Assign Volunteers Modal ── */}
      {assignModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setAssignModalOpen(false)}>
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-3xl max-h-[88vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>

            <div className="h-0.5 w-full bg-blue-500 rounded-t-2xl" />

            {/* Header */}
            <div className="flex items-start gap-4 p-6 border-b border-[#21262d]">
              <div className="w-11 h-11 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-xl flex-shrink-0">👥</div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-100" style={{ fontFamily: "'Playfair Display',serif" }}>
                  Assign Volunteers
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedRequest.camp_name}</p>
              </div>
              <button onClick={() => setAssignModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all text-sm flex-shrink-0">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Request summary */}
              <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 mb-5">
                <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Request Summary</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">{selectedRequest.request_details}</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRequest.items.slice(0, 4).map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#161b22] border border-[#30363d] rounded-lg text-xs text-slate-400 font-mono">
                      {item.itemName} ({item.qty})
                    </span>
                  ))}
                  {selectedRequest.items.length > 4 && (
                    <span className="px-2 py-0.5 bg-[#21262d] rounded-lg text-xs text-slate-500 font-mono">
                      +{selectedRequest.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Volunteer list */}
              <p className="text-xs uppercase tracking-widest text-slate-600 mb-3">
                Select Volunteers
                <span className="ml-1.5 font-mono bg-[#21262d] text-amber-400 px-1.5 py-0.5 rounded text-[10px]">
                  {selectedVolunteers.length} selected
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1 mb-5">
                {volunteers.map((volunteer) => {
                  const isSelected = selectedVolunteers.includes(volunteer._id);
                  const isAvailable = volunteer.availability === true;
                  return (
                    <button
                      key={volunteer._id}
                      onClick={() => isAvailable && toggleVolunteerSelection(volunteer._id)}
                      disabled={!isAvailable}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? "border-blue-400/40 bg-blue-400/10"
                          : isAvailable
                          ? "border-[#30363d] bg-[#0d1117] hover:border-[#484f58]"
                          : "border-[#21262d] bg-[#0d1117] opacity-40 cursor-not-allowed"
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isAvailable ? "bg-blue-400/10 text-blue-400 border border-blue-400/20" : "bg-[#21262d] text-slate-500 border border-[#30363d]"
                        }`}>
                          {volunteer.volunteer_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-200 truncate">{volunteer.volunteer_name}</p>
                            {isSelected && <span className="text-blue-400 text-sm flex-shrink-0">✓</span>}
                          </div>
                          <p className="text-xs text-slate-600 font-mono truncate">{volunteer.volunteer_email}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#21262d]">
              <button onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#21262d] text-slate-400 hover:text-slate-200 border border-[#30363d] hover:bg-[#2d333b] transition-all">
                Cancel
              </button>
              <button
                onClick={handleAssignVolunteers}
                disabled={selectedVolunteers.length === 0}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all shadow-lg ${
                  selectedVolunteers.length > 0
                    ? "bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/25"
                    : "bg-[#21262d] text-slate-600 cursor-not-allowed border border-[#30363d]"
                }`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6 9 17l-5-5" />
                </svg>
                Assign {selectedVolunteers.length > 0 ? selectedVolunteers.length : ""} Volunteer{selectedVolunteers.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reply Modal (Accept / Reject) ── */}
      {replyModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setReplyModalOpen(false)}>
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "scaleIn 0.22s cubic-bezier(0.16,1,0.3,1)" }}>

            <div className={`h-0.5 w-full rounded-t-2xl ${replyAction === "accept" ? "bg-emerald-500" : "bg-red-500"}`} />

            {/* Header */}
            <div className="flex items-start gap-4 p-6 border-b border-[#21262d]">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                replyAction === "accept" ? "bg-emerald-400/10" : "bg-red-400/10"
              }`}>
                {replyAction === "accept" ? "✅" : "❌"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-100" style={{ fontFamily: "'Playfair Display',serif" }}>
                  {replyAction === "accept" ? "Accept Request" : "Reject Request"}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedRequest.camp_name}</p>
              </div>
              <button onClick={() => setReplyModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all text-sm flex-shrink-0">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Summary */}
              <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 mb-5">
                <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Request Summary</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">{selectedRequest.request_details}</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRequest.items.slice(0, 4).map((item, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#161b22] border border-[#30363d] rounded-lg text-xs text-slate-400 font-mono">
                      {item.itemName} ({item.qty})
                    </span>
                  ))}
                  {selectedRequest.items.length > 4 && (
                    <span className="px-2 py-0.5 bg-[#21262d] rounded-lg text-xs text-slate-500 font-mono">
                      +{selectedRequest.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Textarea */}
              <div className="mb-2">
                <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">
                  {replyAction === "accept" ? "Response Message" : "Reason for Rejection"}
                  <span className="ml-1 text-red-400">*</span>
                </p>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={
                    replyAction === "accept"
                      ? "Enter your response (e.g. estimated delivery time, special instructions…)"
                      : "Please provide a reason for rejecting this request…"
                  }
                  rows={4}
                  className="w-full bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] focus:border-amber-400/50 focus:shadow-[0_0_0_3px_rgba(232,162,62,0.07)] rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 outline-none transition-all resize-none leading-relaxed"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}
                />
                <p className="text-xs text-slate-600 mt-1.5 font-mono">This message will be sent to the camp administrator.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#21262d]">
              <button onClick={() => setReplyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#21262d] text-slate-400 hover:text-slate-200 border border-[#30363d] hover:bg-[#2d333b] transition-all">
                Cancel
              </button>
              <button onClick={handleSubmitReply}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all shadow-lg ${
                  replyAction === "accept"
                    ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/25"
                    : "bg-red-500 hover:bg-red-400 text-white shadow-red-500/25"
                }`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {replyAction === "accept"
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 6 9 17l-5-5" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18M6 6l12 12" />}
                </svg>
                {replyAction === "accept" ? "Accept & Send" : "Reject & Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {notification.show && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border backdrop-blur-sm pointer-events-auto
              ${notification.type === "success"
                ? "bg-emerald-950/90 border-emerald-700/40 text-emerald-300"
                : "bg-red-950/90 border-red-700/40 text-red-300"}`}
            style={{ animation: "toastIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
            <span className="text-base flex-shrink-0">{notification.type === "success" ? "✅" : "❌"}</span>
            {notification.message}
          </div>
        )}
      </div>
    </>
  );
};

export default Requests;