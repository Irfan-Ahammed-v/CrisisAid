import { useState } from "react";

// ── Mock Data ─────────────────────────────────────────────────
const initialCenter = {
  _id: "6642b1f2e4b09c1a4fd2c001",
  center_name: "Ernakulam Central Relief Hub",
  center_address: "Near District Collectorate, MG Road, Ernakulam, Kerala - 682011",
  center_email: "ernakulam.hub@relief.gov.in",
  center_capacity: 500,
  current_occupancy: 318,
  district: "Ernakulam",
  center_status: "OPEN",
  profileCompleted: true,
  createdAt: "2024-11-15T08:00:00Z",
  updatedAt: "2025-03-18T14:22:00Z",
};

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

// ── Capacity Ring ─────────────────────────────────────────────
function CapacityRing({ current, max }) {
  const pct = Math.min((current / max) * 100, 100);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  const color = pct >= 90 ? "#f87171" : pct >= 70 ? "#fb923c" : "#34d399";
  const trackColor = "rgba(255,255,255,0.06)";

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} fill="none" stroke={trackColor} strokeWidth="10" />
        <circle
          cx="72" cy="72" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)", filter: `drop-shadow(0 0 6px ${color}55)` }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-2xl font-bold text-slate-100" style={{ fontFamily: "'DM Mono',monospace" }}>
          {Math.round(pct)}%
        </div>
        <div className="text-xs text-slate-500 mt-0.5">capacity</div>
      </div>
    </div>
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

