import axios from "axios";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PlaceIcon from "@mui/icons-material/Place";

const AddPlace = () => {
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [place, setPlace] = useState("");
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editPlace, setEditPlace] = useState("");

  // delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deletePlaceName, setDeletePlaceName] = useState("");

  /* ---------------- FETCH DISTRICTS ---------------- */
  const fetchDistricts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/districts");
      setDistricts(res.data?.districts || []);
    } catch (err) {
      console.error(err);
      setDistricts([]);
    }
  };

  /* ---------------- FETCH PLACES ---------------- */
  const fetchPlaces = async (districtId) => {
    if (!districtId) {
      setPlaces([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/admin/places/${districtId}`
      );
      setPlaces(res.data?.places || []);
    } catch (err) {
      console.error(err);
      setPlaces([]);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    fetchPlaces(districtId);
  }, [districtId]);

  /* ---------------- ADD PLACE ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!districtId) {
      alert("Please select a district");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/admin/place/${districtId}`,
        { place_name: place }
      );

      alert(res.data.message);
      setPlace("");
      fetchPlaces(districtId);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UPDATE PLACE ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/place/${editId}`,
        { place_name: editPlace }
      );
      alert(res.data.message);
      setIsEditOpen(false);
      fetchPlaces(districtId);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- DELETE PLACE ---------------- */
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `http://localhost:5000/admin/place/${deleteId}`
      );
      alert(res.data.message);
      setIsDeleteOpen(false);
      fetchPlaces(districtId);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected district name
  const selectedDistrict = districts.find(d => d._id === districtId)?.districtName || "";

  return (
    <div className="space-y-6">
      {/* DISTRICT SELECTION */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <LocationOnIcon className="text-blue-600" sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select District</h3>
            <p className="text-sm text-gray-600">Choose a district to manage its places</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <select
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            >
              <option value="">-- Select District --</option>
              {districts.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.districtName}
                </option>
              ))}
            </select>
          </div>

          {/* Selected District Info */}
          {districtId && (
            <div className="bg-white p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <LocationOnIcon className="text-blue-600" sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Selected District</p>
                  <p className="font-semibold text-blue-700">{selectedDistrict}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD PLACE FORM */}
      {districtId && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <PlaceIcon className="text-indigo-600" sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add New Place</h3>
              <p className="text-sm text-gray-600">Add locations within {selectedDistrict}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place Name
              </label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white 
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="e.g., City Center, Town Square, Coastal Area"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !districtId}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white 
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
                  <span>Add Place</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* PLACES TABLE */}
      {districtId && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Places in {selectedDistrict}
                </h3>
                <p className="text-sm text-gray-600">{places.length} places found</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {selectedDistrict}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">No</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Place Name</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {places.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-gray-500">
                      <div className="text-lg mb-2">No places found in {selectedDistrict}</div>
                      <p className="text-sm">Add your first place using the form above</p>
                    </td>
                  </tr>
                ) : (
                  places.map((p, i) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-600 font-mono">{i + 1}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <PlaceIcon className="text-indigo-600" sx={{ fontSize: 20 }} />
                          </div>
                          <span className="font-medium text-gray-900">{p.place_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditId(p._id);
                              setEditPlace(p.place_name);
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
                              setDeleteId(p._id);
                              setDeletePlaceName(p.place_name);
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
      )}

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
                Edit Place
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place Name
                  </label>
                  <input
                    type="text"
                    value={editPlace}
                    onChange={(e) => setEditPlace(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white 
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    placeholder="Enter place name"
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
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white 
                           hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update Place"}
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
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Delete Place</h2>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this place?
              </p>
              <p className="text-lg font-semibold text-red-600 mb-2">
                "{deletePlaceName}"
              </p>
              <p className="text-sm text-gray-500 mb-2">
                District: <span className="font-medium">{selectedDistrict}</span>
              </p>
              <p className="text-sm text-gray-500 mb-8">
                This action cannot be undone.
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

      {/* INFO WHEN NO DISTRICT SELECTED */}
      {!districtId && (
        <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-8 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <LocationOnIcon className="text-gray-400" sx={{ fontSize: 32 }} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Select a District</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose a district from the dropdown above to view and manage its places.
            Each district can have multiple locations for relief operations.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddPlace;