import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const styles = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  .animate-slide-in { animation: slideInRight 0.3s ease-out forwards; }
`;

const CenterDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState("camps");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  useEffect(() => { loadSampleData(); }, []);

  const loadSampleData = () => {
    setDashboard({
      center: { center_name: "Central Relief Coordination Center" },
      stats: {
        totalCamps: 45, totalVolunteers: 128,
        pendingCamps: 8, pendingVolunteers: 12,
        pendingDisasters: 5, pendingRequests: 15,
      },
      pendingCamps: [
        { _id: "1", camp_name: "Sunrise Relief Camp",   place: "North District, Kerala", createdAt: new Date("2024-02-08") },
        { _id: "2", camp_name: "Hope Valley Camp",      place: "Ernakulam, Kerala",      createdAt: new Date("2024-02-09") },
        { _id: "3", camp_name: "Green Meadows Shelter", place: "Thrissur, Kerala",       createdAt: new Date("2024-02-10") },
        { _id: "4", camp_name: "Safe Haven Camp",       place: "Kottayam, Kerala",       createdAt: new Date("2024-02-11") },
      ],
      pendingVolunteers: [
        { _id: "v1", volunteer_name: "Rajesh Kumar",   volunteer_email: "rajesh.k@email.com",    createdAt: new Date("2024-02-09") },
        { _id: "v2", volunteer_name: "Priya Menon",    volunteer_email: "priya.menon@email.com", createdAt: new Date("2024-02-10") },
        { _id: "v3", volunteer_name: "Arun Nair",      volunteer_email: "arun.nair@email.com",   createdAt: new Date("2024-02-10") },
        { _id: "v4", volunteer_name: "Lakshmi Pillai", volunteer_email: "lakshmi.p@email.com",   createdAt: new Date("2024-02-11") },
      ],
      disasters: [
        { _id: "d1", camp_name: "Riverside Camp",        disaster_severity: "critical", disaster_type: "Flood",        disaster_status: "active",   createdAt: new Date("2024-02-11") },
        { _id: "d2", camp_name: "Mountain View Camp",    disaster_severity: "high",     disaster_type: "Landslide",    disaster_status: "active",   createdAt: new Date("2024-02-10") },
        { _id: "d3", camp_name: "Coastal Relief Center", disaster_severity: "medium",   disaster_type: "Storm Damage", disaster_status: "active",   createdAt: new Date("2024-02-09") },
        { _id: "d4", camp_name: "Valley Shelter",        disaster_severity: "low",      disaster_type: "Power Outage", disaster_status: "resolved", createdAt: new Date("2024-02-08") },
      ],
      requests: [
        { _id: "r1", camp_name: "Sunrise Relief Camp",   request_details: "Urgent need for medical supplies and clean drinking water for 200 people", items: [{ itemName: "Medical Kits", qty: 50 }, { itemName: "Water Bottles", qty: 300 }, { itemName: "Blankets", qty: 100 }],                               request_priority: "high",   request_status: "pending", createdAt: new Date("2024-02-11") },
        { _id: "r2", camp_name: "Green Meadows Shelter", request_details: "Food supplies needed for 150 displaced families",                          items: [{ itemName: "Rice", qty: 200 }, { itemName: "Cooking Oil", qty: 50 }, { itemName: "Vegetables", qty: 100 }, { itemName: "Dal", qty: 80 }], request_priority: "medium", request_status: "pending", createdAt: new Date("2024-02-10") },
        { _id: "r3", camp_name: "Hope Valley Camp",      request_details: "Clothing and hygiene products for children and elderly",                   items: [{ itemName: "Clothes", qty: 200 }, { itemName: "Soap", qty: 150 }],                                                                              request_priority: "medium", request_status: "pending", createdAt: new Date("2024-02-09") },
        { _id: "r4", camp_name: "Coastal Relief Center", request_details: "Tents and sleeping bags for additional shelter capacity",                  items: [{ itemName: "Tents", qty: 20 }, { itemName: "Sleeping Bags", qty: 50 }],                                                                        request_priority: "low",    request_status: "pending", createdAt: new Date("2024-02-08") },
      ],
      volunteers: [
        { _id: "vol1", volunteer_name: "Anitha Thomas", availability: "available", assigned_task: "Medical Support"    },
        { _id: "vol2", volunteer_name: "Suresh Babu",   availability: "available", assigned_task: null                 },
        { _id: "vol3", volunteer_name: "Maya Krishnan", availability: "busy",      assigned_task: "Food Distribution"  },
        { _id: "vol4", volunteer_name: "Deepak Menon",  availability: "available", assigned_task: "Logistics"          },
        { _id: "vol5", volunteer_name: "Kavya Nair",    availability: "available", assigned_task: null                 },
        { _id: "vol6", volunteer_name: "Ravi Kumar",    availability: "busy",      assigned_task: "Emergency Response" },
      ],
      tasks: { active: 12, completed: 45, ongoing: 8 },
    });
    setLoading(false);
  };

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/center/dashboard");
      setDashboard(res.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) navigate("/center/login");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await axios.post("http://localhost:5000/auth/logout"); } catch {}
    navigate("/center/login");
  };

  const toast = (msg, type = "info") => {
    setNotification({ show: true, type, message: msg });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 2500);
  };

  const getSeverityColor = (severity) => ({
    low:      "bg-green-100  text-green-800  border-green-200",
    medium:   "bg-yellow-100 text-yellow-800 border-yellow-200",
    high:     "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100    text-red-800    border-red-200",
  }[severity?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200");

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-slate-600 text-lg font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  const { center, stats, pendingCamps, pendingVolunteers, disasters, requests, volunteers, tasks } = dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <style>{styles}</style>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <span className="text-4xl">🏛️</span>
                {center?.center_name || "Relief Center"}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">Control &amp; Coordination Dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 border-2 border-slate-300 hover:border-red-300 text-slate-700 hover:text-red-600 rounded-lg font-medium transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* 1. Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          <OverviewCard title="Total Camps"         value={stats?.totalCamps        || 0} icon="🏕️" color="blue"   />
          <OverviewCard title="Total Volunteers"    value={stats?.totalVolunteers   || 0} icon="👥" color="green"  />
          <OverviewCard title="Camp Approvals"      value={stats?.pendingCamps      || 0} icon="⏳" color="yellow" badge="pending" />
          <OverviewCard title="Volunteer Approvals" value={stats?.pendingVolunteers || 0} icon="✋" color="orange" badge="pending" />
          <OverviewCard title="Disaster Reports"    value={stats?.pendingDisasters  || 0} icon="🚨" color="red"    badge="new"     />
          <OverviewCard title="Pending Requests"    value={stats?.pendingRequests   || 0} icon="📋" color="purple" badge="review"  />
        </div>

        {/* 2. Pending Approvals + Operational Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Approvals — 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <SectionHeader
              icon={<svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Pending Approvals"
              onViewAll={() => navigate("/center/requests")}
            />

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-lg w-fit">
              {["camps", "volunteers"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all ${
                    activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab === "camps" ? `Camps (${pendingCamps?.length || 0})` : `Volunteers (${pendingVolunteers?.length || 0})`}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {activeTab === "camps" ? (
                pendingCamps?.length > 0
                  ? pendingCamps.map(c => (
                      <ApprovalRow
                        key={c._id}
                        avatar="🏕️"
                        name={c.camp_name}
                        sub={c.place}
                        date={c.createdAt}
                        onView={() => toast(`Opening camp: ${c.camp_name}`)}
                      />
                    ))
                  : <EmptyState message="No pending camp approvals" />
              ) : (
                pendingVolunteers?.length > 0
                  ? pendingVolunteers.map(v => (
                      <ApprovalRow
                        key={v._id}
                        avatar="👤"
                        name={v.volunteer_name}
                        sub={v.volunteer_email}
                        date={v.createdAt}
                        onView={() => toast(`Opening volunteer: ${v.volunteer_name}`)}
                      />
                    ))
                  : <EmptyState message="No pending volunteer approvals" />
              )}
            </div>
          </div>

          {/* Operational Status — 1 col */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <SectionHeader
              icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              title="Operational Status"
            />
            <div className="space-y-3 mt-2">
              <StatusItem label="Active Tasks"      value={tasks?.active    || 0} color="blue"   icon="⚡" />
              <StatusItem label="Completed Tasks"   value={tasks?.completed || 0} color="green"  icon="✓" />
              <StatusItem label="Ongoing Responses" value={tasks?.ongoing   || 0} color="orange" icon="🔄" />
            </div>
          </div>
        </div>

        {/* 3. Disaster Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <SectionHeader
            icon={<svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            title="Disaster Reports"
            onViewAll={() => navigate("/center/disaster-reports")}
          />
          <div className="mt-4 space-y-3">
            {disasters?.length > 0
              ? disasters.map(d => (
                  <div key={d._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-red-200 transition-colors">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{d.camp_name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSeverityColor(d.disaster_severity)}`}>
                          {d.disaster_severity?.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${d.disaster_status === "active" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-700"}`}>
                          {d.disaster_status?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-700">{d.disaster_type}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <ViewDetailsBtn onClick={() => toast(`Viewing disaster at ${d.camp_name}…`)} />
                  </div>
                ))
              : <EmptyState message="No disaster reports" icon="🌤️" />
            }
          </div>
        </div>

        {/* 4. Requests Review */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <SectionHeader
            icon={<svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            title="Pending Requests"
            onViewAll={() => navigate("/center/requests")}
          />
          <div className="mt-4 space-y-3">
            {requests?.length > 0
              ? requests.map(r => (
                  <div key={r._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-purple-200 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">{r.camp_name}</span>
                          <PriorityBadge priority={r.request_priority} />
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">PENDING</span>
                        </div>
                        <p className="text-sm text-slate-700 line-clamp-2 mb-2">{r.request_details}</p>
                        {r.items?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {r.items.slice(0, 3).map((item, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs text-slate-700">
                                {item.itemName} <span className="font-semibold">×{item.qty}</span>
                              </span>
                            ))}
                            {r.items.length > 3 && (
                              <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-xs">+{r.items.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                        <ViewDetailsBtn onClick={() => toast(`Viewing request from ${r.camp_name}…`)} color="purple" />
                      </div>
                    </div>
                  </div>
                ))
              : <EmptyState message="No pending requests" icon="📬" />
            }
          </div>
        </div>

        {/* 5. Volunteer Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <SectionHeader
            icon={<svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            title="Volunteer Management"
            onViewAll={() => toast("Navigating to volunteer management…")}
          />

          {/* ── Pending volunteer approvals banner ── */}
          {pendingVolunteers?.length > 0 && (
            <div className="mt-4 mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-amber-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Pending Volunteer Approvals
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-xs rounded-full font-bold">
                    {pendingVolunteers.length}
                  </span>
                </h3>
                <button
                  onClick={() => toast("Navigating to all volunteer approvals…")}
                  className="text-amber-700 hover:text-amber-900 text-sm font-semibold flex items-center gap-1 transition-colors"
                >
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div className="space-y-2">
                {pendingVolunteers.slice(0, 3).map(v => (
                  <div key={v._id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-sm">
                        {v.volunteer_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{v.volunteer_name}</p>
                        <p className="text-xs text-slate-500">{v.volunteer_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <button
                        onClick={() => toast(`Reviewing application: ${v.volunteer_name}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-lg font-medium transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Review
                      </button>
                    </div>
                  </div>
                ))}
                {pendingVolunteers.length > 3 && (
                  <p className="text-center text-xs text-amber-700 font-semibold pt-1">
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
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-white rounded-xl shadow-2xl border-l-4 border-blue-500 p-4 min-w-[320px] max-w-sm flex items-start gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-slate-700 font-medium flex-1">{notification.message}</p>
            <button onClick={() => setNotification({ show: false, type: "", message: "" })} className="text-slate-400 hover:text-slate-600 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Sub-components ─────────────────────────────────────────────── */

const OverviewCard = ({ title, value, icon, color, badge }) => {
  const g = {
    blue: "from-blue-500 to-blue-600", green: "from-green-500 to-green-600",
    yellow: "from-yellow-400 to-yellow-500", orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600", purple: "from-purple-500 to-purple-600",
  }[color];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`text-2xl p-2 rounded-lg bg-gradient-to-br ${g}`}>{icon}</div>
        {badge && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">{badge}</span>}
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 font-medium mt-0.5">{title}</p>
    </div>
  );
};

const SectionHeader = ({ icon, title, onViewAll }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
      {icon}{title}
    </h2>
    {onViewAll && (
      <button onClick={onViewAll} className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 transition-colors">
        View All
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    )}
  </div>
);

const ApprovalRow = ({ avatar, name, sub, date, onView }) => (
  <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <span className="text-2xl">{avatar}</span>
      <div className="min-w-0">
        <p className="font-semibold text-slate-900 text-sm truncate">{name}</p>
        <p className="text-xs text-slate-500 truncate">{sub}</p>
        <p className="text-xs text-slate-400">
          {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </div>
    <ViewDetailsBtn onClick={onView} small />
  </div>
);

const ViewDetailsBtn = ({ onClick, color = "blue", small = false, full = false }) => {
  const c = { blue: "bg-blue-600 hover:bg-blue-700", purple: "bg-purple-600 hover:bg-purple-700" }[color] ?? "bg-blue-600 hover:bg-blue-700";
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 ${c} text-white rounded-lg font-medium transition-colors
        ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}
        ${full ? "w-full" : "shrink-0"}`}
    >
      <svg className={small ? "w-3.5 h-3.5" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      View Details
    </button>
  );
};

const PriorityBadge = ({ priority }) => {
  const s = { high: "text-red-700 bg-red-100", medium: "text-yellow-700 bg-yellow-100", low: "text-green-700 bg-green-100" }[priority?.toLowerCase()] ?? "text-gray-700 bg-gray-100";
  return <span className={`px-2 py-0.5 rounded text-xs font-bold ${s}`}>{priority?.toUpperCase()}</span>;
};

const StatusItem = ({ label, value, color, icon }) => {
  const b = { blue: "bg-blue-100 text-blue-800", green: "bg-green-100 text-green-800", orange: "bg-orange-100 text-orange-800" }[color];
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${b}`}>{value}</span>
    </div>
  );
};

const EmptyState = ({ message, icon = "📭" }) => (
  <div className="text-center py-8 text-slate-500">
    <div className="text-5xl mb-2">{icon}</div>
    <p className="font-medium">{message}</p>
  </div>
);

export default CenterDashboard;