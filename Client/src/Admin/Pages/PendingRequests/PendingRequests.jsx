import React, { useState } from "react";

const PendingRequests = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");
  const [district, setDistrict] = useState("");

  // Sample data - pending requests only
  const allData = [
    { id: "REQ001", name: "John Doe", type: "Medical", priority: "High", status: "Pending", district: "Ernakulam" },
    { id: "REQ002", name: "Aisha Khan", type: "Food", priority: "Medium", status: "Pending", district: "Kozhikode" },
    { id: "REQ003", name: "Rahul Nair", type: "Shelter", priority: "Low", status: "Pending", district: "Thrissur" },
    { id: "REQ004", name: "Sneha B", type: "Medical", priority: "High", status: "Pending", district: "Kollam" },
    { id: "REQ005", name: "Arjun M", type: "Food", priority: "High", status: "Pending", district: "Kottayam" },
  ];

  // Filter for pending requests
  const pendingList = allData.filter(item => item.status === "Pending");

  // Helper function for dynamic badge classes
  const getPriorityClass = (priority) => {
    const p = priority.toLowerCase();
    if (p === "high") return "bg-red-50 text-red-700 border border-red-200";
    if (p === "medium") return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    if (p === "low") return "bg-green-50 text-green-700 border border-green-200";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusClass = (status) => {
    const s = status.toLowerCase();
    if (s === "pending") return "bg-orange-50 text-orange-700 border border-orange-200";
    return "bg-gray-100 text-gray-700";
  };

  // Filtering logic
  const filteredData = pendingList
    .filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
    )
    .filter(item =>
      filter === "status"
        ? item.status === district
        : true
    )
    .filter(item =>
      filter === "district"
        ? item.district === district
        : true
    );

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (sort === "newest") return b.id.localeCompare(a.id);
    if (sort === "oldest") return a.id.localeCompare(b.id);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Requests</h2>

      {/* Search and Filter Bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search pending requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none
                     shadow-sm"
        />
        
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none
                     shadow-sm"
        >
          <option value="">Sort by</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setDistrict(""); }}
          className="px-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none
                     shadow-sm"
        >
          <option value="">Filter by</option>
          <option value="status">Status</option>
          <option value="district">District</option>
        </select>
        
        {filter === "status" && (
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white 
                       focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none
                       shadow-sm"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
          </select>
        )}
        
        {filter === "district" && (
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white 
                       focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none
                       shadow-sm"
          >
            <option value="">Select District</option>
            <option value="Ernakulam">Ernakulam</option>
            <option value="Kollam">Kollam</option>
            <option value="Kozhikode">Kozhikode</option>
            <option value="Thrissur">Thrissur</option>
            <option value="Kottayam">Kottayam</option>
          </select>
        )}
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
          {sortedData.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="text-lg mb-2">No pending requests found</div>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            sortedData.map((item) => (
              <div 
                key={item.id} 
                className="grid grid-cols-12 px-6 py-4 hover:bg-orange-50 transition-colors"
              >
                <div className="col-span-1 text-gray-600 font-mono">{item.id}</div>
                <div className="col-span-2 font-medium text-gray-900">{item.name}</div>
                <div className="col-span-2 text-gray-700">{item.type}</div>
                
                <div className="col-span-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getPriorityClass(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="col-span-2 text-gray-700">{item.district}</div>
                
                <div className="col-span-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => console.log("Assign request:", item.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Assign
                    </button>
                    <button 
                      onClick={() => console.log("View details:", item.id)}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Total Pending</div>
          <div className="text-2xl font-bold text-orange-600">{pendingList.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">High Priority</div>
          <div className="text-2xl font-bold text-red-600">
            {pendingList.filter(item => item.priority === "High").length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">By District</div>
          <div className="text-2xl font-bold text-blue-600">
            {[...new Set(pendingList.map(item => item.district))].length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingRequests;