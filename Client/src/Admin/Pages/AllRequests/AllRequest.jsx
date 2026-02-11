import React, { useEffect, useState } from "react";
import axios from "axios";

const AllRequest = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");
  const [district, setDistrict] = useState("");
  const [requestsList, setRequestsList] = useState([]);

  const getRequestsList = () => {
    axios
      .get("http://localhost:5000/Admin/requests")
      .then((response) => {
        console.log("API DATA:", response.data);
        setRequestsList(response.data.requests);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getRequestsList();
  }, []);

  // Helper function to get Tailwind classes for priority and status
  const getPriorityClass = (priority) => {
    if (!priority) return "bg-gray-100 text-gray-700";
    
    const p = priority.toLowerCase();
    if (p === "high") return "bg-red-50 text-red-700 border border-red-200";
    if (p === "medium") return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    if (p === "low") return "bg-green-50 text-green-700 border border-green-200";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusClass = (status) => {
    if (!status) return "bg-gray-100 text-gray-700";
    
    const s = status.toLowerCase();
    if (s === "pending") return "bg-orange-50 text-orange-700 border border-orange-200";
    if (s === "in progress" || s === "inprogress") return "bg-blue-50 text-blue-700 border border-blue-200";
    if (s === "resolved") return "bg-green-50 text-green-700 border border-green-200";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Requests</h2>

      {/* Search and Filter Bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none
                     shadow-sm"
        />
        
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none
                     shadow-sm"
        >
          <option value="">Sort by</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority</option>
        </select>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none
                     shadow-sm"
        >
          <option value="">Filter by Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none
                     shadow-sm"
        >
          <option value="">All Districts</option>
          <option value="district1">District 1</option>
          <option value="district2">District 2</option>
          {/* Add more districts dynamically */}
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="col-span-1 font-semibold text-gray-700">ID</div>
          <div className="col-span-2 font-semibold text-gray-700">Name</div>
          <div className="col-span-2 font-semibold text-gray-700">Type</div>
          <div className="col-span-1 font-semibold text-gray-700">Priority</div>
          <div className="col-span-2 font-semibold text-gray-700">Status</div>
          <div className="col-span-2 font-semibold text-gray-700">District</div>
          <div className="col-span-2 font-semibold text-gray-700">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {requestsList.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="text-lg mb-2">No requests found</div>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            requestsList.map((item) => (
              <div 
                key={item._id} 
                className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-1 text-gray-600 font-mono">001</div>
                <div className="col-span-2 font-medium text-gray-900">{item.Name}</div>
                <div className="col-span-2 text-gray-700">{item.type}</div>
                
                <div className="col-span-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getPriorityClass(item.priority)}`}>
                    {item.priority || "Unknown"}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(item.status)}`}>
                    {item.status || "Unknown"}
                  </span>
                </div>
                
                <div className="col-span-2 text-gray-700">{item.district}</div>
                
                <div className="col-span-2">
                  <button 
                    onClick={() => console.log("View details:", item._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination (optional) */}
      {requestsList.length > 0 && (
        <div className="flex justify-between items-center mt-6 px-2">
          <div className="text-sm text-gray-600">
            Showing {requestsList.length} of {requestsList.length} requests
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRequest;