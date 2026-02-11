import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const VolunteerDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [availability, setAvailability] = useState(true);

  const [photo, setPhoto] = useState(null);
  const [proof, setProof] = useState(null);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
const [tasks, setTasks] = useState([]);

  /* ---------- AUTH + PROFILE CHECK ---------- */
useEffect(() => {
  const checkVolunteer = async () => {
    try {
      // 1️⃣ Volunteer auth + profile
      const res = await axios.get("http://localhost:5000/volunteer/home");

      if (res.data.profileCompleted === false) {
        setShowSetupModal(true);
      }

      setAvailability(res.data.volunteer.availability);

      // 2️⃣ Fetch assigned tasks
      const taskRes = await axios.get(
        "http://localhost:5000/volunteer/tasks"
      );
      setTasks(taskRes.data);

      setLoading(false);
    } catch {
      navigate("/guest/login");
    }
  };

  checkVolunteer();
}, [navigate]);


  /* ---------- FILE HANDLERS ---------- */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProof(file);
    setProofPreview(URL.createObjectURL(file));
  };

  /* ---------- COMPLETE PROFILE ---------- */
  const submitProfile = async () => {
    if (!photo || !proof) {
      alert("Photo and proof are required");
      return;
    }

    const formData = new FormData();
    formData.append("volunteer_photo", photo);
    formData.append("volunteer_proof", proof);

    try {
      await axios.put(
        "http://localhost:5000/volunteer/complete-profile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Profile completed successfully");
      setShowSetupModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
          <p className="text-slate-400 mt-1">
            View your assigned tasks and availability
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard label="Assigned Tasks" value="0" />
          <StatCard label="Completed Tasks" value="0" />
        </div>

        {/* AVAILABILITY TOGGLE */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Availability Status</h3>
            <p className="text-slate-400 text-sm mt-1">
              {availability
                ? "You are available for new assignments"
                : "You are currently unavailable"}
            </p>
          </div>

          <button
            onClick={async () => {
              try {
                const res = await axios.patch(
                  "http://localhost:5000/volunteer/toggle-availability"
                );
                setAvailability(res.data.availability);
              } catch {
                alert("Failed to update availability");
              }
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition
              ${
                availability
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
          >
            {availability ? "ACTIVE" : "INACTIVE"}
          </button>
        </div>

        {/* TASKS */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Active Assignments
          </h2>

          <div className="space-y-6">
  {tasks.length === 0 ? (
    <EmptyState />
  ) : (
    tasks.map((task) => (
      <TaskCard
        key={task._id}
        task={task}
        refreshTasks={async () => {
          const taskRes = await axios.get(
            "http://localhost:5000/volunteer/tasks"
          );
          setTasks(taskRes.data);
        }}
      />
    ))
  )}
</div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <QuickAction label="Task History" icon="📊" />
            <QuickAction label="Contact Center" icon="💬" />
            <QuickAction label="Availability" icon="⚙️" />
          </div>
        </div>
      </div>

      {/* PROFILE COMPLETION MODAL */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 w-full max-w-md rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-2">
              Complete Volunteer Profile
            </h3>
            <p className="text-slate-400 mb-4">
              Upload your photo and proof to continue
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    className="mt-2 h-28 rounded-lg object-cover"
                  />
                )}
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProofChange}
                />
                {proofPreview && (
                  <img
                    src={proofPreview}
                    className="mt-2 h-28 rounded-lg object-cover"
                  />
                )}
              </div>
            </div>

            <button
              onClick={submitProfile}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const StatCard = ({ label, value }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
    <p className="text-slate-400 text-sm uppercase">{label}</p>
    <h3 className="text-3xl font-bold mt-2">{value}</h3>
  </div>
);

const EmptyState = () => (
  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center text-slate-400">
    No active assignments yet.
  </div>
);

const QuickAction = ({ label, icon }) => (
  <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 text-center hover:border-blue-600 transition">
    <div className="text-3xl mb-2">{icon}</div>
    <p className="font-semibold text-sm">{label}</p>
  </div>
);

const TaskCard = ({ task, refreshTasks }) => {
  const [proof, setProof] = useState(null);
  const [remark, setRemark] = useState(task.remarks || "");
  const [saving, setSaving] = useState(false);

  const submitCompletion = async () => {
    if (!proof) {
      alert("Please upload proof image");
      return;
    }

    const formData = new FormData();
    formData.append("proof", proof);

    try {
      await axios.patch(
        `http://localhost:5000/volunteer/tasks/${task._id}/complete`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      refreshTasks();
    } catch {
      alert("Failed to complete task");
    }
  };

  const saveRemark = async () => {
    if (!remark.trim()) {
      alert("Remark cannot be empty");
      return;
    }

    setSaving(true);
    try {
      await axios.patch(
        `http://localhost:5000/volunteer/tasks/${task._id}/remark`,
        { remark }
      );
      refreshTasks();
    } catch {
      alert("Failed to save remark");
    }
    setSaving(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
      <p className="text-sm text-slate-400">
        Disaster: {task.disaster_id?.disaster_name || "N/A"}
      </p>

      <p className="font-semibold">
        Status:{" "}
        <span className="uppercase text-blue-400">
          {task.task_status}
        </span>
      </p>

      {/* REMARKS */}
      {(task.task_status === "accepted" ||
        task.task_status === "completed") && (
        <div className="space-y-2">
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm"
            rows="3"
            placeholder="Add remarks / notes for this task"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          <button
            onClick={saveRemark}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Remark"}
          </button>
        </div>
      )}

      {/* COMPLETE TASK */}
      {task.task_status === "accepted" && (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProof(e.target.files[0])}
          />

          <button
            onClick={submitCompletion}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
          >
            Complete Task
          </button>
        </div>
      )}

      {task.task_status === "completed" && (
        <p className="text-green-400 font-semibold">
          Task Completed ✅
        </p>
      )}
    </div>
  );
};



export default VolunteerDashboard;
