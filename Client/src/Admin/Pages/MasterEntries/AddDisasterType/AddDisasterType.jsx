import axios from "axios";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import WarningIcon from "@mui/icons-material/Warning";

const AddDisasterType = () => {
  const [disasterName, setDisasterName] = useState("");
  const [disasterTypes, setDisasterTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editDisasterName, setEditDisasterName] = useState("");

  const fetchDisasterTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/disaster-types");
      setDisasterTypes(res.data?.disaster_types || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDisasterTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!disasterName.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/new-disaster",
        { disaster_name: disasterName }
      );
      alert(res.data.message);
      setDisasterName("");
      fetchDisasterTypes();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editDisasterName.trim()) return;

    setIsLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/disaster-type/${editId}`,
        { disaster_name: editDisasterName }
      );
      alert(res.data.message);
      setIsEditOpen(false);
      fetchDisasterTypes();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setIsLoading(true);
    try {
      const res = await axios.delete(`http://localhost:5000/admin/disaster-type/${id}`);
      alert(res.data.message);
      fetchDisasterTypes();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ADD FORM */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AddIcon className="text-blue-600" />
          Add New Disaster Type
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={disasterName}
            onChange={(e) => setDisasterName(e.target.value)}
            placeholder="e.g. Flood, Earthquake, Wildfire"
            required
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />

          <button
            type="submit"
            disabled={isLoading || !disasterName.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : <AddIcon />}
            {isLoading ? "Saving..." : "Add Disaster Type"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <WarningIcon className="text-amber-500" />
            Existing Disaster Types ({disasterTypes.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left text-xs font-black uppercase tracking-widest text-gray-500 w-20">No</th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Disaster Category</th>
                <th className="p-4 text-left text-xs font-black uppercase tracking-widest text-gray-500 w-40">Actions</th>
              </tr>
            </thead>

            <tbody>
              {disasterTypes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-12 text-center text-gray-400">
                    No disaster types registered yet.
                  </td>
                </tr>
              ) : (
                disasterTypes.map((type, i) => (
                  <tr key={type._id} className="border-t border-gray-100 hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-medium text-gray-600">{i + 1}</td>
                    <td className="p-4">
                      <span className="font-bold text-gray-800">{type.disaster_type_name}</span>
                    </td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => {
                          setEditId(type._id);
                          setEditDisasterName(type.disaster_type_name);
                          setIsEditOpen(true);
                        }}
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleDelete(type._id, type.disaster_type_name)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">
              Edit Disaster Type
            </h3>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editDisasterName}
                  onChange={(e) => setEditDisasterName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !editDisasterName.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  {isLoading ? "Saving..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDisasterType;
