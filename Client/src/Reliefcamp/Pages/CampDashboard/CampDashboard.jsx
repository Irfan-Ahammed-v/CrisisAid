import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FestivalIcon from "@mui/icons-material/Festival";
import DescriptionIcon from "@mui/icons-material/Description";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import RestoreTwoToneIcon from "@mui/icons-material/RestoreTwoTone";
import WarningAmberTwoToneIcon from "@mui/icons-material/WarningAmberTwoTone";
import AssignmentTwoToneIcon from "@mui/icons-material/AssignmentTwoTone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BlockIcon from "@mui/icons-material/Block";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import axios from "axios";

axios.defaults.withCredentials = true;

const CampDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ---------- AUTH + DASHBOARD FETCH ---------- */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/camp/home");

        setDashboard(res.data);

        if (!res.data.camp.profileCompleted) {
          setShowSetupModal(true);
        }

        setLoading(false);
      } catch {
        navigate("/guest/login");
      }
    };

    loadDashboard();
  }, [navigate]);

  /* ---------- LOGOUT ---------- */
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout");
    } catch {}
    navigate("/guest/login");
  };

  /* ---------- FILE UPLOAD HANDLER ---------- */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
  };

  const handleSubmitVerification = async () => {
    if (!uploadedFile) {
      alert("Please select a file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("camp_proof", uploadedFile);

    try {
      await axios.post("http://localhost:5000/camp/upload-proof", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Verification document submitted successfully!");
      // Reload dashboard to get updated verification status
      window.location.reload();
    } catch (error) {
      alert("Failed to upload verification document. Please try again.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      emergency: "bg-red-100 text-red-800 border-red-200",
      closed: "bg-slate-100 text-slate-800 border-slate-200",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-blue-100 text-blue-800 border-blue-200"
    );
  };

  const getRequestStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      in_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      fulfilled: "bg-emerald-100 text-emerald-800",
      rejected: "bg-red-100 text-red-800",
      denied: "bg-red-100 text-red-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const { camp, stats, recentRequests } = dashboard;
  const campStatus = camp.camp_status;
  const verificationStatus = camp.verification_status;

  /* ---------- VERIFICATION STATUS: NULL - SHOW UPLOAD SECTION ---------- */
  if (verificationStatus === "null" || verificationStatus === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FestivalIcon
                    sx={{ width: 40, height: 40, color: "#18299c" }}
                  />

                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                      {camp.camp_name}
                    </h1>
                    <p className="text-slate-600 text-sm">
                      Relief Camp Dashboard
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 border-2 border-slate-300 hover:border-red-300 text-slate-700 hover:text-red-600 rounded-lg font-medium transition-all"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Upload Verification Document Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <UploadFileIcon
                  sx={{ width: 48, height: 48, color: "#2563eb" }}
                />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Verification Required
              </h2>
              <p className="text-slate-600 text-lg">
                Please upload your camp verification documents to access the
                dashboard
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Required Documents
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Official camp registration certificate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Government authorization letter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Valid identification documents</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="camp_proof"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label
                  htmlFor="camp_proof"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-16 h-16 text-slate-400 mb-3"
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
                  <span className="text-lg font-semibold text-slate-700 mb-1">
                    Click to upload file
                  </span>
                  <span className="text-sm text-slate-500">
                    PDF, JPG, PNG, DOC (max 10MB)
                  </span>
                </label>
              </div>

              {uploadedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircleOutlineTwoToneIcon sx={{ color: "#16a34a" }} />
                    <div>
                      <p className="font-semibold text-green-900">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-green-700">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-red-600 hover:text-red-700"
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
              )}

              <button
                onClick={handleSubmitVerification}
                disabled={!uploadedFile || uploading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  uploadedFile && !uploading
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Uploading...
                  </span>
                ) : (
                  "Submit for Verification"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- VERIFICATION STATUS: PENDING - SHOW BANNER ---------- */
  if (verificationStatus === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FestivalIcon
                    sx={{ width: 40, height: 40, color: "#18299c" }}
                  />

                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                      {camp.camp_name}
                    </h1>
                    <p className="text-slate-600 text-sm">
                      Relief Camp Dashboard
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 border-2 border-slate-300 hover:border-red-300 text-slate-700 hover:text-red-600 rounded-lg font-medium transition-all"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Pending Verification Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-6">
              <PendingActionsIcon
                sx={{ width: 56, height: 56, color: "#f59e0b" }}
              />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Verification Under Review
            </h2>
            <p className="text-lg text-slate-700 mb-2">
              Your verification documents are currently being reviewed by our
              team.
            </p>
            <p className="text-slate-600 mb-8">
              This process typically takes 24-48 hours. You'll receive a
              notification once your account is verified.
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <svg
                className="w-5 h-5 text-yellow-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold text-yellow-900">
                Dashboard features will be available after approval
              </span>
            </div>

            <div className="mt-8 bg-white rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
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
                What happens next?
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <p className="text-slate-700">
                    Our verification team reviews your submitted documents
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <p className="text-slate-700">
                    You'll receive an email notification with the verification
                    result
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <p className="text-slate-700">
                    Once approved, full dashboard access will be granted
                    immediately
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- VERIFICATION STATUS: REJECTED - SHOW WARNING PAGE ---------- */
  if (verificationStatus === "rejected") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FestivalIcon
                    sx={{ width: 40, height: 40, color: "#18299c" }}
                  />

                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                      {camp.camp_name}
                    </h1>
                    <p className="text-slate-600 text-sm">
                      Relief Camp Dashboard
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 border-2 border-slate-300 hover:border-red-300 text-slate-700 hover:text-red-600 rounded-lg font-medium transition-all"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Rejected Verification Warning */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
              <BlockIcon sx={{ width: 56, height: 56, color: "#dc2626" }} />
            </div>
            <h2 className="text-3xl font-bold text-red-900 mb-3">
              Verification Rejected
            </h2>
            <p className="text-lg text-red-800 mb-2">
              Unfortunately, your verification documents could not be approved
              at this time.
            </p>
            <p className="text-slate-700 mb-8">
              Please review the reasons below and resubmit with corrected
              documentation.
            </p>

            <div className="bg-white rounded-xl p-6 mb-6 text-left max-w-2xl mx-auto">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-600"
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
                Common Rejection Reasons
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Incomplete or unclear documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Expired or invalid identification documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Missing required government authorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Information mismatch between documents</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <UploadFileIcon />
                Resubmit Documents
              </button>
              <a
                href="mailto:support@reliefcamp.org"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold transition-all"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- VERIFICATION STATUS: APPROVED - SHOW FULL DASHBOARD ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FestivalIcon
                  sx={{ width: 40, height: 40, color: "#18299c" }}
                />
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {camp.camp_name}
                  </h1>
                  <p className="text-slate-600 text-sm">
                    Relief Camp Dashboard
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(
                  campStatus,
                )}`}
              >
                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                {campStatus?.toUpperCase() || "ACTIVE"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 border-2 border-slate-300 hover:border-red-300 text-slate-700 hover:text-red-600 rounded-lg font-medium transition-all"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Camp Status"
            value={campStatus?.toUpperCase() || "ACTIVE"}
            icon={
              <FestivalIcon sx={{ width: 38, height: 38, color: "#f5f1f1" }} />
            }
            color="blue"
            subtitle="Current operational status"
          />
          <StatCard
            title="Total Requests"
            value={stats.total}
            icon={
              <DescriptionIcon
                sx={{ width: 38, height: 38, color: "#f5f1f1" }}
              />
            }
            color="purple"
            subtitle="All time submissions"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={
              <HourglassTopTwoToneIcon
                sx={{ width: 38, height: 38, color: "#f5f1f1" }}
              />
            }
            color="yellow"
            subtitle="Awaiting review"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={
              <CheckCircleOutlineTwoToneIcon
                sx={{ width: 38, height: 38, color: "#f5f1f1" }}
              />
            }
            color="green"
            subtitle="Successfully approved"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg
              className="w-7 h-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              title="Submit New Request"
              description="Create a new relief request for supplies or assistance"
              icon={
                <AssignmentTwoToneIcon
                  sx={{ width: 38, height: 38, color: "#0b66de" }}
                />
              }
              gradient="from-blue-500 to-blue-600"
              onClick={() => navigate("/camp/new-request")}
            />
            <ActionCard
              title="Report Disaster"
              description="Report an emergency or disaster incident at the camp"
              icon={
                <WarningAmberTwoToneIcon
                  sx={{ width: 38, height: 38, color: "#db1111" }}
                />
              }
              gradient="from-red-500 to-red-600"
              onClick={() => navigate("/camp/report-disaster")}
            />
            <ActionCard
              title="View My Requests"
              description="Track and manage all submitted requests"
              icon={
                <RestoreTwoToneIcon
                  sx={{ width: 38, height: 38, color: "#13ab4b" }}
                />
              }
              gradient="from-emerald-500 to-emerald-600"
              onClick={() => navigate("/camp/Requests")}
            />
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <svg
                className="w-7 h-7 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Recent Requests
            </h2>
            {recentRequests.length > 0 && (
              <button
                onClick={() => navigate("/camp/Requests")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
              >
                View All
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {recentRequests.length > 0 ? (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <div
                  key={req._id}
                  className="group bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg p-4 transition-all cursor-pointer"
                  onClick={() => navigate(`/camp/request-view/${req._id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-slate-900 font-semibold mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {req.request_details}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${getRequestStatusColor(
                          req.request_status,
                        )}`}
                      >
                        {req.request_status.toUpperCase()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/camp/request-view/${req._id}`);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                      >
                        View Details
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No Requests Yet
              </h3>
              <p className="text-slate-600 mb-6">
                Get started by submitting your first relief request
              </p>
              <button
                onClick={() => navigate("/camp/new-request")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
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
                Create First Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const StatCard = ({ title, value, icon, color, subtitle }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    yellow: "from-yellow-500 to-yellow-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`text-5xl p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} bg-opacity-10 flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
};

const ActionCard = ({ title, description, icon, gradient, onClick }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
    <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
    <div className="p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h4>
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        {description}
      </p>
      <button
        onClick={onClick}
        className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]`}
      >
        Continue
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
);

export default CampDashboard;