// ── Toast ─────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border backdrop-blur-sm pointer-events-auto
            ${t.type === "success" ? "bg-emerald-950/90 border-emerald-700/40 text-emerald-300" : "bg-red-950/90 border-red-700/40 text-red-300"}`}
          style={{ animation: "toastIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
          <span className="text-base flex-shrink-0">{t.type === "success" ? "✅" : "❌"}</span>
          {t.message}
        </div>
      ))}
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
  const [center, setCenter] = useState(initialCenter);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [toasts, setToasts] = useState([]);

  const pct = Math.min(Math.round((center.current_occupancy / center.center_capacity) * 100), 100);

  function addToast(type, message) {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }

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

  function confirmSave() {
    // Validate
    if (!draft.center_name?.trim()) { addToast("error", "Center name is required."); setShowConfirm(false); return; }
    if (!draft.center_address?.trim()) { addToast("error", "Address is required."); setShowConfirm(false); return; }
    if (!draft.center_capacity || draft.center_capacity < 1) { addToast("error", "Capacity must be at least 1."); setShowConfirm(false); return; }

    setCenter({ ...draft, profileCompleted: true, updatedAt: new Date().toISOString() });
    setEditing(false);
    setDraft(null);
    setShowConfirm(false);
    addToast("success", "Profile updated successfully.");
  }

  function handleStatusChange(newStatus) {
    setCenter((c) => ({ ...c, center_status: newStatus, updatedAt: new Date().toISOString() }));
    setShowStatus(false);
    addToast("success", `Status changed to "${STATUS_CFG[newStatus].label}".`);
  }

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
        {/* Grid texture */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(232,162,62,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,162,62,0.025) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

          {/* ── Page Title ── */}
          <div className="fu mb-8" style={{ animationDelay: "0ms" }}>
            <h1 className="text-[2rem] font-bold text-slate-100 leading-none" style={{ fontFamily: "'Playfair Display',serif" }}>
              Center Profile
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">Manage your relief center's information and operational status</p>
          </div>

          <div className="grid grid-cols-3 gap-5">

            {/* ── LEFT COLUMN ───────────────────────────── */}
            <div className="col-span-1 flex flex-col gap-5">

              {/* Identity card */}
              <div className="fu bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl" style={{ animationDelay: "40ms" }}>
                {/* Amber accent stripe */}
                <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-transparent" />
                <div className="p-6 flex flex-col items-center text-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#21262d] to-[#161b22] border border-[#30363d] flex items-center justify-center text-2xl font-bold text-slate-300 shadow-inner"
                      style={{ fontFamily: "'Playfair Display',serif" }}>
                      {initials}
                    </div>
                    {/* Profile complete dot */}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#161b22] flex items-center justify-center text-xs
                      ${center.profileCompleted ? "bg-emerald-500" : "bg-slate-600"}`}>
                      {center.profileCompleted ? "✓" : "!"}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-100 leading-snug" style={{ fontFamily: "'Playfair Display',serif" }}>
                      {center.center_name || "Unnamed Center"}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{center.district}</p>
                  </div>

                  <StatusBadge status={center.center_status} />

                  <button onClick={() => setShowStatus(true)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs font-semibold bg-[#21262d] text-slate-400 border border-[#30363d] hover:border-[#484f58] hover:text-slate-200 transition-all">
                    ⚙ Change Status
                  </button>
                </div>
              </div>

              {/* Capacity card */}
              <div className="fu bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl flex flex-col items-center gap-4" style={{ animationDelay: "70ms" }}>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold self-start">Occupancy</p>
                <CapacityRing current={center.current_occupancy} max={center.center_capacity} />
                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-slate-100" style={{ fontFamily: "'DM Mono',monospace" }}>{center.current_occupancy}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Current</div>
                  </div>
                  <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-slate-100" style={{ fontFamily: "'DM Mono',monospace" }}>{center.center_capacity}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Capacity</div>
                  </div>
                </div>
                {/* Capacity bar */}
                <div className="w-full">
                  <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                    <span>0</span><span>{center.center_capacity}</span>
                  </div>
                  <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 90 ? "#f87171" : pct >= 70 ? "#fb923c" : "#34d399",
                        boxShadow: `0 0 8px ${pct >= 90 ? "#f8717155" : pct >= 70 ? "#fb923c55" : "#34d39955"}`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 text-right font-mono">{center.center_capacity - center.current_occupancy} slots available</p>
                </div>
              </div>

              {/* Meta card */}
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

              {/* Profile form card */}
              <div className="fu bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl overflow-hidden" style={{ animationDelay: "40ms" }}>
                {/* Card header */}
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

                {/* Edit indicator bar */}
                {editing && (
                  <div className="h-0.5 bg-gradient-to-r from-amber-400/60 via-amber-400/20 to-transparent" />
                )}

                {/* Fields */}
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
                  <div>
                    <EditField
                      label="Email"
                      value={active.center_email || ""}
                      type="email"
                      onChange={setField("center_email")}
                      disabled={!editing}
                      placeholder="center@email.com"
                    />
                  </div>
                  <div>
                    <EditField
                      label="Capacity"
                      value={active.center_capacity || ""}
                      type="number"
                      onChange={(v) => setField("center_capacity")(Number(v))}
                      disabled={!editing}
                      placeholder="e.g. 500"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold block mb-1.5">District</label>
                    <div className="bg-[#0d1117] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed">
                      {center.district}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold block mb-1.5">Current Occupancy</label>
                    <div className="bg-[#0d1117] border border-[#21262d] rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed font-mono">
                      {center.current_occupancy} persons
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password card */}
              <div className="fu bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl overflow-hidden" style={{ animationDelay: "70ms" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#21262d]">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Security</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Update your account password</p>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-2 gap-5">
                  <PasswordField label="Current Password" placeholder="Enter current password" />
                  <div />
                  <PasswordField label="New Password" placeholder="Enter new password" />
                  <PasswordField label="Confirm Password" placeholder="Confirm new password" />
                  <div className="col-span-2 flex justify-end">
                    <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#21262d] text-slate-300 border border-[#30363d] hover:border-amber-400/40 hover:text-amber-400 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="fu bg-[#161b22] border border-red-900/30 rounded-2xl shadow-xl overflow-hidden" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-red-900/20">
                  <div>
                    <h3 className="text-sm font-bold text-red-400">Danger Zone</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Irreversible actions — proceed with caution</p>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Deactivate Center</p>
                    <p className="text-xs text-slate-500 mt-0.5">Temporarily close this center and stop all operations</p>
                  </div>
                  <button className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-400/10 text-red-400 ring-1 ring-red-400/20 hover:bg-red-500 hover:text-white hover:ring-red-500 transition-all">
                    Deactivate
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modals & Toast */}
      <ConfirmModal open={showConfirm} onConfirm={confirmSave} onCancel={() => setShowConfirm(false)} />
      <StatusModal open={showStatus} current={center.center_status} onSelect={handleStatusChange} onCancel={() => setShowStatus(false)} />
      <Toast toasts={toasts} />
    </>
  );
}

// ── Password Field ────────────────────────────────────────────
function PasswordField({ label, placeholder }) {
  const [show, setShow] = useState(false);
  const [val, setVal] = useState("");
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={val}
          onChange={(e) => setVal(e.target.value)}
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