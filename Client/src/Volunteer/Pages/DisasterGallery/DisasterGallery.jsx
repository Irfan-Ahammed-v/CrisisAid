import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVolunteerTheme } from "../../../context/VolunteerThemeContext";

axios.defaults.withCredentials = true;

const DisasterGallery = () => {
  const { theme } = useVolunteerTheme();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE;
  const isDark = theme === "dark";

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/volunteer/disasters");
      setDisasters(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch disasters", error);
      setLoading(false);
    }
  };

  const filteredDisasters = disasters.filter((d) => {
    if (filter === "all") return true;
    return d.disaster_status === filter;
  });

  const openReport = (disaster) => {
    setSelectedDisaster(disaster);
    setShowModal(true);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={isDark ? "text-slate-400" : "text-slate-500"}>
            Loading disasters...
          </p>
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-[calc(100vh-64px)] font-sans transition-colors duration-300 ${isDark ? "bg-[#0d1117]" : "bg-slate-50"}`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1
              className={`text-4xl font-black tracking-tight mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Disaster Watch
            </h1>
            <p
              className={`${isDark ? "text-slate-400" : "text-slate-600"} text-lg`}
            >
              Real-time monitoring and situational awareness.
            </p>
          </div>

          <div
            className={`flex border rounded-2xl p-1.5 transition-all duration-300 shadow-sm ${
              isDark
                ? "bg-[#161b22] border-[#30363d]"
                : "bg-white border-slate-200"
            }`}
          >
            {["active", "resolved", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === f
                    ? isDark
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10"
                      : "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : isDark
                      ? "text-slate-500 hover:text-slate-300"
                      : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredDisasters.length === 0 ? (
          <div
            className={`border rounded-[2.5rem] p-20 text-center transition-all duration-300 shadow-xl ${
              isDark
                ? "bg-[#161b22] border-[#30363d] shadow-black/20"
                : "bg-white border-slate-200 shadow-slate-200/50"
            }`}
          >
            <div className="text-7xl mb-6">🌪️</div>
            <h3
              className={`text-2xl font-black mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Zero Reports Found
            </h3>
            <p className={isDark ? "text-slate-500" : "text-slate-400"}>
              Currently no {filter} disasters on the grid.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDisasters.map((disaster) => (
              <div
                key={disaster._id}
                className={`border rounded-[2rem] overflow-hidden transition-all duration-300 group shadow-lg flex flex-col ${
                  isDark
                    ? "bg-[#161b22] border-[#30363d] hover:border-emerald-500/30"
                    : "bg-white border-slate-200 hover:border-emerald-300 shadow-slate-200/50"
                }`}
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={`${API_BASE}/uploads/disasters/${disaster.disaster_photo}`}
                    alt={disaster.disaster_details}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-5 right-5">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border shadow-2xl ${
                        disaster.disaster_status === "active"
                          ? "bg-rose-500/20 border-rose-500/50 text-rose-200"
                          : "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                      }`}
                    >
                      {disaster.disaster_status}
                    </span>
                  </div>
                </div>

                <div className="p-2 flex flex-col flex-1">
                  <h3
                    className={`text-xl font-black mb-4 line-clamp-2 leading-tight ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    {disaster.disaster_type.disaster_type_name}
                  </h3>

                  <div className="space-y-3 mb-8 flex-1">
                    <div
                      className={`flex items-center gap-3 text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      <span className="text-lg">📍</span>
                      <span className="truncate">
                        {disaster.place_id?.place_name || "Unknown Location"},{" "}
                        {disaster.district_id?.district_name}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-3 text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      <span className="text-lg">🗓️</span>
                      <span>
                        {new Date(disaster.createdAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "long", year: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openReport(disaster)}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg ${
                      isDark
                        ? "bg-[#0d1117] hover:bg-emerald-500 hover:text-black border-[#30363d] text-slate-300"
                        : "bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-700 border-slate-200"
                    }`}
                  >
                    View Situation Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Situation Report Modal */}
      {showModal && selectedDisaster && (
        <SituationReportModal
          disaster={selectedDisaster}
          onClose={() => setShowModal(false)}
          isDark={isDark}
          API_BASE={API_BASE}
        />
      )}
    </div>
  );
};

const SituationReportModal = ({ disaster, onClose, isDark, API_BASE }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300 border animate-in fade-in zoom-in duration-300 ${
          isDark ? "bg-[#161b22] border-[#30363d]" : "bg-white border-slate-100"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isDark
              ? "bg-black/20 text-white hover:bg-black/40"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
          {/* Hero Section */}
          <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
            <img
              src={`${API_BASE}/uploads/disasters/${disaster.disaster_photo}`}
              className="w-full h-full object-cover"
              alt="Disaster"
            />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-3/5 p-10 flex flex-col">
            <div className="mb-8">
              <span
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border mb-4 inline-block ${
                  disaster.disaster_status === "active"
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                }`}
              >
                {disaster.disaster_status} Incident
              </span>
              <h2
                className={`text-2xl font-black leading-tight mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {disaster.disaster_type.disaster_type_name}
              </h2>
              <p
                className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                {disaster.disaster_details}
              </p>
            </div>

            <div
              className={`grid grid-cols-2 gap-6 p-6 rounded-3xl border mb-8 ${
                isDark
                  ? "bg-[#0d1117] border-[#30363d]"
                  : "bg-slate-50 border-slate-200/60"
              }`}
            >
              <div>
                <Label text="Location" isDark={isDark} />
                <p
                  className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  {disaster.place_id?.place_name}
                  <br />
                  <span className="text-xs font-medium text-slate-500">
                    {disaster.district_id?.district_name}
                  </span>
                </p>
              </div>
              <div>
                <Label text="Reported On" isDark={isDark} />
                <p
                  className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  {new Date(disaster.createdAt).toLocaleDateString("en-IN", {
                    dateStyle: "long",
                  })}
                  <br />
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(disaster.createdAt).toLocaleTimeString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-auto flex gap-4">
              <button
                onClick={onClose}
                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isDark
                    ? "bg-emerald-500 text-black hover:bg-emerald-400"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                Acknowledge Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ text, isDark }) => (
  <span
    className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
  >
    {text}
  </span>
);

export default DisasterGallery;
