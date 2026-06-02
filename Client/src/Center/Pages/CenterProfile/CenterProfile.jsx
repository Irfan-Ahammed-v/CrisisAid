import { useState, useEffect } from "react";
import axios from "axios";
import { useCenterToast } from "../../context/CenterToastContext";

axios.defaults.withCredentials = true;

// ── Status Badge ──────────────────────────────────────────────
const STATUS_CFG = {
  OPEN:   { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20", label: "Open" },
  FULL:   { dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10",   ring: "ring-amber-400/20",   label: "Full" },
  CLOSED: { dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/10",     ring: "ring-red-400/20",     label: "Closed" },
};

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${c.bg} ${c.text} ${c.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ── Editable Field ────────────────────────────────────────────
function EditField({ label, value, type = "text", onChange, disabled, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`bg-[#0d1117] border rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200
          ${disabled
            ? "border-[#21262d] text-slate-500 cursor-not-allowed"
            : "border-[#30363d] text-slate-200 hover:border-[#484f58] focus:border-amber-400/60 focus:shadow-[0_0_0_3px_rgba(232,162,62,0.07)]"
          }`}
        style={{ fontFamily: type === "email" ? "'DM Mono',monospace" : "'DM Sans',sans-serif", fontSize: type === "email" ? "13px" : undefined }}
      />
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────
function ConfirmModal({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={onCancel}>
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-sm p-7 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl bg-amber-400/10">💾</div>
        <h3 className="font-bold text-xl text-slate-100 mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>Save Changes?</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Your profile updates will be saved and reflected immediately.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#21262d] text-slate-400 hover:text-slate-200 hover:bg-[#2d333b] border border-[#30363d] transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 transition-all">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status Change Modal ───────────────────────────────────────
function StatusModal({ open, current, onSelect, onCancel }) {
  if (!open) return null;
  const options = ["OPEN", "FULL", "CLOSED"];
  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={onCancel}>
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-xs p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
        <h3 className="font-bold text-lg text-slate-100 mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>Change Status</h3>
        <p className="text-slate-500 text-xs mb-5">Select the new operational status for this center</p>
        <div className="flex flex-col gap-2">
          {options.map((s) => {
            const c = STATUS_CFG[s];
            return (
              <button key={s} onClick={() => onSelect(s)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all text-left
                  ${current === s
                    ? `${c.bg} ${c.text} ${c.ring} ring-1 border-transparent`
                    : "bg-[#21262d] border-[#30363d] text-slate-400 hover:border-[#484f58] hover:text-slate-200"}`}>
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                {c.label}
                {current === s && <span className="ml-auto text-xs opacity-60">current</span>}
              </button>
            );
          })}
        </div>
        <button onClick={onCancel}
          className="w-full mt-4 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#21262d] text-slate-500 hover:text-slate-300 border border-[#30363d] transition-all">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Info Row (read-only) ──────────────────────────────────────
function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-[#21262d] last:border-0">
      <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex-shrink-0 mt-0.5">{label}</span>
      <span className={`text-sm text-slate-300 text-right ${mono ? "font-mono" : ""}`}>{value || "—"}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function CenterProfile() {
  const addToast = useCenterToast();

  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  // Password Update State
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [updatingPass, setUpdatingPass] = useState(false);

  useEffect(() => {
    fetchCenter();
  }, []);

  const fetchCenter = async () => {
    try {
      const res = await axios.get("http://localhost:5000/center/home");
      setCenter(res.data.center);
      setLoading(false);
    } catch (err) {
      addToast("error", "Failed to load center data.");
      setLoading(false);
    }
  };

  function startEdit() {
    setDraft({ ...center });
    setEditing(true);
  }

  function cancelEdit() {
    setDraft(null);
    setEditing(false);
  }

  function handleSave() {
    setShowConfirm(true);
  }

  async function confirmSave() {
    if (!draft.center_name?.trim()) { addToast("error", "Center name is required."); setShowConfirm(false); return; }
    if (!draft.center_address?.trim()) { addToast("error", "Address is required."); setShowConfirm(false); return; }

    try {
      const res = await axios.put("http://localhost:5000/center/complete-profile", {
        name: draft.center_name,
        address: draft.center_address
      });
      setCenter(res.data.center);
      setEditing(false);
      setDraft(null);
      setShowConfirm(false);
      addToast("success", "Profile updated successfully.");
    } catch (err) {
      addToast("error", err.response?.data?.message || "Failed to update profile.");
      setShowConfirm(false);
    }
  }

  async function handleStatusChange(newStatus) {
    try {
      await axios.put("http://localhost:5000/center/update-status", { status: newStatus });
      setCenter((c) => ({ ...c, center_status: newStatus }));
      setShowStatus(false);
      addToast("success", `Status changed to "${STATUS_CFG[newStatus].label}".`);
    } catch (err) {
      addToast("error", "Failed to update status.");
    }
  }

  async function handleUpdatePassword() {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
        return addToast("error", "Please fill all password fields.");
    }
    if (passwords.new !== passwords.confirm) {
        return addToast("error", "New passwords do not match.");
    }

    setUpdatingPass(true);
    try {
      await axios.put("http://localhost:5000/center/update-password", {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      addToast("success", "Password updated successfully.");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      addToast("error", err.response?.data?.message || "Failed to update password.");
    } finally {
      setUpdatingPass(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const active = editing ? draft : center;
  const setField = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }));

  const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const initials = (center.center_name || "??").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #0d1117; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
        @keyframes toastIn { from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        .fu { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div className="min-h-screen bg-[#0d1117] text-slate-300">
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(232,162,62,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,162,62,0.025) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

          <div className="fu mb-8" style={{ animationDelay: "0ms" }}>
            <h1 className="text-[2rem] font-bold text-slate-100 leading-none" style={{ fontFamily: "'Playfair Display',serif" }}>
              Center Profile
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">Manage your relief center's information and operational status</p>
          </div>

          <div className="grid grid-cols-3 gap-5">

            {/* ── LEFT COLUMN ───────────────────────────── */}
            <div className="col-span-1 flex flex-col gap-5">

              <div className="fu bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl" style={{ animationDelay: "40ms" }}>
                <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-transparent" />
                <div className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#21262d] to-[#161b22] border border-[#30363d] flex items-center justify-center text-2xl font-bold text-slate-300 shadow-inner"
                      style={{ fontFamily: "'Playfair Display',serif" }}>
                      {initials}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#161b22] flex items-center justify-center text-xs
                      ${center.profileCompleted ? "bg-emerald-500" : "bg-slate-600"}`}>
                      {center.profileCompleted ? "✓" : "!"}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-100 leading-snug" style={{ fontFamily: "'Playfair Display',serif" }}>
                      {center.center_name || "Unnamed Center"}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{center.district_id?.district_name || "District Not Set"}</p>
                  </div>

                  <StatusBadge status={center.center_status} />

                  <button onClick={() => setShowStatus(true)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs font-semibold bg-[#21262d] text-slate-400 border border-[#30363d] hover:border-[#484f58] hover:text-slate-200 transition-all">
                    ⚙ Change Status
                  </button>
                </div>
              </div>

              <div className="fu bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-xl" style={{ animationDelay: "100ms" }}>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">System Info</p>
                <div>
                  <InfoRow label="ID" value={center._id.slice(-8) + "..."} mono />
                  <InfoRow label="Created" value={fmtDate(center.createdAt)} />
                  <InfoRow label="Last Updated" value={fmtDate(center.updatedAt)} />
                  <InfoRow label="Profile" value={center.profileCompleted ? "Complete ✓" : "Incomplete"} />
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ──────────────────────────── */}
            <div className="col-span-2 flex flex-col gap-5">

              <div className="fu bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl overflow-hidden" style={{ animationDelay: "40ms" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#21262d]">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Center Information</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {editing ? "Editing mode — make your changes below" : "Click Edit to update center details"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {editing ? (
                      <>
                        <button onClick={cancelEdit}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#21262d] text-slate-400 border border-[#30363d] hover:text-slate-200 hover:border-[#484f58] transition-all">
                          Cancel
                        </button>
                        <button onClick={handleSave}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 transition-all flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button onClick={startEdit}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#21262d] text-slate-300 border border-[#30363d] hover:border-amber-400/40 hover:text-amber-400 transition-all flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {editing && (
                  <div className="h-0.5 bg-gradient-to-r from-amber-400/60 via-amber-400/20 to-transparent" />
                )}

                <div className="p-6 grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <EditField
                      label="Center Name"
                      value={active.center_name || ""}
                      onChange={setField("center_name")}
                      disabled={!editing}
                      placeholder="Enter center name"
                    />
                  </div>
                  <div className="col-span-2">
                    <EditField
                      label="Address"
                      value={active.center_address || ""}
                      onChange={setField("center_address")}
                      disabled={!editing}
                      placeholder="Enter full address"
                    />
                  </div>

                </div>
              </div>

              <div className="fu bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl overflow-hidden" style={{ animationDelay: "70ms" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#21262d]">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Security</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Update your account password</p>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-2 gap-5">
                  <PasswordField 
                    label="Current Password" 
                    placeholder="Enter current password" 
                    value={passwords.current}
                    onChange={(v) => setPasswords(p => ({ ...p, current: v }))}
                  />
                  <div />
                  <PasswordField 
                    label="New Password" 
                    placeholder="Enter new password" 
                    value={passwords.new}
                    onChange={(v) => setPasswords(p => ({ ...p, new: v }))}
                  />
                  <PasswordField 
                    label="Confirm Password" 
                    placeholder="Confirm new password" 
                    value={passwords.confirm}
                    onChange={(v) => setPasswords(p => ({ ...p, confirm: v }))}
                  />
                  <div className="col-span-2 flex justify-end">
                    <button 
                      onClick={handleUpdatePassword}
                      disabled={updatingPass}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#21262d] text-slate-300 border border-[#30363d] hover:border-amber-400/40 hover:text-amber-400 transition-all disabled:opacity-50">
                      {updatingPass ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="relative z-10 border-t border-[#21262d] mt-4">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-400" style={{ fontFamily: "'DM Sans',sans-serif" }}>CrisisAid Relief Network</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs text-slate-600">Center Management Portal</span>
              <span className="text-xs text-slate-700">·</span>
              <span className="text-xs text-slate-600">v1.0</span>
            </div>
          </div>
        </footer>
      </div>

      <ConfirmModal open={showConfirm} onConfirm={confirmSave} onCancel={() => setShowConfirm(false)} />
      <StatusModal open={showStatus} current={center.center_status} onSelect={handleStatusChange} onCancel={() => setShowStatus(false)} />
    </>
  );
}

// ── Password Field ────────────────────────────────────────────
function PasswordField({ label, placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-200 outline-none transition-all hover:border-[#484f58] focus:border-amber-400/60 focus:shadow-[0_0_0_3px_rgba(232,162,62,0.07)]"
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-xs">
          {show ? "🙈" : "👁"}
        </button>
      </div>
    </div>
  );
}
