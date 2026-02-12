import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const DisasterReports = () => {
  const navigate = useNavigate();
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
    // In real implementation, this would send notifications to volunteers
    // navigate('/center/assign-volunteers', { state: { disaster } });
  };

  const handleStatusChange = (disasterId, newStatus) => {
    setDisasters(prev => prev.map(d => 
      d._id === disasterId ? { ...d, disaster_status: newStatus } : d
    ));
    showNotification("success", `Disaster status updated to ${newStatus}`);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "bg-green-100 text-green-800 border-green-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      high: "bg-orange-100 text-orange-800 border-orange-300",
      critical: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[severity?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-red-100 text-red-800",
      contained: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getDisasterIcon = (type) => {
    const icons = {
      "Flood": "🌊",
      "Landslide": "⛰️",
      "Storm Damage": "🌪️",
      "Fire Outbreak": "🔥",
      "Disease Outbreak": "🦠",
      "Structural Damage": "🏗️",
      "Power Outage": "⚡",
      "Water Contamination": "💧"
    };
    return icons[type] || "⚠️";
  };

  const disasterTypes = [...new Set(disasters.map(d => d.disaster_type))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading disaster reports...</p>
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
                className="text-red-600 hover:text-red-700 font-medium mb-2 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="text-4xl">🚨</div>
                Disaster Reports Management
              </h1>
              <p className="text-slate-600 mt-1">Monitor and respond to emergency situations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{filteredDisasters.length}</div>
                <div className="text-sm text-slate-600">Active Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredDisasters.filter(d => d.disaster_severity === "critical").length}
                </div>
                <div className="text-sm text-slate-600">Critical</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search Reports
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by camp, type, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Severity
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Disaster Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Types</option>
                {disasterTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
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
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="contained">Contained</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold">Showing {filteredDisasters.length} of {disasters.length} reports</span>
            {(filterSeverity !== "all" || filterStatus !== "all" || filterType !== "all" || searchTerm) && (
              <button
                onClick={() => {
                  setFilterSeverity("all");
                  setFilterStatus("all");
                  setFilterType("all");
                  setSearchTerm("");
                }}
                className="text-red-600 hover:text-red-700 font-medium ml-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Disaster Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDisasters.length > 0 ? (
            filteredDisasters.map((disaster) => (
              <div
                key={disaster._id}
                className="bg-white rounded-xl shadow-sm border-2 border-slate-200 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Disaster Header */}
                <div className={`p-5 border-b-4 ${
                  disaster.disaster_severity === "critical" ? "border-red-500 bg-red-50" :
                  disaster.disaster_severity === "high" ? "border-orange-500 bg-orange-50" :
                  disaster.disaster_severity === "medium" ? "border-yellow-500 bg-yellow-50" :
                  "border-green-500 bg-green-50"
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-4xl">{getDisasterIcon(disaster.disaster_type)}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                          {disaster.disaster_type}
                        </h3>
                        <p className="text-sm text-slate-700 font-semibold">{disaster.camp_name}</p>
                        <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {disaster.camp_location}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 ${getSeverityColor(disaster.disaster_severity)}`}>
                      {disaster.disaster_severity?.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(disaster.disaster_status)}`}>
                      {disaster.disaster_status?.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-white text-slate-700 rounded-lg text-xs font-semibold border border-slate-300">
                      👥 {disaster.estimated_people_affected} affected
                    </span>
                    <span className="px-3 py-1 bg-white text-slate-600 rounded-lg text-xs">
                      ⏰ {new Date(disaster.reported_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Disaster Details */}
                <div className="p-5">
                  <p className="text-sm text-slate-700 leading-relaxed mb-4 line-clamp-3">
                    {disaster.disaster_description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => openDetailModal(disaster)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                    <button
                      onClick={() => handleAlertVolunteers(disaster)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Alert Volunteers
                    </button>
                  </div>

                  {/* Status Change Buttons */}
                  {disaster.disaster_status !== "resolved" && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Update Status:</p>
                      <div className="flex gap-2">
                        {disaster.disaster_status !== "contained" && (
                          <button
                            onClick={() => handleStatusChange(disaster._id, "contained")}
                            className="flex-1 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-semibold transition-colors text-xs"
                          >
                            Mark Contained
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(disaster._id, "resolved")}
                          className="flex-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-semibold transition-colors text-xs"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Disaster Reports Found</h3>
              <p className="text-slate-600">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailModalOpen && selectedDisaster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            {/* Modal Header */}
            <div className={`sticky top-0 p-6 rounded-t-2xl border-b-4 ${
              selectedDisaster.disaster_severity === "critical" ? "bg-red-600 border-red-700" :
              selectedDisaster.disaster_severity === "high" ? "bg-orange-600 border-orange-700" :
              selectedDisaster.disaster_severity === "medium" ? "bg-yellow-600 border-yellow-700" :
              "bg-green-600 border-green-700"
            }`}>
              <div className="flex items-start justify-between text-white">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{getDisasterIcon(selectedDisaster.disaster_type)}</div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedDisaster.disaster_type}</h2>
                    <p className="text-lg opacity-90">{selectedDisaster.camp_name}</p>
                    <p className="text-sm opacity-75 flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {selectedDisaster.camp_location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-sm font-bold">
                  {selectedDisaster.disaster_severity?.toUpperCase()} SEVERITY
                </span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-sm font-bold">
                  {selectedDisaster.disaster_status?.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-sm font-semibold">
                  👥 {selectedDisaster.estimated_people_affected} People Affected
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Photo */}
              {selectedDisaster.disaster_photo && (
                <div className="mb-6">
                  <img
                    src={selectedDisaster.disaster_photo}
                    alt="Disaster scene"
                    className="w-full h-64 object-cover rounded-xl border-2 border-slate-200"
                  />
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Situation Description
                </h3>
                <p className="text-slate-700 leading-relaxed">{selectedDisaster.disaster_description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm font-bold text-slate-600 mb-2">Affected Areas</p>
                  <p className="text-slate-800">{selectedDisaster.affected_areas}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm font-bold text-red-700 mb-2">Immediate Needs</p>
                  <p className="text-red-900 font-semibold">{selectedDisaster.immediate_needs}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <h3 className="text-sm font-bold text-blue-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Contact Person</p>
                    <p className="text-blue-900 font-semibold">{selectedDisaster.contact_person}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Phone Number</p>
                    <p className="text-blue-900 font-semibold">{selectedDisaster.contact_phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Reported At</p>
                    <p className="text-blue-900 font-semibold">
                      {new Date(selectedDisaster.reported_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 mb-1">People Affected</p>
                    <p className="text-blue-900 font-semibold">{selectedDisaster.estimated_people_affected} individuals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-200">
              <div className="flex gap-3">
                <button
                  onClick={() => handleAlertVolunteers(selectedDisaster)}
                  className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Alert Volunteers
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

export default DisasterReports;