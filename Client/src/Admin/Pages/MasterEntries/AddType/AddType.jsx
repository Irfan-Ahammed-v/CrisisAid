import axios from "axios";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";

const AddType = () => {
  const [type, setType] = useState("");
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState("");

  // delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTypeName, setDeleteTypeName] = useState("");

  /* ---------------- FETCH TYPES ---------------- */
  const fetchTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/fetchtypes");
      setTypes(res.data?.types || []);
    } catch (err) {
      console.error(err);
      setTypes([]);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  /* ---------------- ADD TYPE ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/type",
        { type_name: type }
      );
      alert(res.data.message);
      setType("");
      fetchTypes();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UPDATE TYPE ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/type/${editId}`,
        { type_name: editType }
      );
      alert(res.data.message);
      setIsEditOpen(false);
      fetchTypes();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- DELETE TYPE ---------------- */
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `http://localhost:5000/admin/type/${deleteId}`
      );
      alert(res.data.message);
      setIsDeleteOpen(false);
      fetchTypes();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ADD FORM */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <CategoryIcon className="text-green-600" sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add New Request Type</h3>
            <p className="text-sm text-gray-600">Create categories for help requests</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Type Name
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white 
                       focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
              placeholder="e.g., Medical, Food, Shelter, Rescue"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white 
                     px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <AddIcon sx={{ fontSize: 20 }} />
                <span>Add Request Type</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Existing Request Types ({types.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">No</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Type Name</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {types.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-gray-500">
                    <div className="text-lg mb-2">No request types found</div>
                    <p className="text-sm">Add your first request type using the form above</p>
                  </td>
                </tr>
              ) : (
                types.map((t, i) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-gray-600 font-mono">{i + 1}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CategoryIcon className="text-green-600" sx={{ fontSize: 20 }} />
                        </div>
                        <span className="font-medium text-gray-900">{t.type_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditId(t._id);
                            setEditType(t.type_name);
                            setIsEditOpen(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 
                                   hover:bg-yellow-100 transition-colors text-sm font-medium"
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(t._id);
                            setDeleteTypeName(t.type_name);
                            setIsDeleteOpen(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 
                                   hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                          Delete
                        </button>
                      </div>
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
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsEditOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleUpdate} className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Edit Request Type
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Type Name
                  </label>
                  <input
                    type="text"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white 
                             focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                    placeholder="Enter type name"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 
                           hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-green-600 text-white 
                           hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsDeleteOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DeleteIcon className="text-red-600" sx={{ fontSize: 32 }} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Delete Request Type</h2>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this request type?
              </p>
              <p className="text-lg font-semibold text-red-600 mb-8">
                "{deleteTypeName}"
              </p>
              <p className="text-sm text-gray-500 mb-8">
                This action cannot be undone. All requests associated with this type will need to be reassigned.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 
                           hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-red-600 text-white 
                           hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddType;