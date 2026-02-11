import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import axios from "axios";

axios.defaults.withCredentials = true;

const RequestView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/camp/request/${id}`);
        setRequest(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Request not found");
        } else {
          setError("Failed to load request");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  // Status timeline configuration
  const getStatusTimeline = (currentStatus) => {
    const statuses = [
      { key: "pending", label: "Pending", icon: <HourglassTopTwoToneIcon sx={{ width: 24, height: 24, color: "#5d2626" }} /> },
      { key: "in_review", label: "In Review", icon: <VisibilityIcon sx={{ width: 24, height: 24, color: "#303992" }} /> },
      { key: "approved", label: "Approved", icon: <CheckCircleOutlineTwoToneIcon sx={{ width: 24, height: 24, color: "#169925" }} /> },
      { key: "fulfilled", label: "Fulfilled", icon: <LocalShippingIcon sx={{ width: 24, height: 24, color: "#169925" }} /> },
    ];

    const statusIndex = statuses.findIndex(
      (s) => s.key === currentStatus?.toLowerCase()
    );

    return statuses.map((status, index) => ({
      ...status,
      completed: index <= statusIndex,
      active: index === statusIndex,
    }));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      low: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[priority?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      in_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      fulfilled: "bg-emerald-100 text-emerald-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
          <p className="text-slate-600 text-lg">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const timeline = getStatusTimeline(request.request_status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Requests
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Request ID:</span>
              <span className="font-mono text-sm font-semibold text-slate-800">
                #{id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Request Details
              </h1>
              <p className="text-slate-500 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
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
                {new Date(request.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${getStatusColor(
                  request.request_status
                )}`}
              >
                {request.request_status.toUpperCase()}
              </span>
              <span
                className={`px-4 py-2 rounded-lg font-semibold text-sm border-2 ${getPriorityColor(
                  request.request_priority
                )}`}
              >
                {request.request_priority.toUpperCase()} PRIORITY
              </span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
              Request Progress
            </h3>
            <div className="relative">
              <div className="flex justify-between items-center">
                {timeline.map((status, index) => (
                  <div key={status.key} className="flex flex-col items-center flex-1">
                    {/* Timeline Line */}
                    {index !== 0 && (
                      <div
                        className={`absolute h-1 top-6 transition-all duration-500 ${
                          status.completed ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                        style={{
                          left: `${(index - 1) * (100 / (timeline.length - 1))}%`,
                          width: `${100 / (timeline.length - 1)}%`,
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}

                    {/* Status Node */}
                    <div className="relative z-10 mb-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${
                          status.completed
                            ? "bg-emerald-500 text-white shadow-lg scale-110"
                            : status.active
                            ? "bg-blue-500 text-white shadow-lg scale-110 animate-pulse"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        {status.icon}
                      </div>
                    </div>

                    {/* Status Label */}
                    <div className="text-center">
                      <p
                        className={`text-xs sm:text-sm font-semibold ${
                          status.completed || status.active
                            ? "text-slate-800"
                            : "text-slate-400"
                        }`}
                      >
                        {status.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-slate-900">
                  Request Description
                </h2>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {request.request_details}
                </p>
              </div>
            </div>

            {/* Response Section */}
            {request.request_reply && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  <h2 className="text-xl font-bold text-blue-900">
                    Response from Center
                  </h2>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {request.request_reply}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Requested Items */}
            {request.items && request.items.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h2 className="text-lg font-bold text-slate-900">
                    Requested Items
                  </h2>
                </div>
                <div className="space-y-2">
                  {request.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative overflow-hidden p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm group-hover:bg-emerald-200 transition-colors">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 text-base capitalize">
                              {item.requestitem_name}
                            </span>
                            <p className="text-xs text-slate-500">Item</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-lg min-w-[80px] text-center group-hover:bg-emerald-700 transition-colors">
                            {item.requestitem_qty}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Quantity</p>
                        </div>
                      </div>
                      
                      {/* Decorative element */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-full -mr-10 -mt-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    </div>
                  ))}
                </div>
                
                {/* Total Summary */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">Total Items:</span>
                    <span className="font-bold text-emerald-600 text-lg">
                      {request.items.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="font-semibold text-slate-700">Total Quantity:</span>
                    <span className="font-bold text-emerald-600 text-lg">
                      {request.items.reduce((sum, item) => sum + (item.requestitem_qty || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info Card */}
            {/* <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Request Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                  <span className="text-slate-300">Status:</span>
                  <span className="font-semibold">
                    {request.request_status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                  <span className="text-slate-300">Priority:</span>
                  <span className="font-semibold">
                    {request.request_priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                  <span className="text-slate-300">Item Types:</span>
                  <span className="font-semibold">
                    {request.items?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Total Quantity:</span>
                  <span className="font-semibold">
                    {request.items?.reduce((sum, item) => sum + (item.requestitem_qty || 0), 0) || 0}
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestView;