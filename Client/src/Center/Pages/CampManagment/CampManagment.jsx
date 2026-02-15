import { useState, useMemo, useRef, useEffect } from "react";

const initialCamps = [
  {
    _id: "6642a3f1e4b09c1a4fd2b001",
    camp_name: "Sunrise Relief Camp",
    camp_details: "A fully equipped relief camp with medical facilities, clean water supply, and emergency supplies for displaced families. Capacity for 250 individuals with separate dormitories.",
    camp_address: "Near St. Mary's Church, MG Road, Ernakulam",
    camp_email: "sunrise.camp@relief.in",
    district: "Ernakulam",
    place: "MG Road",
    verification_status: "pending",
    camp_status: "inactive",
    current_occupancy: 0,
    camp_proof: "proof_sunrise.pdf",
    createdAt: "2025-03-10T08:22:00Z",
  },
  {
    _id: "6642a3f1e4b09c1a4fd2b002",
    camp_name: "Blue Shield Camp",
    camp_details: "Operated by local NGO. Provides shelter, food distribution, and first aid. Staffed 24/7 with trained volunteers and medical professionals.",
    camp_address: "Vadakkechira, Thrissur District",
    camp_email: "blueshield@ngo.org",
    district: "Thrissur",
    place: "Vadakkechira",
    verification_status: "approved",
    camp_status: "active",
    current_occupancy: 87,
    camp_proof: "proof_blue.pdf",
    createdAt: "2025-02-28T14:10:00Z",
  },
  {
    _id: "6642a3f1e4b09c1a4fd2b003",
    camp_name: "Haven Community Center",
    camp_details: "Multi-purpose community center adapted as relief camp. Has kitchen facility, sleeping areas for 150 persons, and sanitation blocks.",
    camp_address: "Beypore Road, Kozhikode",
    camp_email: "haven.cc@gmail.com",
    district: "Kozhikode",
    place: "Beypore Road",
    verification_status: "pending",
    camp_status: "inactive",
    current_occupancy: 0,
    camp_proof: null,
    createdAt: "2025-03-15T09:45:00Z",
  },
  {
    _id: "6642a3f1e4b09c1a4fd2b004",
    camp_name: "Green Valley Shelter",
    camp_details: "Government-aided camp with coordinated disaster response team. Includes a triage unit and dedicated children's zone.",
    camp_address: "Revenue Colony, Thrissur",
    camp_email: "greenvalley.shelter@gov.in",
    district: "Thrissur",
    place: "Revenue Colony",
    verification_status: "rejected",
    camp_status: "inactive",
    current_occupancy: 0,
    camp_proof: "proof_green.pdf",
    createdAt: "2025-01-20T11:00:00Z",
  },
  {
    _id: "6642a3f1e4b09c1a4fd2b005",
    camp_name: "Coastal Aid Point",
    camp_details: "Strategically located near coastal area for rapid deployment during floods and cyclones. Mobile medical unit on-site.",
    camp_address: "Chellanam, Ernakulam",
    camp_email: "coastalaid@rescue.in",
    district: "Ernakulam",
    place: "Chellanam",
    verification_status: "approved",
    camp_status: "active",
    current_occupancy: 145,
    camp_proof: "proof_coastal.pdf",
    createdAt: "2025-02-05T07:30:00Z",
  },
  {
    _id: "6642a3f1e4b09c1a4fd2b006",
    camp_name: "Mountview Aid Station",
    camp_details: "Camp established in a school building during flood relief. Accommodates 200 persons. Registration under review by district collector.",
    camp_address: "Munnar Road, Idukki",
    camp_email: "mountview.aid@camp.in",
    district: "Idukki",
    place: "Munnar Road",
    verification_status: "pending",
    camp_status: "inactive",
    current_occupancy: 0,
    camp_proof: "proof_mount.pdf",
    createdAt: "2025-03-18T16:20:00Z",
  },
];

