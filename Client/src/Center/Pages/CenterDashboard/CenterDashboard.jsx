import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { 
  Tent, 
  Users, 
  Clock, 
  Hand, 
  AlertTriangle, 
  ClipboardList, 
  Zap, 
  Check, 
  RotateCw, 
  Inbox,
  LayoutDashboard,
  Building2,
  CheckCircle2,
  Eye,
  User,
  ArrowRight,
  BarChart3,
  X,
  Circle
} from "lucide-react";

axios.defaults.withCredentials = true;

const CenterDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState("camps");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/center/overview");
      setDashboard(res.data);
      console.log(res.data);
      
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) navigate("/guest/login");
      setLoading(false);
    }
  };



  const toastTimeoutRef = useRef(null);

  const toast = (msg, type = "info") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setNotification({ show: true, type, message: msg });
    toastTimeoutRef.current = setTimeout(() => setNotification({ show: false, type: "", message: "" }), 2500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);
  const getSeverityColor = (severity) => ({
    low:      "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
    medium:   "bg-amber-400/10 text-amber-400 ring-amber-400/20",
    high:     "bg-orange-400/10 text-orange-400 ring-orange-400/20",
    critical: "bg-red-400/10 text-red-400 ring-red-400/20",
  }[severity?.toLowerCase()] || "bg-slate-700/40 text-slate-400 ring-slate-600/20");

  if (loading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-amber-400 mb-4"></div>
        <p className="text-slate-400 text-lg font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  const { center, stats, pendingCamps, pendingVolunteers, disasters, requests, volunteers, tasks } = dashboard;

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



        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-6">

          {/* 1. Overview Cards */}
          <div className="fu grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4" style={{ animationDelay: "50ms" }}>
            <OverviewCard title="Total Camps"         value={stats?.totalCamps        || 0} icon={<Tent size={24} />} color="blue"   />
            <OverviewCard title="Total Volunteers"    value={stats?.totalVolunteers   || 0} icon={<Users size={24} />} color="emerald"  />
            <OverviewCard title="Camp Approvals"      value={stats?.pendingCamps      || 0} icon={<Clock size={24} />} color="amber" badge="pending" />
            <OverviewCard title="Volunteer Approvals" value={stats?.pendingVolunteers || 0} icon={<Hand size={24} />} color="orange" badge="pending" />
            <OverviewCard title="Disaster Reports"    value={stats?.activeDisasters  || 0} icon={<AlertTriangle size={24} />} color="red"    badge="new"     />
            <OverviewCard title="Pending Requests"    value={stats?.pendingRequests   || 0} icon={<ClipboardList size={24} />} color="purple" badge="review"  />
          </div>

          {/* 2. Pending Approvals + Operational Status */}
          <div className="fu grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ animationDelay: "100ms" }}>
            {/* Approvals — 2 cols */}
            <div className="lg:col-span-2 bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d] p-6">
              <SectionHeader
                icon={<CheckCircle2 className="w-6 h-6 text-blue-400" />}
                title="Pending Approvals"
                onViewAll={() => navigate("/center/camp-management")}
              />

              {/* Tabs */}
              <div className="flex gap-0.5 mb-4 bg-[#0d1117]/50 p-1 rounded-xl w-fit">
                {["camps", "volunteers"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab ? "bg-[#21262d] text-slate-100" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab === "camps" ? `Camps` : `Volunteers`}
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${
                      activeTab === tab ? "bg-amber-400/15 text-amber-400" : "bg-[#21262d] text-slate-500"
                    }`}>
                      {tab === "camps" ? (pendingCamps?.length || 0) : (pendingVolunteers?.length || 0)}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {activeTab === "camps" ? (
                  pendingCamps?.length > 0
                    ? pendingCamps.map(c => (
                        <ApprovalRow
                          key={c._id}
                          avatar={<Tent size={20} />}
                          name={c.camp_name}
                          sub={c.place}
                          date={c.createdAt}
                          onView={() => navigate("/center/camp-management")}
                        />
                      ))
                    : <EmptyState message="No pending camp approvals" />
                ) : (
                  pendingVolunteers?.length > 0
                    ? pendingVolunteers.map(v => (
                        <ApprovalRow
                          key={v._id}
                          avatar={<User size={20} />}
                          name={v.volunteer_name}
                          sub={v.volunteer_email}
                          date={v.createdAt}
                          onView={() => navigate("/center/pending-approvals")}
                        />
                      ))
                    : <EmptyState message="No pending volunteer approvals" />
                )}
              </div>
            </div>

            {/* Operational Status — 1 col */}
            <div className="bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d] p-6">
              <SectionHeader
                icon={<BarChart3 className="w-6 h-6 text-emerald-400" />}
                title="Operational Status"
              />
              <div className="space-y-3 mt-2">
                <StatusItem label="Active Tasks"      value={tasks?.active    || 0} color="blue"   icon={<Zap size={18} />} />
                <StatusItem label="Completed Tasks"   value={tasks?.completed || 0} color="emerald"  icon={<Check size={18} />} />
                <StatusItem label="Ongoing Responses" value={tasks?.ongoing   || 0} color="orange" icon={<RotateCw size={18} />} />
              </div>
            </div>
          </div>

          {/* 3. Disaster Reports */}
          <div className="fu bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d] p-6" style={{ animationDelay: "150ms" }}>
            <SectionHeader
              icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
              title="Disaster Reports"
              onViewAll={() => navigate("/center/disaster-reports")}
            />
            <div className="mt-4 space-y-3">
              {disasters?.length > 0
                ? disasters.map(d => (
                    <div key={d._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0d1117]/50 rounded-xl border border-[#21262d] hover:border-red-400/30 transition-colors rh">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-200">{d.disaster_type_name}</span>                          
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${d.disaster_status === "active" ? "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20" : "bg-slate-700/40 text-slate-400 ring-slate-600/20"}`}>
                            <Circle className={`w-1.5 h-1.5 fill-current ${d.disaster_status === "active" ? "text-emerald-400" : "text-slate-500"}`} />
                            {d.disaster_status?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-300">{d.disaster_type}</p>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">
                          {new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <ViewDetailsBtn onClick={() => navigate("/center/disaster-reports")} />
                    </div>
                  ))
                : <EmptyState message="No disaster reports" icon={<AlertTriangle size={48} className="mx-auto opacity-20" />} />
              }
            </div>
          </div>

          {/* 4. Requests Review */}
          <div className="fu bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d] p-6" style={{ animationDelay: "200ms" }}>
            <SectionHeader
              icon={<ClipboardList className="w-6 h-6 text-purple-400" />}
              title="Pending Requests"
              onViewAll={() => navigate("/center/requests")}
            />
            <div className="mt-4 space-y-3">
              {requests?.length > 0
                ? requests.map(r => (
                    <div key={r._id} className="p-4 bg-[#0d1117]/50 rounded-xl border border-[#21262d] hover:border-purple-400/30 transition-colors rh">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-200">{r.camp_name}</span>
                            <PriorityBadge priority={r.request_priority} />
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-amber-400/10 text-amber-400 ring-amber-400/20">
                              <Circle className="w-1.5 h-1.5 fill-current text-amber-400" />
                              PENDING
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 line-clamp-2 mb-2">{r.request_details}</p>
                          {r.items?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {r.items.slice(0, 3).map((item, i) => (
                                <span key={i} className="px-2 py-0.5 bg-[#21262d] border border-[#30363d] rounded text-xs text-slate-400">
                                  {item.itemName} <span className="font-semibold text-slate-300">×{item.qty}</span>
                                </span>
                              ))}
                              {r.items.length > 3 && (
                                <span className="px-2 py-0.5 bg-[#30363d] text-slate-500 rounded text-xs">+{r.items.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-xs font-mono text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                          <ViewDetailsBtn onClick={() => navigate("/center/requests")} color="purple" />
                        </div>
                      </div>
                    </div>
                  ))
                : <EmptyState message="No pending requests" icon={<Inbox size={48} className="mx-auto opacity-20" />} />
              }
            </div>
          </div>

          {/* 5. Volunteer Management */}
          <div className="fu bg-[#161b22] rounded-2xl shadow-2xl border border-[#30363d] p-6" style={{ animationDelay: "250ms" }}>
            <SectionHeader
              icon={<Users className="w-6 h-6 text-indigo-400" />}
              title="Volunteer Management"
              onViewAll={() => navigate("/center/volunteer-management")}
            />

            {/* ── Pending volunteer approvals banner ── */}
            {pendingVolunteers?.length > 0 && (
              <div className="mt-4 mb-6 bg-amber-400/10 border border-amber-400/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-amber-400 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-400" />
                    Pending Volunteer Approvals
                    <span className="px-2 py-0.5 bg-amber-400/20 text-amber-400 text-xs rounded-full font-bold">
                      {pendingVolunteers.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => navigate("/center/pending-approvals")}
                    className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-1 transition-colors"
                  >
                    View All
                    <ArrowRight size={16} className="text-amber-400" />
                  </button>
                </div>
                <div className="space-y-2">
                  {pendingVolunteers.slice(0, 3).map(v => (
                    <div key={v._id} className="flex items-center justify-between bg-[#0d1117]/50 rounded-xl px-4 py-3 border border-[#21262d]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">
                          {v.volunteer_name?.charAt(0) || "?"}                        </div>
                        <div>
                          <p className="font-semibold text-slate-200 text-sm">{v.volunteer_name}</p>
                          <p className="text-xs text-slate-500 font-mono">{v.volunteer_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500">
                          {new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <button
                          onClick={() => navigate("/center/pending-approvals")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs rounded-lg font-bold transition-colors"
                        >
                          <Eye size={14} />
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingVolunteers.length > 3 && (
                    <p className="text-center text-xs text-amber-400 font-semibold pt-1">
                      +{pendingVolunteers.length - 3} more awaiting review
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>{/* /main */}

        {/* Notification toast */}
        {notification.show && (
          <div className="fixed top-6 right-6 z-50" style={{ animation: "toastIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
            <div className="bg-blue-950/90 border border-blue-700/40 text-blue-300 backdrop-blur-sm rounded-xl shadow-2xl p-4 min-w-[320px] max-w-sm flex items-start gap-3">
              <div className="text-base flex-shrink-0"><CheckCircle2 size={20} className="text-emerald-400" /></div>
              <p className="text-sm font-medium flex-1">{notification.message}</p>
              <button onClick={() => setNotification({ show: false, type: "", message: "" })} className="text-blue-400 hover:text-blue-200 shrink-0">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/* ─── Sub-components ─────────────────────────────────────────────── */

const OverviewCard = ({ title, value, icon, color, badge }) => {
  const colorClasses = {
    blue: "bg-blue-400/10",
    emerald: "bg-emerald-400/10",
    amber: "bg-amber-400/10",
    orange: "bg-orange-400/10",
    red: "bg-red-400/10",
    purple: "bg-purple-400/10",
  }[color] || "bg-blue-400/10";

  return (
    <div className="bg-[#161b22] rounded-xl shadow-sm border border-[#30363d] p-4 hover:border-[#484f58] transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`text-2xl p-2 rounded-lg ${colorClasses}`}>{icon}</div>
        {badge && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-amber-400/10 text-amber-400 ring-amber-400/20">{badge}</span>}
      </div>
      <p className="text-3xl font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-500 font-medium mt-0.5">{title}</p>
    </div>
  );
};

const SectionHeader = ({ icon, title, onViewAll }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2" style={{ fontFamily: "'Playfair Display',serif" }}>
      {icon}{title}
    </h2>
      {onViewAll && (
      <button onClick={onViewAll} className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors">
        View All
        <ArrowRight size={16} />
      </button>
    )}
  </div>
);

const ApprovalRow = ({ avatar, name, sub, date, onView }) => (
  <div className="flex items-center justify-between gap-3 p-3 bg-[#0d1117]/50 rounded-lg border border-[#21262d] hover:border-blue-400/30 transition-colors rh">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <span className="text-2xl">{avatar}</span>
      <div className="min-w-0">
        <p className="font-semibold text-slate-200 text-sm truncate">{name}</p>
        <p className="text-xs text-slate-500 truncate">{sub}</p>
        <p className="text-xs font-mono text-slate-600">
          {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </div>
    <ViewDetailsBtn onClick={onView} small />
  </div>
);

const ViewDetailsBtn = ({ onClick, color = "blue", small = false, full = false }) => {
  const colorClass = {
    blue: "bg-blue-500 hover:bg-blue-400 text-black",
    purple: "bg-purple-500 hover:bg-purple-400 text-black"
  }[color] || "bg-blue-500 hover:bg-blue-400 text-black";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 ${colorClass} rounded-lg font-bold transition-colors shadow-lg
        ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}
        ${full ? "w-full" : "shrink-0"}`}
    >
      <Eye size={small ? 14 : 16} />
      View Details
    </button>
  );
};

const PriorityBadge = ({ priority }) => {
  const colorClass = {
    high: "bg-red-400/10 text-red-400 ring-red-400/20",
    medium: "bg-amber-400/10 text-amber-400 ring-amber-400/20",
    low: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20"
  }[priority?.toLowerCase()] || "bg-slate-700/40 text-slate-400 ring-slate-600/20";

  const dotColor = {
    high: "bg-red-400",
    medium: "bg-amber-400",
    low: "bg-emerald-400"
  }[priority?.toLowerCase()] || "bg-slate-500";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${colorClass}`}>
      <Circle className={`w-1.5 h-1.5 fill-current ${dotColor}`} />
      {priority?.toUpperCase()}
    </span>
  );
};

const StatusItem = ({ label, value, color, icon }) => {
  const colorClass = {
    blue: "bg-blue-400/10 text-blue-400 ring-blue-400/20",
    emerald: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
    orange: "bg-orange-400/10 text-orange-400 ring-orange-400/20"
  }[color] || "bg-blue-400/10 text-blue-400 ring-blue-400/20";

  return (
    <div className="flex items-center justify-between p-3 bg-[#0d1117]/50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium text-slate-300">{label}</span>
      </div>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ring-1 ${colorClass}`}>
        {value}
      </span>
    </div>
  );
};

const EmptyState = ({ message, icon = <Inbox size={48} className="mx-auto opacity-20" /> }) => (
  <div className="text-center py-8 text-slate-500">
    <div className="mb-2">{icon}</div>
    <p className="font-medium text-slate-400">{message}</p>
  </div>
);

export default CenterDashboard;