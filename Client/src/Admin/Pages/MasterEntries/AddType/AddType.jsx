import axios from "axios";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";

const AddItem = () => {
  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");

  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editItemName, setEditItemName] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState("");

  /* ---------------- FETCH ITEMS + META ---------------- */
  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/items");
      setItems(res.data?.items || []);
      setUnits(res.data?.meta?.units || []);
      setCategories(res.data?.meta?.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ---------------- ADD ITEM ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/admin/item",
        { item_name: itemName, unit, category }
      );
      alert(res.data.message);
      setItemName("");
      setUnit("");
      setCategory("");
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UPDATE ITEM ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/item/${editId}`,
        {
          item_name: editItemName,
          unit: editUnit,
          category: editCategory,
        }
      );
      alert(res.data.message);
      setIsEditOpen(false);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- DISABLE ITEM ---------------- */
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `http://localhost:5000/admin/item/${deleteId}`
      );
      alert(res.data.message);
      setIsDeleteOpen(false);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || "Disable failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ADD FORM */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Add New Item</h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Item Name"
            required
            className="w-full px-4 py-3 border rounded-xl"
          />

          {/* UNIT DROPDOWN */}
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option value="">Select Unit</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          {/* CATEGORY DROPDOWN */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            {isLoading ? "Saving..." : "Add Item"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            Existing Items ({items.length})
          </h3>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Item Name</th>
              <th className="p-4 text-left">Unit</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={item._id} className="border-t">
                <td className="p-4">{i + 1}</td>
                <td className="p-4">{item.item_name}</td>
                <td className="p-4">{item.unit}</td>
                <td className="p-4">{item.category}</td>
                <td className="p-4 flex gap-2">

                  <button
                    onClick={() => {
                      setEditId(item._id);
                      setEditItemName(item.item_name);
                      setEditUnit(item.unit);
                      setEditCategory(item.category);
                      setIsEditOpen(true);
                    }}
                    className="text-yellow-600"
                  >
                    <EditIcon />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteId(item._id);
                      setDeleteItemName(item.item_name);
                      setIsDeleteOpen(true);
                    }}
                    className="text-red-600"
                  >
                    <DeleteIcon />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AddItem;
