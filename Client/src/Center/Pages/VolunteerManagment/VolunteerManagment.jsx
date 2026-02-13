import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const VolunteerManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
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
    const sampleVolunteers = [
      // Pending
      {
        _id: "v1",
        volunteer_name: "Rajesh Kumar",
        volunteer_email: "rajesh.kumar@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-12T10:30:00"),
        district_id: { name: "Ernakulam" },
        center_id: null
      },
      {
        _id: "v2",
        volunteer_name: "Priya Menon",
        volunteer_email: "priya.menon@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-12T09:15:00"),
        district_id: { name: "Thrissur" },
        center_id: null
      },
      {
        _id: "v3",
        volunteer_name: "Arun Nair",
        volunteer_email: "arun.nair@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-11T16:45:00"),
        district_id: { name: "Kottayam" },
        center_id: null
      },
            {
        _id: "v3",
        volunteer_name: "Arun Nair",
        volunteer_email: "arun.nair@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-11T16:45:00"),
        district_id: { name: "Kottayam" },
        center_id: null
      },      {
        _id: "v3",
        volunteer_name: "Arun Nair",
        volunteer_email: "arun.nair@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-11T16:45:00"),
        district_id: { name: "Kottayam" },
        center_id: null
      },
            {
        _id: "v3",
        volunteer_name: "Arun Nair",
        volunteer_email: "arun.nair@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-11T16:45:00"),
        district_id: { name: "Kottayam" },
        center_id: null
      },
            {
        _id: "v3",
        volunteer_name: "Arun Nair",
        volunteer_email: "arun.nair@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-11T16:45:00"),
        district_id: { name: "Kottayam" },
        center_id: null
      },
            {
        _id: "v3",
        volunteer_name: "Arun Nair",
        volunteer_email: "arun.nair@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-11T16:45:00"),
        district_id: { name: "Kottayam" },
        center_id: null
      },
      // Approved
      {
        _id: "v5",
        volunteer_name: "Anitha Thomas",
        volunteer_email: "anitha.thomas@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: true,
        availability: true,
        createdAt: new Date("2024-02-10T10:30:00"),
        district_id: { name: "Ernakulam" },
        center_id: { name: "Central Relief Center" }
      },
      {
        _id: "v6",
        volunteer_name: "Suresh Babu",
        volunteer_email: "suresh.babu@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: true,
        availability: true,
        createdAt: new Date("2024-02-09T14:20:00"),
        district_id: { name: "Thrissur" },
        center_id: { name: "Central Relief Center" }
      },
      {
        _id: "v7",
        volunteer_name: "Maya Krishnan",
        volunteer_email: "maya.krishnan@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: true,
        availability: false,
        createdAt: new Date("2024-02-08T09:00:00"),
        district_id: { name: "Kottayam" },
        center_id: { name: "Central Relief Center" }
      }
    ];

    setVolunteers(sampleVolunteers);
    setLoading(false);
  };

  const pendingVolunteers = volunteers.filter(v => !v.profileCompleted);
  const approvedVolunteers = volunteers.filter(v => v.profileCompleted);

  const filteredApprovedVolunteers = approvedVolunteers.filter(volunteer => {
    const matchesSearch = volunteer.volunteer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.volunteer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = filterAvailability === "all" || 
                               (filterAvailability === "available" && volunteer.availability) ||
                               (filterAvailability === "busy" && !volunteer.availability);
    
    return matchesSearch && matchesAvailability;
  });

  const openDetailModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setDetailModalOpen(true);
  };

  const handleApprove = (volunteerId) => {
    setVolunteers(prev => prev.map(v => 
      v._id === volunteerId ? { ...v, profileCompleted: true, center_id: { name: "Central Relief Center" } } : v
    ));
    showNotification("success", "Volunteer approved successfully");
    setDetailModalOpen(false);
  };

  const handleReject = (volunteerId) => {
    setVolunteers(prev => prev.filter(v => v._id !== volunteerId));
    showNotification("success", "Volunteer registration rejected");
    setDetailModalOpen(false);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
  };

  const stats = {
    total: volunteers.length,
    pending: pendingVolunteers.length,
    approved: approvedVolunteers.length,
    available: approvedVolunteers.filter(v => v.availability).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading volunteers...</p>
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
                className="text-indigo-600 hover:text-indigo-700 font-medium mb-2 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="text-4xl">👥</div>
                Volunteer Management
              </h1>
              <p className="text-slate-600 mt-1">Manage volunteer registrations and assignments</p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                <div className="text-2xl font-bold text-indigo-700">{stats.total}</div>
                <div className="text-xs text-indigo-600 font-semibold">Total</div>
              </div>
              <div className="text-center bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                <div className="text-xs text-yellow-600 font-semibold">Pending</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
                <div className="text-xs text-green-600 font-semibold">Approved</div>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{stats.available}</div>
                <div className="text-xs text-blue-600 font-semibold">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Pending Approvals - Professional Compact Section */}
        {pendingVolunteers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-amber-500">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Pending Approvals</h2>
                    <p className="text-sm text-slate-600">{pendingVolunteers.length} volunteer{pendingVolunteers.length !== 1 ? 's' : ''} awaiting verification</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {pendingVolunteers.slice(0, 3).map((volunteer) => (
                  <div
                    key={volunteer._id}
                    onClick={() => openDetailModal(volunteer)}
                    className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full border-2 border-amber-300 overflow-hidden flex-shrink-0">
                      <img src={volunteer.volunteer_photo} alt={volunteer.volunteer_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900">{volunteer.volunteer_name}</h3>
                      <p className="text-sm text-slate-600">{volunteer.volunteer_email}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-slate-500">
                          <span className="font-semibold">District:</span> {volunteer.district_id?.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          <span className="font-semibold">Registered:</span> {new Date(volunteer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
                
                {pendingVolunteers.length > 3 && (
                  <div className="text-center pt-2">
                    <button 
                      onClick={() => navigate('/center/pending-approvals')}
                      className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1 mx-auto"
                    >
                      <span>View All {pendingVolunteers.length} Pending Volunteers</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Volunteers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              All Volunteers
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Search Volunteers</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Availability</label>
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Volunteer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">District</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase">Registered</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredApprovedVolunteers.length > 0 ? (
                  filteredApprovedVolunteers.map((volunteer) => (
                    <tr key={volunteer._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full border-2 border-indigo-200 overflow-hidden flex-shrink-0">
                            <img src={volunteer.volunteer_photo} alt={volunteer.volunteer_name} className="w-full h-full object-cover" />
                          </div>
                          <div className="font-semibold text-slate-900">{volunteer.volunteer_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{volunteer.volunteer_email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{volunteer.district_id?.name || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${volunteer.availability ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                          {volunteer.availability ? "Available" : "Busy"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{new Date(volunteer.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openDetailModal(volunteer)} 
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-4xl mb-2">🔍</div>
                      <p className="text-slate-600">No volunteers found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Professional Detail Modal */}
      {detailModalOpen && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white flex-shrink-0">
                    <img src={selectedVolunteer.volunteer_photo} alt={selectedVolunteer.volunteer_name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedVolunteer.volunteer_name}</h2>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-indigo-100 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedVolunteer.volunteer_email}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedVolunteer.profileCompleted ? (
                        <>
                          <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-bold">
                            ✓ Approved
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-sm font-bold ${selectedVolunteer.availability ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}`}>
                            {selectedVolunteer.availability ? "Available" : "Busy"}
                          </span>
                        </>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm font-bold">
                          ⏳ Pending Approval
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => setDetailModalOpen(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Personal Info */}
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Full Name</p>
                        <p className="text-sm text-slate-900 font-semibold">{selectedVolunteer.volunteer_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Email Address</p>
                        <p className="text-sm text-slate-900">{selectedVolunteer.volunteer_email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">District</p>
                        <p className="text-sm text-slate-900">{selectedVolunteer.district_id?.name || "Not specified"}</p>
                      </div>
                      {selectedVolunteer.center_id && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Assigned Center</p>
                          <p className="text-sm text-slate-900">{selectedVolunteer.center_id.name}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Registration Date</p>
                        <p className="text-sm text-slate-900">
                          {new Date(selectedVolunteer.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Profile Status</p>
                        <p className="text-sm">
                          {selectedVolunteer.profileCompleted ? (
                            <span className="text-green-700 font-semibold">✓ Profile Completed & Approved</span>
                          ) : (
                            <span className="text-yellow-700 font-semibold">⏳ Awaiting Approval</span>
                          )}
                        </p>
                      </div>
                      {selectedVolunteer.profileCompleted && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Current Availability</p>
                          <p className="text-sm">
                            {selectedVolunteer.availability ? (
                              <span className="text-green-700 font-semibold">✓ Available for Assignment</span>
                            ) : (
                              <span className="text-orange-700 font-semibold">Currently Busy</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Documents */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Verification Documents
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Profile Photo */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-slate-700">Profile Photo</h4>
                          <button 
                            onClick={() => window.open(selectedVolunteer.volunteer_photo, '_blank')}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open Full Size
                          </button>
                        </div>
                        <div className="border-2 border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                          <img 
                            src={selectedVolunteer.volunteer_photo} 
                            alt="Profile" 
                            className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                            onClick={() => window.open(selectedVolunteer.volunteer_photo, '_blank')}
                          />
                        </div>
                        <p className="text-xs text-slate-500 text-center mt-2">Click image to view full size</p>
                      </div>

                      {/* ID Proof */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-slate-700">ID Proof Document</h4>
                          <button 
                            onClick={() => window.open(selectedVolunteer.volunteer_proof, '_blank')}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open Full Size
                          </button>
                        </div>
                        <div className="border-2 border-indigo-300 rounded-xl overflow-hidden bg-indigo-50">
                          <img 
                            src={selectedVolunteer.volunteer_proof} 
                            alt="ID Proof" 
                            className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                            onClick={() => window.open(selectedVolunteer.volunteer_proof, '_blank')}
                          />
                        </div>
                        <p className="text-xs text-slate-500 text-center mt-2">Verify identity document carefully</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
              {!selectedVolunteer.profileCompleted ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleApprove(selectedVolunteer._id)} 
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approve Volunteer
                  </button>
                  <button 
                    onClick={() => handleReject(selectedVolunteer._id)} 
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reject Application
                  </button>
                  <button 
                    onClick={() => setDetailModalOpen(false)} 
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button 
                    onClick={() => setDetailModalOpen(false)} 
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`bg-white rounded-xl shadow-2xl border-l-4 ${notification.type === "success" ? "border-green-500" : "border-red-500"} p-4 min-w-[350px]`}>
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
                <svg className={`w-6 h-6 ${notification.type === "success" ? "text-green-600" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={notification.type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 mb-1">{notification.type === "success" ? "Success!" : "Error"}</h3>
                <p className="text-sm text-slate-600">{notification.message}</p>
              </div>
              <button 
                onClick={() => setNotification({ show: false, type: "", message: "" })}
                className="text-slate-400 hover:text-slate-600 transition-colors"
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

export default VolunteerManagement;