import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const CenterDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const [centerName, setCenterName] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState("");

  /* ---------- AUTH + PROFILE CHECK ---------- */
  useEffect(() => {
    const checkCenter = async () => {
      try {
        const res = await axios.get("http://localhost:5000/center/home");

        if (res.data.profileCompleted === false) {
          setShowSetupModal(true);
        }

        setLoading(false);
      } catch {
        navigate("/guest/login");
      }
    };

    checkCenter();
  }, [navigate]);

  /* ---------- COMPLETE PROFILE ---------- */
  const submitSetup = async () => {
    if (!centerName || !address || !capacity) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.put("http://localhost:5000/center/complete-profile", {
        name: centerName,
        address,
        capacity,
      });

      alert("Profile completed successfully");
      setShowSetupModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Setup failed");
    }
  };

  /* ---------- LOGOUT ---------- */
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout");
    } catch {}
    navigate("/guest/login");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Loading dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 pointer-events-none"></div>

      {/* MAIN CONTENT */}
      <main className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Center Operations Dashboard</h2>
              <p className="text-slate-400">Manage relief requests, volunteers, and resources from your center</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 rounded-lg transition-all duration-200"
            >
              <span className="text-lg">⎋</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Center Status"
            value="OPEN"
            trend="Operational"
            icon="✓"
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-400"
          />
          <StatCard
            title="Current Capacity"
            value="-- / --"
            trend="Awaiting setup"
            icon="👥"
            iconBg="bg-blue-500/10"
            iconColor="text-blue-400"
          />
          <StatCard
            title="Active Requests"
            value="0"
            trend="Pending review"
            icon="📋"
            iconBg="bg-amber-500/10"
            iconColor="text-amber-400"
          />
          <StatCard
            title="Volunteers"
            value="--"
            trend="Available today"
            icon="🤝"
            iconBg="bg-purple-500/10"
            iconColor="text-purple-400"
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-100">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ActionCard
              icon="📥"
              title="View Requests"
              description="Review and manage incoming relief requests"
              onClick={() => navigate("/center/requests")}
              buttonText="Manage Requests"
            />
            <ActionCard
              icon="⚙️"
              title="Center Profile"
              description="Update center information and settings"
              onClick={() => navigate("/center/profile")}
              buttonText="Edit Profile"
            />
            <ActionCard
              icon="👥"
              title="Volunteer Management"
              description="Assign and track volunteer activities"
              onClick={() => {}}
              buttonText="View Volunteers"
              disabled
            />
            <ActionCard
              icon="📊"
              title="Reports & Analytics"
              description="View performance metrics and statistics"
              onClick={() => {}}
              buttonText="View Reports"
              disabled
            />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-100">Recent Activity</h3>
            <button className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-blue-400 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-all duration-200 uppercase tracking-wide">
              View All
            </button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-12">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-50">📭</div>
              <h4 className="text-xl font-semibold text-slate-300 mb-2">No recent activity</h4>
              <p className="text-slate-500">Your recent actions and updates will appear here</p>
            </div>
          </div>
        </div>
      </main>

      {/* PROFILE SETUP MODAL */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Complete Center Setup</h2>
                </div>
              </div>
              <p className="text-sm text-slate-400">This step is mandatory to continue using the dashboard</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Center Name
                </label>
                <input
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
                  placeholder="Enter your center name"
                  value={centerName}
                  onChange={(e) => setCenterName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Center Address
                </label>
                <input
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
                  placeholder="Enter complete address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Center Capacity
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
                  placeholder="Maximum capacity (number of people)"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700">
              <button
                onClick={submitSetup}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const StatCard = ({ title, value, trend, icon, iconBg, iconColor }) => (
  <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10">
    <div className="flex items-start gap-4">
      <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center text-2xl ${iconColor} group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
          {title}
        </div>
        <div className="text-2xl font-bold text-slate-100 mb-1">
          {value}
        </div>
        <div className="text-sm text-slate-500 font-medium">
          {trend}
        </div>
      </div>
    </div>
  </div>
);

const ActionCard = ({ icon, title, description, onClick, buttonText, disabled }) => (
  <div className={`group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10'}`}>
    <div className="flex items-start gap-4 mb-4">
      <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-bold text-slate-100 mb-1">{title}</h4>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-200 ${
        disabled
          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30'
      }`}
    >
      {buttonText}
    </button>
  </div>
);

export default CenterDashboard;