// ── Badges ─────────────────────────────────────────────────────
const V_BADGE = {
  pending:  { label: "Pending",     dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-400/10",   ring: "ring-amber-400/20" },
  approved: { label: "Approved",    dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20" },
  rejected: { label: "Rejected",    dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-400/10",     ring: "ring-red-400/20" },
  null:     { label: "Unsubmitted", dot: "bg-slate-500",   text: "text-slate-400",   bg: "bg-slate-700/40",   ring: "ring-slate-600/20" },
};
const S_BADGE = {
  active:   { label: "Active",   dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20" },
  inactive: { label: "Inactive", dot: "bg-slate-500",   text: "text-slate-400",  bg: "bg-slate-700/40",  ring: "ring-slate-600/20" },
};

function VBadge({ status }) {
  const c = V_BADGE[status] || V_BADGE.null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${c.bg} ${c.text} ${c.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
function SBadge({ status }) {
  const c = S_BADGE[status] || S_BADGE.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${c.bg} ${c.text} ${c.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ── Professional Search Bar ────────────────────────────────────
function SearchBar({ value, onChange, resultCount, total }) {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); inputRef.current?.focus(); }
      if (e.key === "Escape") inputRef.current?.blur();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-[#161b22]
      ${focused
        ? "border-amber-400/50 shadow-[0_0_0_3px_rgba(232,162,62,0.07)] w-96"
        : "border-[#30363d] hover:border-[#484f58] w-80"}`}>

      {/* Search icon */}
      <div className="absolute left-3.5 pointer-events-none">
        <svg className={`w-3.5 h-3.5 transition-colors duration-150 ${focused ? "text-amber-400" : "text-slate-500"}`}
          fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search name, district..."
        className="w-full bg-transparent pl-9 pr-24 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none"
        style={{ fontFamily: "'DM Sans',sans-serif" }}
      />

      {/* Right slot */}
      <div className="absolute right-3 flex items-center gap-1.5">
        {value ? (
          <>
            <span className="text-xs font-mono text-slate-500 tabular-nums pointer-events-none">
              {resultCount}/{total}
            </span>
            <button
              onMouseDown={(e) => { e.preventDefault(); onChange(""); }}
              className="flex items-center justify-center w-4 h-4 rounded-full bg-[#30363d] hover:bg-[#484f58] transition-colors">
              <svg className="w-2.5 h-2.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </>
        ) : (
          <kbd className={`pointer-events-none flex items-center px-1.5 py-0.5 rounded-md text-xs font-mono border transition-colors duration-150
            ${focused ? "border-amber-400/25 text-amber-400/50 bg-amber-400/5" : "border-[#30363d] text-slate-600 bg-[#21262d]"}`}>
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
}

// ── Occupancy Bar ──────────────────────────────────────────────
function OccupancyBar({ value, max = 250 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-[#21262d] rounded-full overflow-hidden">
        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-500">{value}</span>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border backdrop-blur-sm pointer-events-auto
            ${t.type === "success"
              ? "bg-emerald-950/90 border-emerald-700/40 text-emerald-300"
              : "bg-red-950/90 border-red-700/40 text-red-300"}`}
          style={{ animation: "toastIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
          <span className="text-base flex-shrink-0">{t.type === "success" ? "✅" : "❌"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────
function ConfirmModal({ open, type, campName, onConfirm, onCancel }) {
  if (!open) return null;
  const isApprove = type === "approve";
  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-6"
      onClick={onCancel}>
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-sm p-7 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl
          ${isApprove ? "bg-emerald-400/10" : "bg-red-400/10"}`}>
          {isApprove ? "✅" : "❌"}
        </div>
        <h3 className="font-bold text-xl text-slate-100 mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
          {isApprove ? "Approve Camp?" : "Reject Camp?"}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {isApprove
            ? `"${campName}" will be approved and eligible for activation.`
            : `"${campName}" will be rejected. This can be reversed later.`}
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#21262d] text-slate-400 hover:text-slate-200 hover:bg-[#2d333b] border border-[#30363d] transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg
              ${isApprove
                ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/25"
                : "bg-red-500 hover:bg-red-400 text-white shadow-red-500/25"}`}>
            {isApprove ? "✓ Approve" : "✕ Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────
function DetailModal({ camp, open, onClose, onApprove, onReject }) {
  if (!open || !camp) return null;
  const date = new Date(camp.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-40 flex items-center justify-center p-6"
      onClick={onClose}>
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>

        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-[#21262d]">
          <div className="w-11 h-11 rounded-xl bg-amber-400/10 flex items-center justify-center text-xl flex-shrink-0">🏕️</div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-100 truncate" style={{ fontFamily: "'Playfair Display',serif" }}>
              {camp.camp_name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">ID: {camp._id}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all flex-shrink-0 text-sm">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-2 gap-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">District</p>
            <p className="text-sm text-slate-200">{camp.district}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Place</p>
            <p className="text-sm text-slate-200">{camp.place || "—"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Address</p>
            <p className="text-sm text-slate-200">{camp.camp_address}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Email</p>
            <p className="text-sm text-slate-300 font-mono">{camp.camp_email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Registered On</p>
            <p className="text-sm text-slate-300 font-mono">{date}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Occupancy</p>
            <p className="text-sm text-slate-200">{camp.current_occupancy} persons</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Proof Document</p>
            {camp.camp_proof
              ? <a href="#" onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 bg-blue-400/10 ring-1 ring-blue-400/20 px-2.5 py-1.5 rounded-lg hover:bg-blue-400/20 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {camp.camp_proof}
                </a>
              : <span className="text-xs text-slate-500 italic">No proof uploaded</span>}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1.5">Verification</p>
            <VBadge status={camp.verification_status} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1.5">Camp Status</p>
            <SBadge status={camp.camp_status} />
          </div>
          <div className="col-span-2">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Camp Details</p>
            <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 text-sm text-slate-400 leading-relaxed">
              {camp.camp_details}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#21262d]">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-[#21262d] text-slate-400 hover:text-slate-200 border border-[#30363d] hover:bg-[#2d333b] transition-all">
            Close
          </button>
          {camp.verification_status !== "rejected" && (
            <button onClick={onReject}
              className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 bg-red-400/10 text-red-400 ring-1 ring-red-400/20 hover:bg-red-500 hover:text-white hover:ring-red-500 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
              Reject
            </button>
          )}
          {camp.verification_status !== "approved" && (
            <button onClick={onApprove}
              className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Approve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
const TABS = [
  { key: "all",      label: "All" },
  { key: "pending",  label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const TH = ["Camp", "Location", "Occupancy", "Verification", "Camp Status", "Proof", "Registered", "Actions"];

export default function CampManagment() {
  const [camps, setCamps]           = useState(initialCamps);
  const [tab, setTab]               = useState("all");
  const [search, setSearch]         = useState("");
  const [district, setDistrict]     = useState("all");
  const [detailCamp, setDetailCamp] = useState(null);
  const [confirm, setConfirm]       = useState({ open: false, type: null, campId: null });
  const [toasts, setToasts]         = useState([]);

  const districts = useMemo(() => [...new Set(camps.map((c) => c.district))].sort(), [camps]);

  const filtered = useMemo(() => camps.filter((c) => {
    if (tab !== "all" && c.verification_status !== tab) return false;
    if (district !== "all" && c.district !== district) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.camp_name.toLowerCase().includes(q) ||
        c.camp_email.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        (c.place || "").toLowerCase().includes(q)
      );
    }
    return true;
  }), [camps, tab, district, search]);

  const counts = useMemo(() => ({
    all:      camps.length,
    pending:  camps.filter((c) => c.verification_status === "pending").length,
    approved: camps.filter((c) => c.verification_status === "approved").length,
    rejected: camps.filter((c) => c.verification_status === "rejected").length,
  }), [camps]);

  function addToast(type, message) {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }

  function promptAction(campId, type) {
    setDetailCamp(null);
    setTimeout(() => setConfirm({ open: true, type, campId }), 150);
  }

  function executeAction() {
    const { campId, type } = confirm;
    const camp = camps.find((c) => c._id === campId);
    setCamps((prev) => prev.map((c) =>
      c._id === campId
        ? { ...c, verification_status: type === "approve" ? "approved" : "rejected", camp_status: type === "approve" ? "active" : c.camp_status }
        : c
    ));
    addToast(
      type === "approve" ? "success" : "error",
      type === "approve"
        ? `"${camp.camp_name}" approved successfully.`
        : `"${camp.camp_name}" has been rejected.`
    );
    setConfirm({ open: false, type: null, campId: null });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #0d1117; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
        @keyframes toastIn { from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        .fu { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .rh:hover { background: rgba(255,255,255,0.022); }
      `}</style>

      <div className="min-h-screen bg-[#0d1117] text-slate-300">
        {/* Subtle grid texture */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(232,162,62,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,162,62,0.025) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }} />

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 py-10">

          {/* ── Page Title ── */}
          <div className="fu mb-8" style={{ animationDelay: "0ms" }}>
            <h1 className="text-[2rem] font-bold text-slate-100 leading-none" style={{ fontFamily: "'Playfair Display',serif" }}>
              Camp Approvals
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">Review and manage relief camp registration requests</p>
          </div>

          {/* ── Toolbar ── */}
          <div className="fu flex flex-wrap items-center justify-between gap-4 mb-5" style={{ animationDelay: "50ms" }}>
            {/* Filter tabs */}
            <div className="flex bg-[#161b22] border border-[#30363d] rounded-xl p-1 gap-0.5">
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    tab === t.key ? "bg-[#21262d] text-slate-100" : "text-slate-500 hover:text-slate-300"
                  }`}>
                  {t.label}
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${
                    tab === t.key ? "bg-amber-400/15 text-amber-400" : "bg-[#21262d] text-slate-500"
                  }`}>
                    {counts[t.key]}
                  </span>
                </button>
              ))}
            </div>

            {/* Right: Search + District */}
            <div className="flex items-center gap-2.5">
              <SearchBar
                value={search}
                onChange={setSearch}
                resultCount={filtered.length}
                total={camps.length}
              />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="bg-[#161b22] border border-[#30363d] hover:border-[#484f58] rounded-xl px-3 py-2.5 text-sm text-slate-400 outline-none cursor-pointer transition-all"
                style={{ fontFamily: "'DM Sans',sans-serif" }}>
                <option value="all">All Districts</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="fu" style={{ animationDelay: "100ms" }}>
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">

              {/* Table bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#21262d]">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-300">
                  Registration Requests
                  <span className="text-xs font-mono bg-[#21262d] text-slate-500 px-2 py-0.5 rounded-md">
                    {filtered.length} record{filtered.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#0d1117]/50">
                      {TH.map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-600 border-b border-[#21262d] whitespace-nowrap first:pl-5 last:pr-5">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={TH.length} className="text-center py-16">
                          <div className="text-4xl mb-3 opacity-30">⛺</div>
                          <div className="text-slate-400 font-semibold text-sm">No camps found</div>
                          <div className="text-slate-600 text-xs mt-1">Try adjusting your filters or search query</div>
                        </td>
                      </tr>
                    ) : filtered.map((camp) => {
                      const initials = camp.camp_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                      const date = new Date(camp.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                      return (
                        <tr key={camp._id} className="rh border-b border-[#21262d]/60 last:border-0 transition-colors">

                          {/* Camp */}
                          <td className="px-4 py-3.5 pl-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
                                {initials}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-200">{camp.camp_name}</div>
                                <div className="text-xs text-slate-500 font-mono mt-0.5">{camp.camp_email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="px-4 py-3.5">
                            <div className="text-sm text-slate-300">{camp.district}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{camp.place || "—"}</div>
                          </td>

                          {/* Occupancy */}
                          <td className="px-4 py-3.5">
                            <OccupancyBar value={camp.current_occupancy} />
                          </td>

                          {/* Verification */}
                          <td className="px-4 py-3.5"><VBadge status={camp.verification_status} /></td>

                          {/* Camp Status */}
                          <td className="px-4 py-3.5"><SBadge status={camp.camp_status} /></td>

                          {/* Proof */}
                          <td className="px-4 py-3.5">
                            {camp.camp_proof
                              ? <a href="#" onClick={(e) => e.preventDefault()}
                                  className="text-xs text-blue-400 inline-flex items-center gap-1 bg-blue-400/10 ring-1 ring-blue-400/20 px-2.5 py-1 rounded-lg hover:bg-blue-400/20 transition-colors">
                                  📄 View
                                </a>
                              : <span className="text-xs text-slate-600 italic">No file</span>}
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5">
                            <span className="text-xs font-mono text-slate-500">{date}</span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 pr-5">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setDetailCamp(camp)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#21262d] text-slate-400 border border-[#30363d] hover:text-slate-200 hover:border-[#484f58] transition-all">
                                👁 View
                              </button>
                              {camp.verification_status !== "approved" && (
                                <button onClick={() => promptAction(camp._id, "approve")}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20 hover:bg-emerald-500 hover:text-black hover:ring-emerald-500 transition-all">
                                  ✓
                                </button>
                              )}
                              {camp.verification_status !== "rejected" && (
                                <button onClick={() => promptAction(camp._id, "reject")}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-400/10 text-red-400 ring-1 ring-red-400/20 hover:bg-red-500 hover:text-white hover:ring-red-500 transition-all">
                                  ✕
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="px-5 py-3 border-t border-[#21262d] flex items-center justify-between">
                <span className="text-xs text-slate-600 font-mono">
                  Showing {filtered.length} of {camps.length} camps
                </span>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-lg bg-[#21262d] border border-[#30363d] text-slate-500 text-xs hover:text-slate-300 hover:border-[#484f58] transition-all flex items-center justify-center">‹</button>
                  <button className="w-7 h-7 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-400 text-xs flex items-center justify-center font-semibold">1</button>
                  <button className="w-7 h-7 rounded-lg bg-[#21262d] border border-[#30363d] text-slate-500 text-xs hover:text-slate-300 hover:border-[#484f58] transition-all flex items-center justify-center">›</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <DetailModal
        camp={detailCamp}
        open={!!detailCamp}
        onClose={() => setDetailCamp(null)}
        onApprove={() => promptAction(detailCamp._id, "approve")}
        onReject={() => promptAction(detailCamp._id, "reject")}
      />
      <ConfirmModal
        open={confirm.open}
        type={confirm.type}
        campName={camps.find((c) => c._id === confirm.campId)?.camp_name || ""}
        onConfirm={executeAction}
        onCancel={() => setConfirm({ open: false, type: null, campId: null })}
      />
      <Toast toasts={toasts} />
    </>
  );
}