import React, { useState, useEffect } from "react";
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
  const [replyAction, setReplyAction] = useState(""); // "accept" or "reject"
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    const sampleRequests = [
      {
        _id: "r1",
        camp_name: "Sunrise Relief Camp",
        camp_location: "North District, Kerala",
        request_details: "Urgent need for medical supplies and clean drinking water for 200 people. Several cases of dehydration reported.",
        items: [
          { itemName: "Medical Kits", qty: 50, unit: "boxes" },
          { itemName: "Water Bottles (1L)", qty: 300, unit: "bottles" },
          { itemName: "Blankets", qty: 100, unit: "pieces" },
          { itemName: "ORS Packets", qty: 500, unit: "packets" }
        ],
        request_priority: "high",
        request_status: "pending",
        createdAt: new Date("2024-02-11T08:30:00"),
        estimated_people_affected: 200
      },
      {
        _id: "r2",
        camp_name: "Green Meadows Shelter",
        camp_location: "Thrissur, Kerala",
        request_details: "Food supplies needed for 150 displaced families. Current stock will last only 2 more days.",
        items: [
          { itemName: "Rice", qty: 200, unit: "kg" },
          { itemName: "Cooking Oil", qty: 50, unit: "liters" },
          { itemName: "Vegetables", qty: 100, unit: "kg" },
          { itemName: "Dal", qty: 80, unit: "kg" },
          { itemName: "Salt", qty: 20, unit: "kg" }
        ],
        request_priority: "high",
        request_status: "pending",
        createdAt: new Date("2024-02-10T14:20:00"),
        estimated_people_affected: 150
      },
      {
        _id: "r3",
        camp_name: "Hope Valley Camp",
        camp_location: "Ernakulam, Kerala",
        request_details: "Clothing and hygiene products for children and elderly residents",
        items: [
          { itemName: "Children's Clothes", qty: 100, unit: "sets" },
          { itemName: "Adult Clothes", qty: 100, unit: "sets" },
          { itemName: "Soap", qty: 150, unit: "bars" },
          { itemName: "Toothpaste", qty: 100, unit: "tubes" },
          { itemName: "Sanitary Napkins", qty: 200, unit: "packs" }
        ],
        request_priority: "medium",
        request_status: "pending",
        createdAt: new Date("2024-02-09T10:15:00"),
        estimated_people_affected: 120
      },
      {
        _id: "r4",
        camp_name: "Coastal Relief Center",
        camp_location: "Alappuzha, Kerala",
        request_details: "Tents and sleeping bags for additional shelter capacity due to incoming storm",
        items: [
          { itemName: "Tents (6-person)", qty: 20, unit: "tents" },
          { itemName: "Sleeping Bags", qty: 50, unit: "bags" },
          { itemName: "Tarpaulin Sheets", qty: 30, unit: "sheets" }
        ],
        request_priority: "medium",
        request_status: "pending",
        createdAt: new Date("2024-02-08T16:45:00"),
        contact_person: "Lakshmi Nair",
        estimated_people_affected: 80
      },
      {
        _id: "r5",
        camp_name: "Mountain View Shelter",
        camp_location: "Idukki, Kerala",
        request_details: "Emergency generator and fuel supply needed. Power outage for 3 days affecting medical equipment.",
        items: [
          { itemName: "Diesel Generator (10KVA)", qty: 2, unit: "units" },
          { itemName: "Diesel Fuel", qty: 200, unit: "liters" },
          { itemName: "Extension Cords", qty: 10, unit: "pieces" }
        ],
        request_priority: "critical",
        request_status: "pending",
        createdAt: new Date("2024-02-11T12:00:00"),
        estimated_people_affected: 180
      },
      {
        _id: "r6",
        camp_name: "Valley Haven Camp",
        camp_location: "Kottayam, Kerala",
        request_details: "Baby care supplies and infant formula urgently required",
        items: [
          { itemName: "Infant Formula", qty: 50, unit: "cans" },
          { itemName: "Diapers (various sizes)", qty: 500, unit: "pieces" },
          { itemName: "Baby Wipes", qty: 100, unit: "packs" },
          { itemName: "Baby Bottles", qty: 30, unit: "pieces" }
        ],
        request_priority: "high",
        request_status: "pending",
        createdAt: new Date("2024-02-10T09:30:00"),
        estimated_people_affected: 90
      },
      {
        _id: "r7",
        camp_name: "Riverside Emergency Camp",
        camp_location: "Kollam, Kerala",
        request_details: "Mosquito nets and anti-malarial supplies due to stagnant water issues",
        items: [
          { itemName: "Mosquito Nets", qty: 120, unit: "nets" },
          { itemName: "Mosquito Repellent", qty: 80, unit: "bottles" },
          { itemName: "Insecticide Spray", qty: 40, unit: "cans" }
        ],
        request_priority: "medium",
        request_status: "pending",
        createdAt: new Date("2024-02-09T15:20:00"),
        estimated_people_affected: 110
      },
      {
        _id: "r8",
        camp_name: "Sunrise Relief Camp",
        camp_location: "North District, Kerala",
        request_details: "Additional kitchen equipment and utensils for community cooking",
        items: [
          { itemName: "Large Cooking Pots", qty: 10, unit: "pots" },
          { itemName: "Plates & Bowls", qty: 300, unit: "sets" },
          { itemName: "Gas Cylinders", qty: 5, unit: "cylinders" },
          { itemName: "Cooking Stoves", qty: 3, unit: "stoves" }
        ],
        request_priority: "low",
        request_status: "pending",
        createdAt: new Date("2024-02-08T11:00:00"),
        estimated_people_affected: 200
      }
    ];

    const sampleVolunteers = [
      {
        _id: "vol1",
        volunteer_name: "Anitha Thomas",
        volunteer_email: "anitha.t@email.com",
        availability: "available",
        assigned_task: null
      },
      {
        _id: "vol2",
        volunteer_name: "Suresh Babu",
        volunteer_email: "suresh.b@email.com",
        availability: "available",
        assigned_task: null
      },
      {
        _id: "vol3",
        volunteer_name: "Maya Krishnan",
        volunteer_email: "maya.k@email.com",
        availability: "busy",
        assigned_task: "Food Distribution - Green Meadows"
      },
      {
        _id: "vol4",
        volunteer_name: "Deepak Menon",
        volunteer_email: "deepak.m@email.com",
        availability: "available",
        assigned_task: null
      },
      {
        _id: "vol5",
        volunteer_name: "Kavya Nair",
        volunteer_email: "kavya.n@email.com",
        availability: "available",
        assigned_task: null
      },
      {
        _id: "vol6",
        volunteer_name: "Ravi Kumar",
        volunteer_email: "ravi.k@email.com",
        availability: "busy",
        assigned_task: "Emergency Response - Riverside"
      },
      {
        _id: "vol7",
        volunteer_name: "Priya Menon",
        volunteer_email: "priya.menon@email.com",
        availability: "available",
        assigned_task: null
      },
      {
        _id: "vol8",
        volunteer_name: "Arun Nair",
        volunteer_email: "arun.nair@email.com",
        availability: "available",
        assigned_task: null
      }
    ];

    setRequests(sampleRequests);
    setVolunteers(sampleVolunteers);
    setLoading(false);
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

  const handleSubmitReply = () => {
    if (!replyMessage.trim()) {
      showNotification("error", "Please enter a reply message");
      return;
    }

    const actionText = replyAction === "accept" ? "accepted" : "rejected";
    showNotification("success", `Request ${actionText} successfully`);
    
    setRequests(prev => prev.map(req => 
      req._id === selectedRequest._id 
        ? { ...req, request_status: actionText, admin_reply: replyMessage } 
        : req
    ));

    setReplyModalOpen(false);
    setSelectedRequest(null);
    setReplyMessage("");
    setReplyAction("");
  };

  const openAssignModal = (request) => {
    setSelectedRequest(request);
    setSelectedVolunteers([]);
    setAssignModalOpen(true);
  };

  const handleAssignVolunteers = () => {
    if (selectedVolunteers.length === 0) {
      showNotification("error", "Please select at least one volunteer");
      return;
    }

    const volunteerNames = selectedVolunteers
      .map(id => volunteers.find(v => v._id === id)?.volunteer_name)
      .join(", ");

    showNotification("success", `Assigned ${selectedVolunteers.length} volunteer(s) to this request`);
    
    // Update request status
    setRequests(prev => prev.map(req => 
      req._id === selectedRequest._id 
        ? { ...req, request_status: "assigned", assigned_volunteers: selectedVolunteers } 
        : req
    ));

    // Update volunteer status
    setVolunteers(prev => prev.map(vol => 
      selectedVolunteers.includes(vol._id)
        ? { ...vol, availability: "busy", assigned_task: `${selectedRequest.camp_name} Request` }
        : vol
    ));

    setAssignModalOpen(false);
    setSelectedRequest(null);
    setSelectedVolunteers([]);
  };

  const toggleVolunteerSelection = (volunteerId) => {
    setSelectedVolunteers(prev => {
      if (prev.includes(volunteerId)) {
        return prev.filter(id => id !== volunteerId);
      } else {
        return [...prev, volunteerId];
      }
    });
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: "bg-red-100 text-red-800 border-red-300",
      high: "bg-orange-100 text-orange-800 border-orange-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      low: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[priority?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      assigned: "bg-blue-100 text-blue-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      critical: "🚨",
      high: "⚠️",
      medium: "📌",
      low: "ℹ️"
    };
    return icons[priority?.toLowerCase()] || "📋";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="text-purple-600 hover:text-purple-700 font-medium mb-2 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="text-4xl">📋</div>
              Requests Management
              </h1>
              <p className="text-slate-600 mt-1">Review, approve, and assign relief requests</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-2xl font-bold text-purple-600">{filteredRequests.length}</div>
              <div className="text-sm text-slate-600">Active Requests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search Requests
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by camp name or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="assigned">Assigned</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold">Showing {filteredRequests.length} of {requests.length} requests</span>
            {(filterPriority !== "all" || filterStatus !== "pending" || searchTerm) && (
              <button
                onClick={() => {
                  setFilterPriority("all");
                  setFilterStatus("pending");
                  setSearchTerm("");
                }}
                className="text-purple-600 hover:text-purple-700 font-medium ml-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Request Header */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-slate-200 p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="text-3xl">{getPriorityIcon(request.request_priority)}</div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{request.camp_name}</h3>
                          <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {request.camp_location}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getPriorityColor(request.request_priority)}`}>
                          {request.request_priority?.toUpperCase()} PRIORITY
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(request.request_status)}`}>
                          {request.request_status?.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                          👥 {request.estimated_people_affected} people affected
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-slate-500">
                        {new Date(request.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="p-5">
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Request Details
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{request.request_details}</p>
                  </div>

                  {/* Items List */}
                  <div className="mb-5">
                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Requested Items ({request.items.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {request.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-slate-900">{item.itemName}</div>
                            <div className="text-xs text-slate-600 mt-1">
                              <span className="font-bold text-purple-600">{item.qty}</span> {item.unit}
                            </div>
                          </div>
                          <div className="text-2xl">📦</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin Reply Section */}
                  {request.admin_reply && (request.request_status === "accepted" || request.request_status === "rejected") && (
                    <div className={`mb-5 p-4 rounded-lg border-2 ${
                      request.request_status === "accepted" 
                        ? "bg-green-50 border-green-200" 
                        : "bg-red-50 border-red-200"
                    }`}>
                      <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${
                        request.request_status === "accepted" ? "text-green-800" : "text-red-800"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {request.request_status === "accepted" ? "Admin Response" : "Rejection Reason"}
                      </h4>
                      <p className={`text-sm leading-relaxed ${
                        request.request_status === "accepted" ? "text-green-900" : "text-red-900"
                      }`}>
                        {request.admin_reply}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200">
                    {request.request_status === "pending" && (
                      <>
                        <button
                          onClick={() => openReplyModal(request, "accept")}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Accept Request
                        </button>
                        <button
                          onClick={() => openAssignModal(request)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Assign Volunteers
                        </button>
                        <button
                          onClick={() => openReplyModal(request, "reject")}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Reject Request
                        </button>
                      </>
                    )}
                    {request.request_status === "accepted" && (
                      <button
                        onClick={() => openAssignModal(request)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Assign Volunteers
                      </button>
                    )}
                    {request.request_status === "assigned" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-blue-800">Volunteers Assigned</span>
                      </div>
                    )}
                    {request.request_status === "rejected" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-red-800">Request Rejected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Requests Found</h3>
              <p className="text-slate-600">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Volunteers Modal */}
      {assignModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Assign Volunteers</h2>
                  <p className="text-blue-100">{selectedRequest.camp_name}</p>
                </div>
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Request Summary */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">Request Summary</h3>
                <p className="text-sm text-slate-700 mb-3">{selectedRequest.request_details}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.items.slice(0, 4).map((item, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">
                      {item.itemName} ({item.qty})
                    </span>
                  ))}
                  {selectedRequest.items.length > 4 && (
                    <span className="px-2 py-1 bg-slate-200 rounded text-xs">
                      +{selectedRequest.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Available Volunteers */}
              <div className="mb-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Select Volunteers ({selectedVolunteers.length} selected)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {volunteers.map((volunteer) => {
                    const isSelected = selectedVolunteers.includes(volunteer._id);
                    const isAvailable = volunteer.availability === "available";
                    
                    return (
                      <button
                        key={volunteer._id}
                        onClick={() => isAvailable && toggleVolunteerSelection(volunteer._id)}
                        disabled={!isAvailable}
                        className={`text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : isAvailable
                            ? "border-slate-200 hover:border-blue-300 bg-white"
                            : "border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                            isAvailable ? "bg-blue-600" : "bg-gray-400"
                          }`}>
                            {volunteer.volunteer_name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-slate-900">{volunteer.volunteer_name}</h4>
                              {isSelected && (
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mb-2">{volunteer.volunteer_email}</p>
                            {!isAvailable && volunteer.assigned_task && (
                              <p className="text-xs text-red-600 mt-2 font-medium">
                                Currently: {volunteer.assigned_task}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAssignVolunteers}
                  disabled={selectedVolunteers.length === 0}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${
                    selectedVolunteers.length > 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Assign {selectedVolunteers.length} Volunteer{selectedVolunteers.length !== 1 ? "s" : ""}
                </button>
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal (Accept/Reject) */}
      {replyModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className={`sticky top-0 bg-gradient-to-r ${
              replyAction === "accept" 
                ? "from-green-600 to-emerald-600" 
                : "from-red-600 to-rose-600"
            } text-white p-6 rounded-t-2xl`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {replyAction === "accept" ? "Accept Request" : "Reject Request"}
                  </h2>
                  <p className={replyAction === "accept" ? "text-green-100" : "text-red-100"}>
                    {selectedRequest.camp_name}
                  </p>
                </div>
                <button
                  onClick={() => setReplyModalOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Request Summary */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">Request Summary</h3>
                <p className="text-sm text-slate-700 mb-3">{selectedRequest.request_details}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.items.slice(0, 4).map((item, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">
                      {item.itemName} ({item.qty})
                    </span>
                  ))}
                  {selectedRequest.items.length > 4 && (
                    <span className="px-2 py-1 bg-slate-200 rounded text-xs">
                      +{selectedRequest.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Reply Message */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {replyAction === "accept" 
                    ? "Response Message (Required)" 
                    : "Reason for Rejection (Required)"}
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={
                    replyAction === "accept"
                      ? "Enter your response to the camp (e.g., estimated delivery time, special instructions...)"
                      : "Please provide a reason for rejecting this request..."
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                  This message will be sent to the camp administrator.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmitReply}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${
                    replyAction === "accept"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {replyAction === "accept" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  {replyAction === "accept" ? "Accept & Send Response" : "Reject & Send Reason"}
                </button>
                <button
                  onClick={() => setReplyModalOpen(false)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`bg-white rounded-xl shadow-2xl border-l-4 ${
            notification.type === "success" ? "border-green-500" : "border-red-500"
          } p-4 min-w-[350px] max-w-md`}>
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

export default Requests;