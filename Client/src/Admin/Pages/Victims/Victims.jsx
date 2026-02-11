import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HomeIcon from "@mui/icons-material/Home";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import BuildIcon from "@mui/icons-material/Build";

// Sample data
const SAMPLE_DATA = [
  { id: "VIC001", name: "Maya K", age: 32, gender: "Female", need: "Medical", priority: "High", status: "Pending", district: "Ernakulam", phone: "9999000001", address: "Ernakulam, Kerala" },
  { id: "VIC002", name: "Thomas P", age: 45, gender: "Male", need: "Food", priority: "Medium", status: "In Progress", district: "Kozhikode", phone: "9999000002", address: "Kozhikode, Kerala" },
  { id: "VIC003", name: "Leena S", age: 28, gender: "Female", need: "Shelter", priority: "Low", status: "Resolved", district: "Thrissur", phone: "9999000003", address: "Thrissur, Kerala" },
  { id: "VIC004", name: "Abdul R", age: 60, gender: "Male", need: "Medical", priority: "High", status: "Pending", district: "Kollam", phone: "9999000004", address: "Kollam, Kerala" },
  { id: "VIC005", name: "Anita J", age: 8, gender: "Female", need: "Clothes", priority: "Medium", status: "Pending", district: "Kottayam", phone: "9999000005", address: "Kottayam, Kerala" },
  { id: "VIC006", name: "Ravi N", age: 52, gender: "Male", need: "Food", priority: "Low", status: "In Progress", district: "Ernakulam", phone: "9999000006", address: "Ernakulam, Kerala" },
  { id: "VIC007", name: "Sneha B", age: 36, gender: "Female", need: "Medical", priority: "High", status: "Pending", district: "Kollam", phone: "9999000007", address: "Kollam, Kerala" },
  { id: "VIC008", name: "Arjun M", age: 27, gender: "Male", need: "Shelter", priority: "High", status: "Pending", district: "Kottayam", phone: "9999000008", address: "Kottayam, Kerala" },
  { id: "VIC009", name: "Nisha P", age: 40, gender: "Female", need: "Clothes", priority: "Low", status: "Resolved", district: "Ernakulam", phone: "9999000009", address: "Ernakulam, Kerala" },
  { id: "VIC010", name: "Kumar V", age: 50, gender: "Male", need: "Food", priority: "Medium", status: "Pending", district: "Kozhikode", phone: "9999000010", address: "Kozhikode, Kerala" },
];

// Helper functions
function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "V";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

const AVATAR_COLORS = [
  ["#3b82f6", "#2563eb"], // blue
  ["#06b6d4", "#0891b2"], // teal
  ["#8b5cf6", "#7c3aed"], // violet
  ["#fb923c", "#ea580c"], // orange
  ["#ef4444", "#dc2626"], // red
  ["#10b981", "#059669"], // green
];

function colorIndexFromString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % AVATAR_COLORS.length;
}

function getTimelineForStatus(status) {
  if (status === "Pending") return ["Requested", "Pending"];
  if (status === "In Progress") return ["Requested", "In Progress"];
  if (status === "Resolved") return ["Requested", "In Progress", "Resolved"];
  return ["Requested"];
}

