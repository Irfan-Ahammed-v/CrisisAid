import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DescriptionIcon from "@mui/icons-material/Description";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CircleIcon from '@mui/icons-material/Circle';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";

axios.defaults.withCredentials = true;

const RequestList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/camp/requests");
        setRequests(res.data);
      } catch (err) {
        setError("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
      assigned: "bg-blue-100 text-blue-800 border-blue-200",
      fulfilled: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { color: "text-red-700", icon: <CircleIcon sx={{ width: 12, height: 12, color: "red" }} />, bg: "bg-red-50" },
      medium: { color: "text-yellow-700", icon: <CircleIcon sx={{ width: 12, height: 12, color: "yellow" }} />, bg: "bg-yellow-50" },
      low: { color: "text-green-700", icon: <CircleIcon sx={{ width: 12, height: 12, color: "green" }} />, bg: "bg-green-50" },
    };
    return badges[priority?.toLowerCase()] || badges.medium;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <HourglassTopTwoToneIcon sx={{ width: 24, height: 24, color: "#5d2626" }} />,
      accepted: <CheckCircleOutlineTwoToneIcon sx={{ width: 24, height: 24, color: "#16a34a" }} />,
      assigned: <VisibilityIcon sx={{ width: 24, height: 24, color: "#303992" }} />,
      fulfilled: <LocalShippingIcon sx={{ width: 24, height: 24, color: "#0ea5e9" }} />,
      rejected: <ThumbDownIcon sx={{ width: 24, height: 24, color: "#dc2626" }} />,
    };
    return icons[status?.toLowerCase()] || <DescriptionIcon sx={{ width: 24, height: 24, color: "#6b7280" }} /> ;
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const statusMatch = filterStatus === "all" || req.request_status.toLowerCase() === filterStatus;
    const priorityMatch = filterPriority === "all" || req.request_priority.toLowerCase() === filterPriority;
    return statusMatch && priorityMatch;
  });

  // Get statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.request_status.toLowerCase() === "pending").length,
    accepted: requests.filter((r) => r.request_status.toLowerCase() === "accepted" || r.request_status.toLowerCase() === "assigned").length,
    fulfilled: requests.filter((r) => r.request_status.toLowerCase() === "fulfilled").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Requests</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Relief Requests
              </h1>
              <p className="text-slate-600 text-lg">
                Track and manage all requests submitted by your camp
              </p>
            </div>
            <button
              onClick={() => navigate("/camp/new-request")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Request
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="text-4xl"><DescriptionIcon
                sx={{ width: 38, height: 38, color: "#303992" }}
              /></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
                </div>
                <div className="text-4xl"><HourglassTopTwoToneIcon
                sx={{ width: 38, height: 38, color: "#5d2626" }}
              /></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Accepted</p>
                  <p className="text-3xl font-bold text-green-900">{stats.accepted}</p>
                </div>
                <div className="text-4xl"><CheckCircleOutlineTwoToneIcon
                sx={{ width: 38, height: 38, color: "#169925" }}
              /></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Fulfilled</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.fulfilled}</p>
                </div>
                <div className="text-4xl"><LocalShippingIcon
                sx={{ width: 38, height: 38, color: "#169925" }}
              /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="assigned">Assigned</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filter by Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {(filterStatus !== "all" || filterPriority !== "all") && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterPriority("all");
                  }}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Request List */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((req) => {
              const priorityBadge = getPriorityBadge(req.request_priority);
              return (
                <div
                  key={req._id}
                  onClick={() => navigate(`/camp/request-view/${req._id}`)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-200 hover:border-blue-300 transition-all duration-300 cursor-pointer group overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-2xl mt-1">{getStatusIcon(req.request_status)}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {req.request_details}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                              Request ID: <span className="font-mono font-semibold">#{req._id.slice(-8)}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-4 py-2 text-sm font-semibold rounded-lg border ${getStatusColor(
                            req.request_status
                          )}`}
                        >
                          {req.request_status.toUpperCase()}
                        </span>
                        <span
                          className={`px-4 py-2 text-sm font-semibold rounded-lg border ${priorityBadge.bg} ${priorityBadge.color} border-${req.request_priority}-200 flex items-center gap-2`}
                        >
                          {priorityBadge.icon} {req.request_priority.toUpperCase()}
                          {req.isAiGenerated && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-600 border border-amber-200 font-bold uppercase">
                              AI
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {new Date(req.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {new Date(req.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="ml-auto group-hover:translate-x-1 transition-transform">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {filterStatus !== "all" || filterPriority !== "all"
                  ? "No matching requests"
                  : "No requests yet"}
              </h3>
              <p className="text-slate-600 mb-6">
                {filterStatus !== "all" || filterPriority !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "Get started by submitting your first relief request"}
              </p>
              {(filterStatus !== "all" || filterPriority !== "all") ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterStatus("all");
                    setFilterPriority("all");
                  }}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/camp/new-request");
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Submit First Request
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;