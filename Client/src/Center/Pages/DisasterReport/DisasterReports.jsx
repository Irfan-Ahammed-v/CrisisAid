import axios from "axios";
import React, { useState, useEffect } from "react";

const DisasterReports = () => {
  const [loading, setLoading] = useState(true);
  const [disasters, setDisasters] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  });

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = () => {
    axios.get(`${BASE_URL}/center/disasters`)
      .then(response => {
        setDisasters(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const filteredDisasters = disasters.filter(disaster => {
    const typeName = disaster.disaster_type?.disaster_type_name || "";
    const placeName = disaster.place_id?.place_name || "";
    const details = disaster.disaster_details || "";

    const matchesStatus = filterStatus === "all" || disaster.disaster_status === filterStatus;
    const matchesSearch = placeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         typeName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openDetailModal = (disaster) => {
    setSelectedDisaster(disaster);
    setDetailModalOpen(true);
  };

  const handleAlertVolunteers = (disaster) => {
    showNotification("success", `Alert sent to all available volunteers for ${disaster.place_id?.place_name}`);
  };

  const handleStatusChange = (disasterId, newStatus) => {
    axios.put(`${BASE_URL}/center/updateDisasterStatus/${disasterId}`, { status: newStatus })
      .then(() => {
        setDisasters(prev => prev.map(d =>
          d._id === disasterId ? { ...d, disaster_status: newStatus } : d
        ));
        showNotification("success", `Disaster status updated to ${newStatus}`);
      })
      .catch(err => {
        console.error("Error updating status:", err);
        showNotification("error", "Failed to update status");
      });
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3500);
  };

  const STAT_BADGE = {
    active:    { label: "Active",    dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/10",     ring: "ring-red-400/20" },
    resolved:  { label: "Resolved",  dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20" },
  };

  function StatBadge({ s }) {
    const c = STAT_BADGE[s] || STAT_BADGE.active;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${c.bg} ${c.text} ${c.ring}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {c.label}
      </span>
    );
  }

  const getDisasterIcon = (type) => {
    const icons = {
      "Flood": "🌊", "Landslide": "⛰️", "Storm": "🌪️",
      "Fire": "🔥", "Disease": "🦠", "Earthquake": "🫨"
    };
    return icons[type] || "⚠️";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#30363d] border-t-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-medium">Loading disaster reports…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        body { margin: 0; background: #0d1117; font-family: 'DM Sans', sans-serif; }
        @keyframes toastIn  { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.94) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fu  { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .fu1 { animation-delay: 0ms; }
        .fu2 { animation-delay: 50ms; }
        .fu3 { animation-delay: 100ms; }
      `}</style>

      <div className="min-h-screen bg-[#0d1117] text-slate-300">
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(232,162,62,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,162,62,0.025) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 py-10">
          <div className="fu fu1 mb-8">
            <h1 className="text-[2rem] font-bold text-slate-100 leading-none flex items-center gap-3"
              style={{ fontFamily: "'Playfair Display',serif" }}>
              <span>🚨</span> Disaster Reports
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">Monitor and respond to emergency situations</p>
          </div>

          <div className="fu fu2 bg-[#161b22] border border-[#30363d] rounded-2xl p-5 mb-5 shadow-xl">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Search</p>
                <div className="relative flex items-center">
                  <svg className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by place, type, or details…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] focus:border-amber-400/50 focus:shadow-[0_0_0_3px_rgba(232,162,62,0.07)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Status</p>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] rounded-xl px-3 py-2.5 text-sm text-slate-400 outline-none cursor-pointer transition-all">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {(filterStatus !== "all" || searchTerm) && (
                <button
                  onClick={() => { setFilterStatus("all"); setSearchTerm(""); }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#21262d] text-slate-400 border border-[#30363d] hover:text-slate-200 hover:border-[#484f58] transition-all">
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#21262d]">
              <span className="text-xs font-mono text-slate-600">
                Showing {filteredDisasters.length} of {disasters.length} reports
              </span>
            </div>
          </div>

          <div className="fu fu3 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredDisasters.length > 0 ? (
              filteredDisasters.map((disaster, i) => {
                const date = new Date(disaster.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
                const typeName = disaster.disaster_type?.disaster_type_name || "Unknown Type";
                const placeName = disaster.place_id?.place_name || "Unknown Place";

                return (
                  <div key={disaster._id}
                    className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-[#484f58]"
                    style={{ animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both` }}>

                    <div className="flex items-start gap-4 p-5 border-b border-[#21262d]">
                      <div className="w-11 h-11 rounded-xl bg-[#21262d] border border-[#30363d] flex items-center justify-center text-xl flex-shrink-0">
                        {getDisasterIcon(typeName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold text-slate-100" style={{ fontFamily: "'Playfair Display',serif" }}>
                              {typeName}
                            </h3>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">{placeName}</p>
                          </div>
                          <StatBadge s={disaster.disaster_status} />
                        </div>
                        <div className="mt-2.5">
                          <span className="text-xs font-mono text-slate-600">{date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-3.5 text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3 h-20 overflow-hidden">
                        {disaster.disaster_details}
                      </div>

                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => openDetailModal(disaster)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#21262d] text-slate-400 border border-[#30363d] hover:text-slate-200 hover:border-[#484f58] transition-all">
                          View Details
                        </button>
                        <button
                          onClick={() => handleAlertVolunteers(disaster)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20 hover:bg-amber-400 hover:text-black hover:ring-amber-400 transition-all">
                          Alert Volunteers
                        </button>
                      </div>

                      {disaster.disaster_status !== "resolved" && (
                        <div className="pt-3 border-t border-[#21262d]">
                          <button
                            onClick={() => handleStatusChange(disaster._id, "resolved")}
                            className="w-full px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20 hover:bg-emerald-500 hover:text-black hover:ring-emerald-500 transition-all">
                            Mark Resolved
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-16 text-center">
                <div className="text-4xl mb-3 opacity-30">📋</div>
                <div className="text-slate-400 font-semibold text-sm">No disaster reports found</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {detailModalOpen && selectedDisaster && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setDetailModalOpen(false)}>
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>

            <div className="flex items-start gap-4 p-6 border-b border-[#21262d]">
              <div className="w-11 h-11 rounded-xl bg-[#21262d] border border-[#30363d] flex items-center justify-center text-xl flex-shrink-0">
                {getDisasterIcon(selectedDisaster.disaster_type?.disaster_type_name)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-100 truncate" style={{ fontFamily: "'Playfair Display',serif" }}>
                  {selectedDisaster.disaster_type?.disaster_type_name}
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{selectedDisaster.place_id?.place_name}</p>
              </div>
              <button onClick={() => setDetailModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-400/30 transition-all font-bold">
                ✕
              </button>
            </div>

            <div className="px-6 pt-5">
              <img
                src={`${BASE_URL}/uploads/disasters/${selectedDisaster.disaster_photo}`}
                alt="Disaster scene"
                className="w-full h-64 object-cover rounded-xl border border-[#30363d]"
                onError={(e) => (e.target.src = "https://via.placeholder.com/800x400?text=No+Image+Available")}
              />
            </div>

            <div className="p-6 grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Status</p>
                <StatBadge s={selectedDisaster.disaster_status} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Reported At</p>
                <p className="text-sm text-slate-300 font-mono">{new Date(selectedDisaster.createdAt).toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Situation Description</p>
                <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {selectedDisaster.disaster_details}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#21262d]">
              <button onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#21262d] text-slate-400 hover:text-slate-200 border border-[#30363d] hover:bg-[#2d333b] transition-all">
                Close
              </button>
              <button
                onClick={() => handleAlertVolunteers(selectedDisaster)}
                className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20 hover:bg-amber-400 hover:text-black hover:ring-amber-400 transition-all">
                Alert Volunteers
              </button>
            </div>
          </div>
        </div>
      )}

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

export default DisasterReports;
