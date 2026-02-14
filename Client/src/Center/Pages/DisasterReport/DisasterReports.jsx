import React, { useState, useEffect } from "react";

const DisasterReports = () => {
  const [loading, setLoading] = useState(true);
  const [disasters, setDisasters] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisaster, setSelectedDisaster] = useState(null);
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
    const sampleDisasters = [
      {
        _id: "d1",
        camp_name: "Riverside Relief Camp",
        camp_location: "Kollam, Kerala",
        disaster_type: "Flood",
        disaster_severity: "critical",
        disaster_status: "active",
        disaster_description: "Heavy flooding due to continuous rainfall for 48 hours. Water level rising rapidly, approaching camp boundaries. Multiple buildings partially submerged. Immediate evacuation assistance required for 300+ people.",
        affected_areas: "Main camp area, storage facility, medical unit",
        immediate_needs: "Boats for evacuation, emergency supplies, temporary shelter",
        estimated_people_affected: 320,
        disaster_photo: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800",
        contact_person: "Dr. Radhika Nair",
        contact_phone: "+91 9876543220",
        reported_at: new Date("2024-02-12T06:30:00"),
        admin_response: null
      },
      {
        _id: "d2",
        camp_name: "Mountain View Shelter",
        camp_location: "Idukki, Kerala",
        disaster_type: "Landslide",
        disaster_severity: "high",
        disaster_status: "active",
        disaster_description: "Major landslide occurred on eastern slope after heavy rains. Access road blocked, cutting off supply routes. Several families displaced from nearby areas seeking shelter. Debris removal equipment urgently needed.",
        affected_areas: "Eastern sector, access road, water supply line",
        immediate_needs: "Heavy machinery, medical supplies, food stocks",
        estimated_people_affected: 180,
        disaster_photo: "https://images.unsplash.com/photo-1558486012-817176f84c6d?w=800",
        contact_person: "Suresh Kumar",
        contact_phone: "+91 9876543221",
        reported_at: new Date("2024-02-11T14:20:00"),
        admin_response: "Emergency response team dispatched. ETA 2 hours. Helicopter evacuation on standby."
      },
      {
        _id: "d3",
        camp_name: "Coastal Relief Center",
        camp_location: "Alappuzha, Kerala",
        disaster_type: "Storm Damage",
        disaster_severity: "high",
        disaster_status: "active",
        disaster_description: "Severe coastal storm caused extensive damage to camp infrastructure. Multiple tents destroyed, kitchen facility damaged, electrical systems compromised. Strong winds continuing. Urgently need shelter materials and power backup.",
        affected_areas: "Temporary shelters, kitchen, power grid",
        immediate_needs: "Tents, tarpaulins, generators, food supplies",
        estimated_people_affected: 250,
        disaster_photo: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800",
        contact_person: "Lakshmi Menon",
        contact_phone: "+91 9876543222",
        reported_at: new Date("2024-02-11T09:15:00"),
        admin_response: null
      },
      {
        _id: "d4",
        camp_name: "Green Meadows Shelter",
        camp_location: "Thrissur, Kerala",
        disaster_type: "Fire Outbreak",
        disaster_severity: "critical",
        disaster_status: "active",
        disaster_description: "Fire broke out in storage area at 3 AM. Quickly spreading due to stored dry goods. Fire services on site but need additional support. Multiple families evacuated to safe zone. Medical assistance needed for smoke inhalation cases.",
        affected_areas: "Storage warehouse, adjacent sleeping quarters",
        immediate_needs: "Fire extinguishers, medical team, alternative storage",
        estimated_people_affected: 150,
        disaster_photo: "https://images.unsplash.com/photo-1526739178601-37a7cda1d730?w=800",
        contact_person: "Ravi Varma",
        contact_phone: "+91 9876543223",
        reported_at: new Date("2024-02-12T03:00:00"),
        admin_response: "Fire brigade and medical team en route. Evacuation protocol activated."
      },
      {
        _id: "d5",
        camp_name: "Valley Haven Camp",
        camp_location: "Kottayam, Kerala",
        disaster_type: "Disease Outbreak",
        disaster_severity: "medium",
        disaster_status: "contained",
        disaster_description: "Multiple cases of waterborne illness reported over past 3 days. Water source potentially contaminated. Quarantine measures implemented. Medical screening ongoing for all residents. Need medical supplies and clean water urgently.",
        affected_areas: "Living quarters, water supply",
        immediate_needs: "Medical supplies, ORS, antibiotics, bottled water",
        estimated_people_affected: 85,
        disaster_photo: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800",
        contact_person: "Dr. Priya Krishnan",
        contact_phone: "+91 9876543224",
        reported_at: new Date("2024-02-10T11:30:00"),
        admin_response: "Medical team deployed. Water testing completed. Clean water supply arranged."
      },
      {
        _id: "d6",
        camp_name: "Sunrise Relief Camp",
        camp_location: "North District, Kerala",
        disaster_type: "Structural Damage",
        disaster_severity: "medium",
        disaster_status: "active",
        disaster_description: "Main building showing signs of structural weakness after recent tremors. Cracks appearing in walls and foundation. Engineering assessment urgently required. Residents moved to temporary tents as precaution.",
        affected_areas: "Main building, foundation",
        immediate_needs: "Structural engineer, temporary housing, safety barriers",
        estimated_people_affected: 200,
        disaster_photo: "https://images.unsplash.com/photo-1590496793907-0b375bc29c94?w=800",
        contact_person: "Anil Kumar",
        contact_phone: "+91 9876543225",
        reported_at: new Date("2024-02-10T16:45:00"),
        admin_response: null
      },
      {
        _id: "d7",
        camp_name: "Hope Valley Camp",
        camp_location: "Ernakulam, Kerala",
        disaster_type: "Power Outage",
        disaster_severity: "low",
        disaster_status: "resolved",
        disaster_description: "Complete power failure due to transformer damage during storm. Backup generator functioning but fuel running low. Essential services maintained. Need electrical repairs and fuel supply.",
        affected_areas: "Entire camp",
        immediate_needs: "Electrician, generator fuel, backup batteries",
        estimated_people_affected: 120,
        disaster_photo: null,
        contact_person: "Maya Nair",
        contact_phone: "+91 9876543226",
        reported_at: new Date("2024-02-09T08:00:00"),
        admin_response: "Power restored. Transformer replaced. Fuel supply delivered."
      },
      {
        _id: "d8",
        camp_name: "Riverside Emergency Camp",
        camp_location: "Kollam, Kerala",
        disaster_type: "Water Contamination",
        disaster_severity: "high",
        disaster_status: "active",
        disaster_description: "Well water tested positive for bacterial contamination. All residents advised to stop using well water immediately. Distribution of bottled water ongoing but supplies limited. Water purification system urgently needed.",
        affected_areas: "Water supply system",
        immediate_needs: "Water purification units, bottled water, testing kits",
        estimated_people_affected: 160,
        disaster_photo: null,
        contact_person: "Deepak Menon",
        contact_phone: "+91 9876543227",
        reported_at: new Date("2024-02-11T13:00:00"),
        admin_response: null
      }
    ];

    setDisasters(sampleDisasters);
    setLoading(false);
  };

  const filteredDisasters = disasters.filter(disaster => {
    const matchesSeverity = filterSeverity === "all" || disaster.disaster_severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || disaster.disaster_status === filterStatus;
    const matchesType = filterType === "all" || disaster.disaster_type === filterType;
    const matchesSearch = disaster.camp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disaster.disaster_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disaster.disaster_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesStatus && matchesType && matchesSearch;
  });

  const openDetailModal = (disaster) => {
    setSelectedDisaster(disaster);
    setDetailModalOpen(true);
  };

  const handleAlertVolunteers = (disaster) => {
    showNotification("success", `Alert sent to all available volunteers for ${disaster.camp_name}`);
  };

  const handleStatusChange = (disasterId, newStatus) => {
    setDisasters(prev => prev.map(d =>
      d._id === disasterId ? { ...d, disaster_status: newStatus } : d
    ));
    showNotification("success", `Disaster status updated to ${newStatus}`);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3500);
  };

  // ── Badge configs matching Camp Management style ──
  const SEV_BADGE = {
    critical: { label: "Critical", dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/10",     ring: "ring-red-400/20",     bar: "bg-red-500" },
    high:     { label: "High",     dot: "bg-orange-400",  text: "text-orange-400",  bg: "bg-orange-400/10",  ring: "ring-orange-400/20",  bar: "bg-orange-500" },
    medium:   { label: "Medium",   dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10",   ring: "ring-amber-400/20",   bar: "bg-amber-400" },
    low:      { label: "Low",      dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20", bar: "bg-emerald-500" },
  };
  const STAT_BADGE = {
    active:    { label: "Active",    dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/10",     ring: "ring-red-400/20" },
    contained: { label: "Contained", dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10",   ring: "ring-amber-400/20" },
    resolved:  { label: "Resolved",  dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20" },
  };

  function SevBadge({ s }) {
    const c = SEV_BADGE[s] || SEV_BADGE.low;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${c.bg} ${c.text} ${c.ring}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {c.label}
      </span>
    );
  }
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
      "Flood": "🌊", "Landslide": "⛰️", "Storm Damage": "🌪️",
      "Fire Outbreak": "🔥", "Disease Outbreak": "🦠", "Structural Damage": "🏗️",
      "Power Outage": "⚡", "Water Contamination": "💧"
    };
    return icons[type] || "⚠️";
  };

  const disasterTypes = [...new Set(disasters.map(d => d.disaster_type))];

  const severityBar = (s) => SEV_BADGE[s]?.bar || "bg-slate-500";

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
              Loading disaster reports…
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
        @keyframes toastIn  { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.94) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fu  { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .fu1 { animation-delay: 0ms; }
        .fu2 { animation-delay: 50ms; }
        .fu3 { animation-delay: 100ms; }
        .card-hover:hover { background: rgba(255,255,255,0.022); }
        select option { background: #161b22; }
      `}</style>

      <div className="min-h-screen bg-[#0d1117] text-slate-300">

        {/* Subtle amber grid texture */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(232,162,62,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,162,62,0.025) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 py-10">

          {/* ── Page Title ── */}
          <div className="fu fu1 mb-8">
            <h1 className="text-[2rem] font-bold text-slate-100 leading-none flex items-center gap-3"
              style={{ fontFamily: "'Playfair Display',serif" }}>
              <span>🚨</span> Disaster Reports
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">Monitor and respond to emergency situations</p>
          </div>

          {/* ── Toolbar ── */}
          <div className="fu fu2 bg-[#161b22] border border-[#30363d] rounded-2xl p-5 mb-5 shadow-xl">
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
                    placeholder="Search by camp, type, or description…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] focus:border-amber-400/50 focus:shadow-[0_0_0_3px_rgba(232,162,62,0.07)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                    style={{ fontFamily: "'DM Sans',sans-serif" }}
                  />
                </div>
              </div>

              {/* Severity */}
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Severity</p>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] rounded-xl px-3 py-2.5 text-sm text-slate-400 outline-none cursor-pointer transition-all"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}>
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Disaster Type</p>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[#0d1117] border border-[#30363d] hover:border-[#484f58] rounded-xl px-3 py-2.5 text-sm text-slate-400 outline-none cursor-pointer transition-all"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}>
                  <option value="all">All Types</option>
                  {disasterTypes.map(type => <option key={type} value={type}>{type}</option>)}
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
                  <option value="active">Active</option>
                  <option value="contained">Contained</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Clear */}
              {(filterSeverity !== "all" || filterStatus !== "all" || filterType !== "all" || searchTerm) && (
                <button
                  onClick={() => { setFilterSeverity("all"); setFilterStatus("all"); setFilterType("all"); setSearchTerm(""); }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#21262d] text-slate-400 border border-[#30363d] hover:text-slate-200 hover:border-[#484f58] transition-all">
                  Clear Filters
                </button>
              )}
            </div>

            {/* Summary row */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#21262d]">
              <span className="text-xs font-mono text-slate-600">
                Showing {filteredDisasters.length} of {disasters.length} reports
              </span>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="text-lg font-bold text-red-400 font-mono">{filteredDisasters.filter(d => d.disaster_severity === "critical").length}</span>
                  <span className="text-xs text-slate-600 ml-1.5">Critical</span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-slate-300 font-mono">{filteredDisasters.length}</span>
                  <span className="text-xs text-slate-600 ml-1.5">Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Cards Grid ── */}
          <div className="fu fu3 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredDisasters.length > 0 ? (
              filteredDisasters.map((disaster, i) => {
                const sev = SEV_BADGE[disaster.disaster_severity] || SEV_BADGE.low;
                const date = new Date(disaster.reported_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={disaster._id}
                    className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-[#484f58]"
                    style={{ animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both` }}>

                    {/* Severity accent bar */}
                    <div className={`h-0.5 w-full ${sev.bar}`} />

                    {/* Card Header */}
                    <div className="flex items-start gap-4 p-5 border-b border-[#21262d]">
                      <div className="w-11 h-11 rounded-xl bg-[#21262d] border border-[#30363d] flex items-center justify-center text-xl flex-shrink-0">
                        {getDisasterIcon(disaster.disaster_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold text-slate-100" style={{ fontFamily: "'Playfair Display',serif" }}>
                              {disaster.disaster_type}
                            </h3>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">{disaster.camp_name}</p>
                            <p className="text-xs text-slate-600 font-mono mt-0.5 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {disaster.camp_location}
                            </p>
                          </div>
                          <SevBadge s={disaster.disaster_severity} />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          <StatBadge s={disaster.disaster_status} />
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono text-slate-500 bg-[#21262d] ring-1 ring-[#30363d]">
                            👥 {disaster.estimated_people_affected}
                          </span>
                          <span className="text-xs font-mono text-slate-600">{date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-3.5 text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                        {disaster.disaster_description}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => openDetailModal(disaster)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#21262d] text-slate-400 border border-[#30363d] hover:text-slate-200 hover:border-[#484f58] transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                        <button
                          onClick={() => handleAlertVolunteers(disaster)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20 hover:bg-amber-400 hover:text-black hover:ring-amber-400 transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          Alert Volunteers
                        </button>
                      </div>

                      {/* Status Change */}
                      {disaster.disaster_status !== "resolved" && (
                        <div className="pt-3 border-t border-[#21262d]">
                          <p className="text-xs uppercase tracking-widest text-slate-600 mb-2">Update Status</p>
                          <div className="flex gap-2">
                            {disaster.disaster_status !== "contained" && (
                              <button
                                onClick={() => handleStatusChange(disaster._id, "contained")}
                                className="flex-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20 hover:bg-amber-400 hover:text-black hover:ring-amber-400 transition-all">
                                Mark Contained
                              </button>
                            )}
                            <button
                              onClick={() => handleStatusChange(disaster._id, "resolved")}
                              className="flex-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20 hover:bg-emerald-500 hover:text-black hover:ring-emerald-500 transition-all">
                              Mark Resolved
                            </button>
                          </div>
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
                <div className="text-slate-600 text-xs mt-1">Try adjusting your filters or search query</div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Detail Modal ── */}
      {detailModalOpen && selectedDisaster && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setDetailModalOpen(false)}>
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>

            {/* Severity bar */}
            <div className={`h-0.5 w-full rounded-t-2xl ${SEV_BADGE[selectedDisaster.disaster_severity]?.bar || "bg-slate-500"}`} />

            {/* Header */}
            <div className="flex items-start gap-4 p-6 border-b border-[#21262d]">
              <div className="w-11 h-11 rounded-xl bg-[#21262d] border border-[#30363d] flex items-center justify-center text-xl flex-shrink-0">
                {getDisasterIcon(selectedDisaster.disaster_type)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-100 truncate" style={{ fontFamily: "'Playfair Display',serif" }}>
                  {selectedDisaster.disaster_type}
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{selectedDisaster.camp_name}</p>
                <p className="text-xs text-slate-600 font-mono mt-0.5">{selectedDisaster.camp_location}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <SevBadge s={selectedDisaster.disaster_severity} />
                <button onClick={() => setDetailModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all text-sm">
                  ✕
                </button>
              </div>
            </div>

            {/* Photo */}
            {selectedDisaster.disaster_photo && (
              <div className="px-6 pt-5">
                <img
                  src={selectedDisaster.disaster_photo}
                  alt="Disaster scene"
                  className="w-full h-52 object-cover rounded-xl border border-[#30363d]"
                />
              </div>
            )}

            {/* Body */}
            <div className="p-6 grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Severity</p>
                <SevBadge s={selectedDisaster.disaster_severity} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Status</p>
                <StatBadge s={selectedDisaster.disaster_status} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Contact Person</p>
                <p className="text-sm text-slate-200">{selectedDisaster.contact_person}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Phone</p>
                <p className="text-sm text-slate-300 font-mono">{selectedDisaster.contact_phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Reported At</p>
                <p className="text-sm text-slate-300 font-mono">{new Date(selectedDisaster.reported_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">People Affected</p>
                <p className="text-sm text-slate-200 font-mono">{selectedDisaster.estimated_people_affected}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Affected Areas</p>
                <p className="text-sm text-slate-300">{selectedDisaster.affected_areas}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Immediate Needs</p>
                <p className="text-sm text-red-400 font-semibold">{selectedDisaster.immediate_needs}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Situation Description</p>
                <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 text-sm text-slate-400 leading-relaxed">
                  {selectedDisaster.disaster_description}
                </div>
              </div>
              {selectedDisaster.admin_response && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Admin Response</p>
                  <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-4 text-sm text-emerald-400 leading-relaxed">
                    {selectedDisaster.admin_response}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#21262d]">
              <button onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#21262d] text-slate-400 hover:text-slate-200 border border-[#30363d] hover:bg-[#2d333b] transition-all">
                Close
              </button>
              <button
                onClick={() => handleAlertVolunteers(selectedDisaster)}
                className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20 hover:bg-amber-400 hover:text-black hover:ring-amber-400 transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Alert Volunteers
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

export default DisasterReports;