import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const CenterDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState("camps"); // camps or volunteers
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/center/dashboard");
      setDashboard(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate("/center/login");
      }
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout");
    } catch {}
    navigate("/center/login");
  };

  const handleApproval = async (type, id, action) => {
    try {
      const endpoint = type === "camp" 
        ? `http://localhost:5000/center/approve-camp/${id}`
        : `http://localhost:5000/center/approve-volunteer/${id}`;
      
      const res = await axios.put(endpoint, { action }); // action: "approve" or "reject"

      setNotification({
        show: true,
        type: "success",
        message: res.data.message || `${type} ${action}d successfully`
      });

      // Refresh dashboard
      fetchDashboard();
      setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
    } catch (err) {
      setNotification({
        show: true,
        type: "error",
        message: err.response?.data?.message || `Failed to ${action} ${type}`
      });
      setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const res = await axios.put(`http://localhost:5000/center/request/${requestId}`, { 
        action, // "approve" or "reject"
        request_reply: "" // Optional reply message
      });

      setNotification({
        show: true,
        type: "success",
        message: res.data.message || `Request ${action}d successfully`
      });

      fetchDashboard();
      setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
    } catch (err) {
      setNotification({
        show: true,
        type: "error",
        message: err.response?.data?.message || `Failed to ${action} request`
      });
      setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
    }
  };

  const handleDisasterAction = async (disasterId) => {
    navigate(`/center/disaster/${disasterId}`);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[severity?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      resolved: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { center, stats, pendingCamps, pendingVolunteers, disasters, requests, volunteers, tasks } = dashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="text-4xl">🏛️</div>
                {center?.center_name || "Relief Center"}
              </h1>
              <p className="text-slate-600 mt-1">Control & Coordination Dashboard</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <OverviewCard
            title="Total Camps"
            value={stats?.totalCamps || 0}
            icon="🏕️"
            color="blue"
          />
          <OverviewCard
            title="Total Volunteers"
            value={stats?.totalVolunteers || 0}
            icon="👥"
            color="green"
          />
          <OverviewCard
            title="Camp Approvals"
            value={stats?.pendingCamps || 0}
            icon="⏳"
            color="yellow"
            badge="pending"
          />
          <OverviewCard
            title="Volunteer Approvals"
            value={stats?.pendingVolunteers || 0}
            icon="✋"
            color="orange"
            badge="pending"
          />
          <OverviewCard
            title="Disaster Reports"
            value={stats?.pendingDisasters || 0}
            icon="🚨"
            color="red"
            badge="new"
          />
          <OverviewCard
            title="Pending Requests"
            value={stats?.pendingRequests || 0}
            icon="📋"
            color="purple"
            badge="review"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Pending Approvals Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pending Approvals
              </h2>

              {/* Tabs */}
              <div className="flex gap-2 mb-4 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab("camps")}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === "camps"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Camps ({pendingCamps?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("volunteers")}
                  className={`px-4 py-2 font-semibold transition-colors ${
                    activeTab === "volunteers"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Volunteers ({pendingVolunteers?.length || 0})
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeTab === "camps" ? (
                  pendingCamps && pendingCamps.length > 0 ? (
                    pendingCamps.map((camp) => (
                      <ApprovalCard
                        key={camp._id}
                        name={camp.camp_name}
                        location={camp.place}
                        date={camp.createdAt}
                        onApprove={() => handleApproval("camp", camp._id, "approve")}
                        onReject={() => handleApproval("camp", camp._id, "reject")}
                      />
                    ))
                  ) : (
                    <EmptyState message="No pending camp approvals" />
                  )
                ) : (
                  pendingVolunteers && pendingVolunteers.length > 0 ? (
                    pendingVolunteers.map((volunteer) => (
                      <ApprovalCard
                        key={volunteer._id}
                        name={volunteer.volunteer_name}
                        location={volunteer.volunteer_email}
                        date={volunteer.createdAt}
                        onApprove={() => handleApproval("volunteer", volunteer._id, "approve")}
                        onReject={() => handleApproval("volunteer", volunteer._id, "reject")}
                      />
                    ))
                  ) : (
                    <EmptyState message="No pending volunteer approvals" />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Operational Status - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Operational Status
              </h2>
              <div className="space-y-3">
                <StatusItem
                  label="Active Tasks"
                  value={tasks?.active || 0}
                  color="blue"
                  icon="⚡"
                />
                <StatusItem
                  label="Completed Tasks"
                  value={tasks?.completed || 0}
                  color="green"
                  icon="✓"
                />
                <StatusItem
                  label="Ongoing Responses"
                  value={tasks?.ongoing || 0}
                  color="orange"
                  icon="🔄"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Disaster Reports Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Disaster Reports
          </h2>
          <div className="space-y-3">
            {disasters && disasters.length > 0 ? (
              disasters.map((disaster) => (
                <DisasterCard
                  key={disaster._id}
                  campName={disaster.camp_name}
                  severity={disaster.disaster_severity}
                  type={disaster.disaster_type}
                  status={disaster.disaster_status}
                  date={disaster.createdAt}
                  onAction={() => handleDisasterAction(disaster._id)}
                />
              ))
            ) : (
              <EmptyState message="No disaster reports" icon="🌤️" />
            )}
          </div>
        </div>

        {/* Requests Review Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Pending Requests
          </h2>
          <div className="space-y-3">
            {requests && requests.length > 0 ? (
              requests.map((request) => (
                <RequestCard
                  key={request._id}
                  campName={request.camp_name}
                  details={request.request_details}
                  items={request.items}
                  priority={request.request_priority}
                  status={request.request_status}
                  date={request.createdAt}
                  onApprove={() => handleRequestAction(request._id, "approve")}
                  onReject={() => handleRequestAction(request._id, "reject")}
                />
              ))
            ) : (
              <EmptyState message="No pending requests" icon="📬" />
            )}
          </div>
        </div>

        {/* Volunteer Assignment Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Volunteer Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {volunteers && volunteers.length > 0 ? (
              volunteers.map((volunteer) => (
                <VolunteerCard
                  key={volunteer._id}
                  name={volunteer.volunteer_name}
                  availability={volunteer.availability}
                  assignedTask={volunteer.assigned_task}
                  onAssign={() => navigate(`/center/assign-volunteer/${volunteer._id}`)}
                />
              ))
            ) : (
              <div className="col-span-3">
                <EmptyState message="No volunteers available" icon="👥" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`bg-white rounded-xl shadow-2xl border-l-4 ${
            notification.type === "success" ? "border-green-500" : "border-red-500"
          } p-4 min-w-[350px] max-w-md animate-slide-in`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notification.type === "success" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {notification.type === "success" ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {notification.type === "success" ? "Success!" : "Error"}
                </h3>
                <p className="text-sm text-slate-600">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification({ show: false, type: "", message: "" })}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
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
  );
};

/* ---------- COMPONENT DEFINITIONS ---------- */

const OverviewCard = ({ title, value, icon, color, badge }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className={`text-3xl p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-10`}>
          {icon}
        </div>
        {badge && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 font-medium">{title}</p>
    </div>
  );
};

const ApprovalCard = ({ name, location, date, onApprove, onReject }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
    <div className="flex-1">
      <h4 className="font-semibold text-slate-900">{name}</h4>
      <p className="text-sm text-slate-600">{location}</p>
      <p className="text-xs text-slate-500 mt-1">
        {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
    <div className="flex gap-2">
      <button
        onClick={onApprove}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Approve
      </button>
      <button
        onClick={onReject}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Reject
      </button>
    </div>
  </div>
);

const DisasterCard = ({ campName, severity, type, status, date, onAction }) => {
  const getSeverityColor = (sev) => {
    const colors = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[sev?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-red-300 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold text-slate-900">{campName}</h4>
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getSeverityColor(severity)}`}>
            {severity?.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-slate-700 font-medium">{type}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-slate-500">
            {new Date(date).toLocaleDateString()}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}>
            {status?.toUpperCase()}
          </span>
        </div>
      </div>
      <button
        onClick={onAction}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        View Details
      </button>
    </div>
  );
};

