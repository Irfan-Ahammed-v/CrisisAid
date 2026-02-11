import React, { useState } from "react";

const ResolvedRequests = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");
  const [district, setDistrict] = useState("");

  // Simplified sample data - only resolved requests
  const resolvedList = [
    { id: "REQ003", name: "Rahul Nair", type: "Shelter", priority: "Low", status: "Resolved", district: "Thrissur", resolvedDate: "2024-01-15" },
    { id: "REQ005", name: "Arjun M", type: "Food", priority: "High", status: "Resolved", district: "Kottayam", resolvedDate: "2024-01-16" },
    { id: "REQ006", name: "Nisha P", type: "Clothes", priority: "Low", status: "Resolved", district: "Ernakulam", resolvedDate: "2024-01-14" },
    { id: "REQ007", name: "Mohan S", type: "Medical", priority: "Medium", status: "Resolved", district: "Kozhikode", resolvedDate: "2024-01-17" },
    { id: "REQ008", name: "Priya K", type: "Shelter", priority: "High", status: "Resolved", district: "Kollam", resolvedDate: "2024-01-13" },
  ];

  // Helper functions for dynamic badge classes
  const getPriorityClass = (priority) => {
    const p = priority.toLowerCase();
    if (p === "high") return "bg-red-50 text-red-700 border border-red-200";
    if (p === "medium") return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    if (p === "low") return "bg-green-50 text-green-700 border border-green-200";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusClass = (status) => {
    const s = status.toLowerCase();
    if (s === "resolved") return "bg-green-50 text-green-700 border border-green-200";
    return "bg-gray-100 text-gray-700";
  };

  // Filtering logic
  const filteredData = resolvedList
    .filter(item =>
      search.trim() === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      item.district.toLowerCase().includes(search.toLowerCase())
    )
    .filter(item =>
      filter === "district" ? item.district === district : true
    );

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (sort === "newest") return new Date(b.resolvedDate) - new Date(a.resolvedDate);
    if (sort === "oldest") return new Date(a.resolvedDate) - new Date(b.resolvedDate);
    if (sort === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  // Calculate stats
  const totalResolved = resolvedList.length;
  const avgResolutionTime = "24h"; // This would be calculated from actual data

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resolved Requests</h2>

      {/* Summary Stats */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Total Resolved</div>
          <div className="text-2xl font-bold text-green-600">{totalResolved}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Avg. Resolution Time</div>
          <div className="text-2xl font-bold text-blue-600">{avgResolutionTime}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Districts Covered</div>
          <div className="text-2xl font-bold text-purple-600">
            {[...new Set(resolvedList.map(item => item.district))].length}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search resolved requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none
                     shadow-sm"
        />
        
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none
                     shadow-sm"
        >
          <option value="">Sort by</option>
          <option value="newest">Newest Resolved</option>
          <option value="oldest">Oldest Resolved</option>
          <option value="priority">Priority Level</option>
        </select>
        
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setDistrict(""); }}
          className="px-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none
                     shadow-sm"
        >
          <option value="">Filter by</option>
          <option value="district">District</option>
        </select>
        
        {filter === "district" && (
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white 
                       focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none
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
          <div className="col-span-2 font-semibold text-gray-700">Resolved Date</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {sortedData.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="text-lg mb-2">No resolved requests found</div>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            sortedData.map((item) => (
              <div 
                key={item.id} 
                className="grid grid-cols-12 px-6 py-4 hover:bg-green-50 transition-colors"
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
                
                <div className="col-span-2 text-gray-600 text-sm">
                  {new Date(item.resolvedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Most Common Request Type</div>
            <div className="text-lg font-bold text-gray-900">Shelter</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Most Active District</div>
            <div className="text-lg font-bold text-gray-900">Ernakulam</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Success Rate</div>
            <div className="text-lg font-bold text-green-600">98%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolvedRequests;