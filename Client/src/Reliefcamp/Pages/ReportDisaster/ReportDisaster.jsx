import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import WarningAmberTwoToneIcon from "@mui/icons-material/WarningAmberTwoTone";
import DescriptionIcon from "@mui/icons-material/Description";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
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

const ReportDisaster = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [places, setPlaces] = useState([]);
  const [placeId, setPlaceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "", // "success" or "error"
    message: "",
  });

  // Fetch places
  useEffect(() => {
    axios
      .get("http://localhost:5000/camp/places")
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!details.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "Please enter disaster details",
      });
      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        3000,
      );
      return;
    }

    if (!placeId) {
      setNotification({
        show: true,
        type: "error",
        message: "Please select an affected place",
      });
      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        3000,
      );
      return;
    }

    if (!photo) {
      setNotification({
        show: true,
        type: "error",
        message: "Please upload a disaster photo",
      });
      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        3000,
      );
      return;
    }

    const formData = new FormData();
    formData.append("details", details);
    formData.append("photo", photo);
    formData.append("placeId", placeId);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/camp/disaster",
        formData,
        {
          withCredentials: true,
        },
      );

      // Show success message from backend
      setNotification({
        show: true,
        type: "success",
        message: response.data.message || "Disaster reported successfully",
      });

      // Reset form after delay
      setTimeout(() => {
        setDetails("");
        setPlaceId("");
        setPhoto(null);
        setPhotoPreview(null);
        setNotification({ show: false, type: "", message: "" });
      }, 3000);
    } catch (err) {
      console.error(err);

      // Show error message from backend
      const errorMessage =
        err.response?.data?.message || "Failed to report disaster";

      setNotification({
        show: true,
        type: "error",
        message: errorMessage,
      });

      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        3000,
      );
    } finally {
      setLoading(false);
    }
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
            <div className="text-5xl">
              <WarningAmberTwoToneIcon
                sx={{ width: 38, height: 38, color: "#db1111" }}
              />
            </div>
            Report Disaster
          </h1>
          <p className="text-slate-600 text-lg">
            Submit urgent disaster information and photos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Disaster Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-xl font-bold text-slate-900">
                Disaster Details
              </h2>
            </div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Describe the situation <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe the disaster situation, affected areas, severity, and any immediate needs..."
              rows={5}
            />
            <p className="text-xs text-slate-500 mt-2">
              {details.length} characters
            </p>
          </div>

          {/* Affected Place Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h2 className="text-xl font-bold text-slate-900">
                Affected Place
              </h2>
            </div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select location <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="">Select affected place</option>
              {places.map((place) => (
                <option key={place._id} value={place._id}>
                  {place.place_name}
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-xl font-bold text-slate-900">
                Disaster Photo
              </h2>
            </div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Upload image <span className="text-red-500">*</span>
            </label>

            {!photoPreview ? (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="w-full py-8 border-2 border-dashed border-slate-300 hover:border-purple-400 rounded-lg text-slate-600 hover:bg-purple-50 font-semibold transition-all flex flex-col items-center justify-center gap-3 cursor-pointer"
                >
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-purple-600">Click to upload photo</span>
                  <span className="text-xs text-slate-500">
                    PNG, JPG, GIF up to 10MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border-2 border-slate-300">
                <img
                  src={photoPreview}
                  alt="Disaster preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                  title="Remove photo"
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
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm">
                  {photo?.name}
                </div>
              </div>
            )}
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
              className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Report Disaster
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Sliding Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div
            className={`bg-white rounded-xl shadow-2xl border-l-4 ${
              notification.type === "success"
                ? "border-green-500"
                : "border-red-500"
            } p-4 min-w-[350px] max-w-md`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.type === "success"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
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
                <p className="text-sm text-slate-600">{notification.message}</p>
              </div>
              <button
                onClick={() =>
                  setNotification({ show: false, type: "", message: "" })
                }
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

export default ReportDisaster;