const RequestCard = ({ campName, details, items, priority, status, date, onApprove, onReject }) => {
  const getPriorityColor = (pri) => {
    const colors = {
      low: "text-green-700 bg-green-100",
      medium: "text-yellow-700 bg-yellow-100",
      high: "text-red-700 bg-red-100",
    };
    return colors[pri?.toLowerCase()] || "text-gray-700 bg-gray-100";
  };

  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-slate-900">{campName}</h4>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(priority)}`}>
              {priority?.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-slate-700 line-clamp-2">{details}</p>
        </div>
      </div>
      
      {items && items.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-600 mb-1">Requested Items:</p>
          <div className="flex flex-wrap gap-1">
            {items.slice(0, 3).map((item, idx) => (
              <span key={idx} className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">
                {item.itemName} ({item.qty})
              </span>
            ))}
            {items.length > 3 && (
              <span className="px-2 py-1 bg-slate-200 rounded text-xs">
                +{items.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {new Date(date).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const VolunteerCard = ({ name, availability, assignedTask, onAssign }) => (
  <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
        {name?.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-900">{name}</h4>
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
          availability === "available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}>
          {availability?.toUpperCase()}
        </span>
      </div>
    </div>
    <p className="text-sm text-slate-700 mb-3">
      <span className="font-semibold">Task:</span> {assignedTask || "Not assigned"}
    </p>
    <button
      onClick={onAssign}
      className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
    >
      Assign Task
    </button>
  </div>
);

const StatusItem = ({ label, value, color, icon }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    orange: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${colorClasses[color]}`}>
        {value}
      </span>
    </div>
  );
};

const EmptyState = ({ message, icon = "📭" }) => (
  <div className="text-center py-8">
    <div className="text-5xl mb-2">{icon}</div>
    <p className="text-slate-600">{message}</p>
  </div>
);

export default CenterDashboard;