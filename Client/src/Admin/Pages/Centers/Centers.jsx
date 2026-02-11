import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const Centers = () => {
  /* ---------------- STATE ---------------- */
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [centerMap, setCenterMap] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  
  // District modal
  const [isOpen, setIsOpen] = useState(false);
  const [district, setDistrict] = useState("");
  const [editId, setEditId] = useState(null);

  /* ---------------- HELPERS ---------------- */
  const resetDistrictForm = () => {
    setDistrict("");
    setEditId(null);
  };

  /* ---------------- FETCH DISTRICTS ---------------- */
  const fetchDistricts = async () => {
    const res = await axios.get("http://localhost:5000/admin/districts");
    setData(res.data?.districts || []);
  };

  /* ---------------- FETCH CENTERS ---------------- */ 
  const fetchCenters = async (districtId) => {
    if (!districtId) return;

    setLoadingId(districtId);
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/centers/${districtId}`
      );

      setCenterMap((prev) => ({
        ...prev,
        [districtId]: res.data?.centers || [],
      }));
    } finally {
      setLoadingId(null);
    }
  };

  /* ---------------- EXPAND ---------------- */
  const toggleExpand = (districtId) => {
    if (expandedId === districtId) {
      setExpandedId(null);
    } else {
      setExpandedId(districtId);
      fetchCenters(districtId);
    }
  };

  /* ---------------- SEARCH ---------------- */
  const getFilteredCenters = (districtId) => {
    const centers = centerMap[districtId] || [];
    if (!search.trim()) return centers;

    return centers.filter((c) =>
      c.center_name?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredData = data.filter((d) => {
    const districtMatch = d.districtName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const centerMatch = (centerMap[d._id] || []).some((c) =>
      c.center_name?.toLowerCase().includes(search.toLowerCase())
    );

    return districtMatch || centerMatch;
  });

  useEffect(() => {
    if (!search.trim()) return;

    filteredData.forEach((d) => {
      const hasMatch = (centerMap[d._id] || []).some((c) =>
        c.center_name?.toLowerCase().includes(search.toLowerCase())
      );
      if (hasMatch) setExpandedId(d._id);
    });
  }, [search, centerMap]);

  /* ---------------- DISTRICT SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { districtName: district };

    const res = editId
      ? await axios.put(
          `http://localhost:5000/admin/district/${editId}`,
          payload
        )
      : await axios.post(
          "http://localhost:5000/admin/addDistrict",
          payload
        );

    alert(res.data.message);
    setIsOpen(false);
    resetDistrictForm();
    fetchDistricts();
  };

  /* ---------------- DELETE DISTRICT ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this district?")) return;
    await axios.delete(`http://localhost:5000/admin/district/${id}`);
    fetchDistricts();
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    fetchDistricts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Centers Management</h1>
        <p className="text-gray-600 mt-2">
          View relief centers under each district
        </p>
      </div>

      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search district or center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none
                     shadow-sm"
          />
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white 
                   px-5 py-3 rounded-xl font-medium transition-colors shadow-sm"
        >
          <AddIcon sx={{ fontSize: 20 }} />
          Add District
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">No</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">District</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Centers</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500">
                    <div className="text-lg mb-2">No districts found</div>
                    <p className="text-sm">Try adding a district or adjusting your search</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((d, i) => (
                  <React.Fragment key={d._id}>
                    {/* Main District Row */}
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-600">{i + 1}</td>
                      <td className="py-4 px-6 font-medium text-gray-900">{d.districtName}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {d.CentersCount || 0} centers
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(d._id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 
                                     hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            {expandedId === d._id ? (
                              <>
                                <VisibilityOffIcon sx={{ fontSize: 16 }} />
                                Hide
                              </>
                            ) : (
                              <>
                                <VisibilityIcon sx={{ fontSize: 16 }} />
                                View
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => {
                              setEditId(d._id);
                              setDistrict(d.districtName);
                              setIsOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 
                                     hover:bg-yellow-100 transition-colors text-sm font-medium"
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDelete(d._id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 
                                     hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Centers Row */}
                    {expandedId === d._id && (
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="p-0">
                          <div className="p-6 border-t border-gray-200 animate-fadeIn">
                            {loadingId === d._id ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="ml-3 text-gray-600">Loading centers...</span>
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                  <h3 className="font-semibold text-gray-800">
                                    Centers in {d.districtName}
                                  </h3>
                                </div>
                                
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">No</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Center Name</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Capacity</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Occupancy</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Address</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {getFilteredCenters(d._id).length === 0 ? (
                                        <tr>
                                          <td colSpan="6" className="py-8 text-center text-gray-500">
                                            {search ? "No centers match your search" : "No centers found in this district"}
                                          </td>
                                        </tr>
                                      ) : (
                                        getFilteredCenters(d._id).map((c, idx) => (
                                          <tr key={c._id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-600">{idx + 1}</td>
                                            <td className="py-3 px-4 font-medium text-gray-900">{c.center_name || "-"}</td>
                                            <td className="py-3 px-4">
                                              <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                                                {c.center_capacity || 0}
                                              </span>
                                            </td>
                                            <td className="py-3 px-4">
                                              <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                                                {c.center_occupancy || 0}
                                              </span>
                                            </td>
                                            <td className="py-3 px-4">
                                              <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                c.center_status === 'Active' 
                                                  ? 'bg-green-100 text-green-800'
                                                  : c.center_status === 'Full'
                                                  ? 'bg-red-100 text-red-800'
                                                  : 'bg-gray-100 text-gray-800'
                                              }`}>
                                                {c.center_status || "Unknown"}
                                              </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600 text-sm">{c.center_address || "-"}</td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISTRICT MODAL */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {editId ? "Edit District" : "Add District"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District Name
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Enter district name"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 
                           hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white 
                           hover:bg-blue-700 transition-colors font-medium"
                >
                  {editId ? "Update District" : "Add District"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Centers;