const Victims = ({ data = SAMPLE_DATA }) => {
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");
  const [pageSize] = useState(9);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  // Get unique districts for filter dropdown
  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(data.map(v => v.district))].sort();
    return uniqueDistricts;
  }, [data]);

  // Filter and sort logic
  const filtered = useMemo(() => {
    return data
      .filter(v => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          v.name.toLowerCase().includes(q) ||
          v.id.toLowerCase().includes(q) ||
          v.need.toLowerCase().includes(q) ||
          v.district.toLowerCase().includes(q)
        );
      })
      .filter(v => {
        if (!filter) return true;
        if (filter === "status" && districtFilter) return v.status === districtFilter;
        if (filter === "district" && districtFilter) return v.district === districtFilter;
        if (filter === "priority" && districtFilter) return v.priority === districtFilter;
        return true;
      });
  }, [data, search, filter, districtFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "newest") arr.sort((a, b) => b.id.localeCompare(a.id));
    if (sort === "oldest") arr.sort((a, b) => a.id.localeCompare(b.id));
    if (sort === "priority") arr.sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    return arr;
  }, [filtered, sort]);

  const paged = useMemo(() => {
    const start = 0;
    const end = page * pageSize;
    return sorted.slice(start, end);
  }, [sorted, page, pageSize]);

  const loadMore = () => setPage(p => p + 1);
  const closeModal = () => setSelected(null);

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setFilter("");
    setDistrictFilter("");
    setSort("");
    setPage(1);
  };

  // Status badge styling
  const getStatusClass = (status) => {
    if (status === "Pending") return "bg-orange-50 text-orange-700 border border-orange-200";
    if (status === "In Progress") return "bg-blue-50 text-blue-700 border border-blue-200";
    if (status === "Resolved") return "bg-green-50 text-green-700 border border-green-200";
    return "bg-gray-50 text-gray-700 border border-gray-200";
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") return "bg-red-50 text-red-700 border border-red-200";
    if (priority === "Medium") return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    if (priority === "Low") return "bg-green-50 text-green-700 border border-green-200";
    return "bg-gray-50 text-gray-700 border border-gray-200";
  };

  const getNeedIcon = (need) => {
    switch (need) {
      case "Medical": return <MedicalServicesIcon className="text-red-600" sx={{ fontSize: 20 }} />;
      case "Food": return <RestaurantIcon className="text-yellow-600" sx={{ fontSize: 20 }} />;
      case "Shelter": return <HomeIcon className="text-blue-600" sx={{ fontSize: 20 }} />;
      case "Clothes": return <CheckroomIcon className="text-purple-600" sx={{ fontSize: 20 }} />;
      default: return <PersonIcon className="text-gray-600" sx={{ fontSize: 20 }} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <PendingIcon className="text-orange-600" sx={{ fontSize: 16 }} />;
      case "In Progress": return <BuildIcon className="text-blue-600" sx={{ fontSize: 16 }} />;
      case "Resolved": return <CheckCircleIcon className="text-green-600" sx={{ fontSize: 16 }} />;
      default: return <AccessTimeIcon className="text-gray-600" sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Victim Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage victim assistance requests</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center bg-white rounded-xl p-4 shadow-sm border border-gray-200 min-w-[100px]">
              <div className="text-2xl font-bold text-gray-900">{data.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-sm border border-gray-200 min-w-[100px]">
              <div className="text-2xl font-bold text-orange-600">{data.filter(v => v.status === "Pending").length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-sm border border-gray-200 min-w-[100px]">
              <div className="text-2xl font-bold text-blue-600">{data.filter(v => v.status === "In Progress").length}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search victims by name, ID, need, or district..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none
                     shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              >
                <option value="">Default</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by</label>
              <select
                value={filter}
                onChange={e => { setFilter(e.target.value); setDistrictFilter(""); }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              >
                <option value="">All Victims</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="district">District</option>
              </select>
            </div>

            {filter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter === "status" ? "Status" : filter === "priority" ? "Priority" : "District"}
                </label>
                <select
                  value={districtFilter}
                  onChange={e => { setDistrictFilter(e.target.value); setPage(1); }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="">All {filter}</option>
                  {filter === "status" && (
                    <>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </>
                  )}
                  {filter === "priority" && (
                    <>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </>
                  )}
                  {filter === "district" && districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            )}

            {(search || filter || sort) && (
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white 
                           text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-sm text-gray-600">
          <div>
            Showing {Math.min(paged.length, sorted.length)} of {sorted.length} victims
            {districtFilter && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                Filtered by: {filter}: {districtFilter}
              </span>
            )}
          </div>
          <div className="mt-2 sm:mt-0">
            {data.length} total victims registered
          </div>
        </div>
      </div>

      {/* Victim Cards Grid */}
      {paged.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PersonIcon className="text-gray-400" sx={{ fontSize: 40 }} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">No victims found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white 
                     text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paged.map((v, i) => {
              const ci = colorIndexFromString(v.name);
              const [g1, g2] = AVATAR_COLORS[ci];
              return (
                <motion.div
                  key={v.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200
                           hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                        style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
                      >
                        {getInitials(v.name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{v.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-gray-600">{v.age} years</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{v.gender}</span>
                            </div>
                          </div>
                          <span className="text-sm font-mono text-gray-500">{v.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getNeedIcon(v.need)}
                        <span className="font-medium text-gray-700">Need:</span>
                      </div>
                      <span className="font-semibold text-gray-900">{v.need}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LocationOnIcon className="text-gray-500" sx={{ fontSize: 20 }} />
                        <span className="font-medium text-gray-700">Location:</span>
                      </div>
                      <span className="font-semibold text-gray-900">{v.district}</span>
                    </div>

                    <div className="flex gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getPriorityClass(v.priority)}`}>
                        {v.priority} Priority
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusClass(v.status)}`}>
                        {getStatusIcon(v.status)}
                        {v.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 flex justify-between items-center">
                    <button
                      onClick={() => setSelected(v)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                               rounded-lg font-medium transition-colors"
                    >
                      View Details
                    </button>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${v.phone}`}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Call"
                      >
                        <PhoneIcon sx={{ fontSize: 20 }} />
                      </a>
                      <button
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More options"
                      >
                        <MoreVertIcon sx={{ fontSize: 20 }} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Load More */}
          {paged.length < sorted.length && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 
                         hover:bg-gray-50 rounded-xl font-medium transition-colors shadow-sm"
              >
                Load More ({sorted.length - paged.length} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-200 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                    style={{ background: `linear-gradient(135deg, ${AVATAR_COLORS[colorIndexFromString(selected.name)][0]}, ${AVATAR_COLORS[colorIndexFromString(selected.name)][1]})` }}
                  >
                    {getInitials(selected.name)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selected.name}</h2>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <span>{selected.age} years • {selected.gender}</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">ID: {selected.id}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon sx={{ fontSize: 24 }} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Assistance Need */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {getNeedIcon(selected.need)}
                      <h3 className="text-lg font-semibold text-gray-900">Assistance Need</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">{selected.need}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPriorityClass(selected.priority)}`}>
                          {selected.priority} Priority
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Immediate assistance required for {selected.need.toLowerCase()}. 
                        This request needs urgent attention due to {selected.priority.toLowerCase()} priority.
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <LocationOnIcon className="text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xl font-bold text-gray-900 mb-1">{selected.district}</div>
                        <div className="text-gray-600">{selected.address}</div>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(selected.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                                 text-white rounded-lg font-medium transition-colors"
                      >
                        <LocationOnIcon sx={{ fontSize: 18 }} />
                        View on Map
                      </a>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <PhoneIcon className="text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-700">Phone Number</div>
                          <div className="text-xl font-bold text-gray-900">{selected.phone}</div>
                        </div>
                      </div>
                      <a
                        href={`tel:${selected.phone}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 
                                 text-white rounded-lg font-medium transition-colors w-full justify-center"
                      >
                        <PhoneIcon sx={{ fontSize: 18 }} />
                        Make a Call
                      </a>
                    </div>
                  </div>

                  {/* Request Status */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TimelineIcon className="text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Request Status</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="flex gap-3">
                        <span className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${getStatusClass(selected.status)}`}>
                          {getStatusIcon(selected.status)}
                          {selected.status}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-4">Status Timeline</h4>
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          {getTimelineForStatus(selected.status).map((step, idx) => (
                            <div key={step} className="flex items-center mb-6 relative">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10
                                            ${idx <= getTimelineForStatus(selected.status).indexOf(selected.status) 
                                              ? 'bg-blue-600 border-blue-600 text-white' 
                                              : 'bg-white border-gray-300 text-gray-400'}`}>
                                {idx + 1}
                              </div>
                              <div className="ml-4">
                                <div className={`font-medium ${idx <= getTimelineForStatus(selected.status).indexOf(selected.status) ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {step}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 
                           hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  Close
                </button>
                <div className="flex gap-3">
                  <a
                    href={`tel:${selected.phone}`}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 
                             text-white rounded-xl font-medium transition-colors"
                  >
                    Contact Now
                  </a>
                  <button
                    className="px-6 py-3 border border-blue-600 text-blue-600 
                             hover:bg-blue-50 rounded-xl font-medium transition-colors"
                  >
                    Assign Volunteer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Victims;