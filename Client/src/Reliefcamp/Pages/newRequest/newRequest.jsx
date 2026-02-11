import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DescriptionIcon from "@mui/icons-material/Description";
import axios from "axios";

axios.defaults.withCredentials = true;

// Add styles for the sliding animation
const styles = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in-right {
    animation: slideInRight 0.3s ease-out forwards;
  }
`;

const NewRequest = () => {
  const navigate = useNavigate();
  const [requestDetails, setRequestDetails] = useState("");
  const [requestItems, setRequestItems] = useState([]);
  const [items, setItems] = useState([{ itemName: "", qty: "" }]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "", // "success" or "error"
    message: ""
  });

  // Fetch master request items
  useEffect(() => {
    axios
      .get("http://localhost:5000/camp/request-items")
      .then((res) => setRequestItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addItemRow = () => {
    setItems([...items, { itemName: "", qty: "" }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!requestDetails.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "Please enter request details"
      });
      setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
      return;
    }

    if (
      items.some(
        (item) => !item.itemName || !item.qty || Number(item.qty) <= 0
      )
    ) {
      setNotification({
        show: true,
        type: "error",
        message: "Please select valid items and quantities"
      });
      setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
      return;
    }

    const payload = {
      request_details: requestDetails,
      items,
    };

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:5000/camp/new-request", payload);

      // Show success message from backend
      setNotification({
        show: true,
        type: "success",
        message: response.data.message || "Request submitted successfully"
      });

      // Reset form after delay
      setTimeout(() => {
        setRequestDetails("");
        setItems([{ itemName: "", qty: "" }]);
        setNotification({ show: false, type: "", message: "" });
      }, 3000);
    } catch (err) {
      console.error(err);

      // Show error message from backend
      const errorMessage = err.response?.data?.message || "Failed to submit request";
      
      setNotification({
        show: true,
        type: "error",
        message: errorMessage
      });

      setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => {
      const qty = parseInt(item.qty) || 0;
      return sum + qty;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Inject animation styles */}
      <style>{styles}</style>
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <div className="text-5xl"><DescriptionIcon
                sx={{ width: 38, height: 38, color: "#224aa8" }}
              /></div>
            New Relief Request
          </h1>
          <p className="text-slate-600 text-lg">
            Submit a request for supplies or assistance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-xl font-bold text-slate-900">
                Request Details
              </h2>
            </div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Describe your request <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={requestDetails}
              onChange={(e) => setRequestDetails(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe the situation clearly and provide any relevant details..."
              rows={5}
            />
            <p className="text-xs text-slate-500 mt-2">
              {requestDetails.length} characters
            </p>
          </div>

          {/* Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h2 className="text-xl font-bold text-slate-900">
                  Requested Items
                </h2>
              </div>
              {items.length > 0 && getTotalItems() > 0 && (
                <div className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                  Total: {getTotalItems()} items
                </div>
              )}
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg font-bold flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={item.itemName}
                      onChange={(e) =>
                        handleItemChange(index, "itemName", e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select an item</option>
                      {requestItems.map((name, idx) => (
                        <option key={idx} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-32">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(index, "qty", e.target.value)
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className="self-end px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                      title="Remove item"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItemRow}
              className="mt-4 w-full py-3 border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-lg text-emerald-600 hover:bg-emerald-50 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Another Item
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Sliding Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`bg-white rounded-xl shadow-2xl border-l-4 ${
            notification.type === "success" ? "border-green-500" : "border-red-500"
          } p-4 min-w-[350px] max-w-md`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notification.type === "success" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {notification.type === "success" ? (
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {notification.type === "success" ? "Success!" : "Error"}
                </h3>
                <p className="text-sm text-slate-600">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification({ show: false, type: "", message: "" })}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRequest;