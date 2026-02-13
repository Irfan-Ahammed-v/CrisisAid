import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const PendingApprovals = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
    const samplePendingVolunteers = [
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
        _id: "v4",
        volunteer_name: "Lakshmi Pillai",
        volunteer_email: "lakshmi.p@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-11T14:20:00"),
        district_id: { name: "Alappuzha" },
        center_id: null
      },
      {
        _id: "v5",
        volunteer_name: "Deepak Menon",
        volunteer_email: "deepak.menon@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-10T18:30:00"),
        district_id: { name: "Kollam" },
        center_id: null
      },
      {
        _id: "v6",
        volunteer_name: "Kavya Nair",
        volunteer_email: "kavya.nair@email.com",
        volunteer_photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
        volunteer_proof: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400",
        profileCompleted: false,
        availability: true,
        createdAt: new Date("2024-02-10T15:45:00"),
        district_id: { name: "Ernakulam" },
        center_id: null
      }
    ];

    setPendingVolunteers(samplePendingVolunteers);
    setLoading(false);
  };

  const filteredVolunteers = pendingVolunteers.filter(volunteer => {
    const matchesSearch = volunteer.volunteer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.volunteer_email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const openDetailModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setDetailModalOpen(true);
  };

  const handleApprove = (volunteerId) => {
    setPendingVolunteers(prev => prev.filter(v => v._id !== volunteerId));
    showNotification("success", "Volunteer approved successfully");
    setDetailModalOpen(false);
  };

  const handleReject = (volunteerId) => {
    setPendingVolunteers(prev => prev.filter(v => v._id !== volunteerId));
    showNotification("success", "Volunteer registration rejected");
    setDetailModalOpen(false);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading pending volunteers...</p>
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
                className="text-amber-600 hover:text-amber-700 font-medium mb-2 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Volunteer Management
              </button>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Pending Volunteer Approvals
              </h1>
              <p className="text-slate-600 mt-1">Review and verify volunteer registrations</p>
            </div>
            
            {/* Stats */}
            <div className="text-center bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
              <div className="text-3xl font-bold text-amber-700">{filteredVolunteers.length}</div>
              <div className="text-sm text-amber-600 font-semibold">Pending Approval{filteredVolunteers.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="max-w-2xl">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Search Pending Volunteers</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Volunteers Grid */}
        {filteredVolunteers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map((volunteer) => (
              <div
                key={volunteer._id}
                className="bg-white rounded-xl shadow-sm border-2 border-amber-200 hover:shadow-lg hover:border-amber-400 transition-all overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 border-b-2 border-amber-200">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full border-3 border-amber-400 overflow-hidden flex-shrink-0 bg-white">
                      <img src={volunteer.volunteer_photo} alt={volunteer.volunteer_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 truncate">{volunteer.volunteer_name}</h3>
                      <p className="text-sm text-slate-600 truncate">{volunteer.volunteer_email}</p>
                      <div className="mt-2">
                        <span className="px-3 py-1 bg-amber-600 text-white rounded-full text-xs font-bold">
                          Pending Review
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-slate-700 font-medium">{volunteer.district_id?.name || "Not specified"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-600">
                      Registered: {new Date(volunteer.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-600">
                      {new Date(volunteer.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 bg-slate-50 border-t border-slate-200">
                  <button
                    onClick={() => openDetailModal(volunteer)}
                    className="w-full px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Review & Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Pending Approvals</h3>
            <p className="text-slate-600">All volunteer registrations have been processed</p>
          </div>
        )}
      </div>

      {/* Professional Detail Modal */}
      {detailModalOpen && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white flex-shrink-0">
                    <img src={selectedVolunteer.volunteer_photo} alt={selectedVolunteer.volunteer_name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedVolunteer.volunteer_name}</h2>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-amber-100 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedVolunteer.volunteer_email}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-lg text-sm font-bold">
                      ⏳ Pending Approval
                    </span>
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
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <div className="pt-4">
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                          <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Action Required
                          </p>
                          <p className="text-sm text-amber-900">
                            Please verify the volunteer's identity documents carefully before approval.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Documents */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
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
                            className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open Full Size
                          </button>
                        </div>
                        <div className="border-2 border-amber-300 rounded-xl overflow-hidden bg-amber-50">
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

export default PendingApprovals;