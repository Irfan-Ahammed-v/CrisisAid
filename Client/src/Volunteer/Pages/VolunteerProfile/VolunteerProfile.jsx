import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useVolunteerTheme } from "../../../context/VolunteerThemeContext";

/* ─── tiny icon components (no extra deps) ─────────────────────────── */
const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const IconUser    = (p) => <Icon {...p} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const IconPhone   = (p) => <Icon {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z" />;
const IconMail    = (p) => <Icon {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
const IconPin     = (p) => <Icon {...p} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const IconShield  = (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IconHome    = (p) => <Icon {...p} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />;
const IconEdit    = (p) => <Icon {...p} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const IconKey     = (p) => <Icon {...p} d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />;
const IconCheck   = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />;
const IconX       = (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />;
const IconBuilding= (p) => <Icon {...p} d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18zM2 22h20M14 22v-4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4M10 7h4M10 11h4" />;
const IconEye     = (p) => <Icon {...p} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const IconEyeOff  = (p) => <Icon {...p} d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />;

/* ─── helpers ───────────────────────────────────────────────────────── */
const cx = (...args) => args.filter(Boolean).join(" ");

/* ─── sub-components ────────────────────────────────────────────────── */
const Label = ({ children, isDark }) => (
  <span className={cx(
    "text-[9px] font-black uppercase tracking-[0.18em] select-none",
    isDark ? "text-slate-500" : "text-slate-400"
  )}>{children}</span>
);

const PasswordInput = ({ name, value, onChange, placeholder, isDark }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cx(
          "w-full rounded-2xl px-5 py-3.5 pr-12 outline-none border font-medium text-sm transition-all duration-200",
          isDark
            ? "bg-[#0d1117] border-[#30363d] text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
        )}
      />
      <button
        type="button"
        onClick={() => setShow(p => !p)}
        className={cx(
          "absolute right-4 top-1/2 -translate-y-1/2 transition-colors",
          isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
        )}
      >
        {show ? <IconEyeOff size={15}/> : <IconEye size={15}/>}
      </button>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, placeholder, type = "text", isDark }) => (
  <div className="space-y-2">
    <Label isDark={isDark}>{label}</Label>
    {type === "password" ? (
      <PasswordInput name={name} value={value} onChange={onChange} placeholder={placeholder} isDark={isDark} />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cx(
          "w-full rounded-2xl px-5 py-3.5 outline-none border font-medium text-sm transition-all duration-200",
          isDark
            ? "bg-[#0d1117] border-[#30363d] text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
        )}
      />
    )}
  </div>
);

const DataCard = ({ icon: IconComp, label, value, subValue, isDark, highlight }) => (
  <div className={cx(
    "rounded-2xl p-5 border transition-all duration-200 group",
    isDark
      ? "bg-[#0d1117] border-[#30363d] hover:border-slate-600"
      : "bg-slate-50 border-slate-100 hover:border-slate-200"
  )}>
    <div className={cx(
      "w-8 h-8 rounded-xl flex items-center justify-center mb-4",
      highlight
        ? isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600"
        : isDark ? "bg-slate-800 text-slate-400" : "bg-white text-slate-500 shadow-sm border border-slate-100"
    )}>
      <IconComp size={14} />
    </div>
    <Label isDark={isDark}>{label}</Label>
    <p className={cx(
      "mt-1 font-bold text-base leading-snug truncate",
      highlight
        ? isDark ? "text-emerald-400" : "text-emerald-600"
        : isDark ? "text-slate-100" : "text-slate-800"
    )}>{value || "—"}</p>
    {subValue && (
      <p className={cx("text-xs mt-0.5 font-medium", isDark ? "text-slate-500" : "text-slate-400")}>{subValue}</p>
    )}
  </div>
);

const Divider = ({ isDark }) => (
  <div className={cx("h-px w-full", isDark ? "bg-[#30363d]" : "bg-slate-100")} />
);

const SectionTitle = ({ children, isDark }) => (
  <h3 className={cx(
    "text-[9px] font-black uppercase tracking-[0.2em]",
    isDark ? "text-slate-500" : "text-slate-400"
  )}>{children}</h3>
);

/* ─── Skeleton loader ───────────────────────────────────────────────── */
const Skeleton = ({ isDark, className }) => (
  <div className={cx(
    "rounded-xl animate-pulse",
    isDark ? "bg-slate-800" : "bg-slate-200",
    className
  )} />
);

/* ─── Toast notification ────────────────────────────────────────────── */
const useToast = () => {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
};

const Toast = ({ toast, isDark }) => {
  if (!toast) return null;
  return (
    <div className={cx(
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all",
      toast.type === "success"
        ? isDark
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          : "bg-emerald-50 border-emerald-200 text-emerald-700"
        : isDark
          ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
          : "bg-rose-50 border-rose-200 text-rose-700"
    )}>
      {toast.type === "success" ? <IconCheck size={14}/> : <IconX size={14}/>}
      {toast.msg}
    </div>
  );
};

/* ─── Tab Button ────────────────────────────────────────────────────── */
const ActionBtn = ({ onClick, active, activeClass, children, isDark, icon: IconComp }) => (
  <button
    onClick={onClick}
    className={cx(
      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 active:scale-95",
      active
        ? activeClass || "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
        : isDark
          ? "bg-[#0d1117] border border-[#30363d] text-slate-300 hover:border-slate-500 hover:text-white"
          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
    )}
  >
    {IconComp && <IconComp size={12} />}
    {children}
  </button>
);

/* ─── Main Component ────────────────────────────────────────────────── */
const VolunteerProfile = () => {
  const { theme } = useVolunteerTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const { toast, show: showToast } = useToast();

  const [formData, setFormData] = useState({
    volunteer_name: "",
    volunteer_phone: "",
    volunteer_address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE;
  const isDark = theme === "dark";

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/volunteer/profile");
      const data = res.data;
      setProfile(data);
      setFormData({
        volunteer_name: data.volunteer_name || "",
        volunteer_phone: data.volunteer_phone || "",
        volunteer_address: data.volunteer_address || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await axios.put("http://localhost:5000/volunteer/profile", formData);
      setIsEditing(false);
      await fetchProfile();
      showToast("Profile updated successfully!");
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const res = await axios.patch("http://localhost:5000/volunteer/toggle-availability");
      setProfile({ ...profile, availability: res.data.availability });
      showToast(res.data.availability ? "You're now available" : "You're now offline");
    } catch {
      showToast("Failed to update availability", "error");
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    setSavingPass(true);
    try {
      await axios.patch("http://localhost:5000/volunteer/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showToast("Password changed successfully!");
      setIsChangingPass(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to change password", "error");
    } finally {
      setSavingPass(false);
    }
  };

  /* ── loading skeleton ── */
  if (loading) return (
    <div className={cx("min-h-screen w-full font-sans", isDark ? "bg-[#0d1117]" : "bg-slate-50")}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={cx(
          "rounded-[2.5rem] overflow-hidden border shadow-2xl",
          isDark ? "bg-[#161b22] border-[#30363d]" : "bg-white border-slate-100"
        )}>
          <div className={cx("px-8 py-10 border-b", isDark ? "border-[#30363d]" : "border-slate-100")}>
            <div className="flex gap-8 items-center">
              <Skeleton isDark={isDark} className="w-36 h-36 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton isDark={isDark} className="h-7 w-48" />
                <Skeleton isDark={isDark} className="h-4 w-32" />
                <Skeleton isDark={isDark} className="h-8 w-56" />
              </div>
            </div>
          </div>
          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} isDark={isDark} className="h-28" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const initials = profile?.volunteer_name
    ?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "V";

  return (
    <div className={cx(
      "min-h-screen w-full font-sans transition-colors duration-300 overflow-y-auto",
      isDark ? "bg-[#0d1117]" : "bg-slate-50"
    )}>
      <Toast toast={toast} isDark={isDark} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">

        {/* ── Main Card ── */}
        <div className={cx(
          "rounded-[2.5rem] overflow-hidden border shadow-2xl transition-all duration-300",
          isDark ? "bg-[#161b22] border-[#30363d]" : "bg-white border-slate-100"
        )}>

          {/* ── Header ── */}
          <div className={cx(
            "relative px-8 py-10 border-b overflow-hidden",
            isDark ? "border-[#30363d]" : "border-slate-100"
          )}>
            {/* subtle mesh bg */}
            <div className={cx(
              "absolute inset-0 pointer-events-none",
              isDark
                ? "bg-[radial-gradient(ellipse_at_top_right,rgba(52,211,153,0.05)_0%,transparent_60%)]"
                : "bg-[radial-gradient(ellipse_at_top_right,rgba(52,211,153,0.07)_0%,transparent_60%)]"
            )} />

            <div className="relative flex flex-col md:flex-row items-center gap-8">

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-[1.6rem] bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 p-[3px] shadow-xl shadow-emerald-500/20">
                  {profile?.volunteer_photo ? (
                    <img
                      src={`${API_BASE}/uploads/volunteers/${profile.volunteer_photo.split("\\").pop()}`}
                      alt="Profile"
                      className={cx(
                        "w-full h-full object-cover rounded-[1.4rem] border-2",
                        isDark ? "border-[#161b22]" : "border-white"
                      )}
                    />
                  ) : (
                    <div className={cx(
                      "w-full h-full rounded-[1.4rem] flex items-center justify-center text-2xl font-black",
                      isDark ? "bg-[#0d1117] text-emerald-400" : "bg-slate-100 text-emerald-600"
                    )}>
                      {initials}
                    </div>
                  )}
                </div>

                {/* Verified badge */}
                {profile?.profileCompleted && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-inherit">
                    <IconCheck size={12} className="text-white stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start gap-3 mb-3">
                  <div>
                    <h2 className={cx("text-2xl font-black tracking-tight leading-none mb-1", isDark ? "text-white" : "text-slate-900")}>
                      {profile?.volunteer_name}
                    </h2>
                    <p className={cx("text-xs font-medium", isDark ? "text-slate-500" : "text-slate-400")}>
                      {profile?.volunteer_email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  {/* Status pill */}
                  <div className={cx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest",
                    isDark ? "bg-[#0d1117] border-[#30363d] text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"
                  )}>
                    <span className={cx(
                      "w-1.5 h-1.5 rounded-full",
                      profile?.availability ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" : "bg-slate-400"
                    )} />
                    {profile?.availability ? "Available" : "Offline"}
                  </div>

                  {/* Certified badge */}
                  <div className={cx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest",
                    profile?.profileCompleted
                      ? isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : isDark ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-700 border border-amber-100"
                  )}>
                    <IconShield size={10} />
                    {profile?.profileCompleted ? "Certified Responder" : "Provisional"}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-2">
                <ActionBtn
                  onClick={toggleAvailability}
                  isDark={isDark}
                  active={profile?.availability}
                  activeClass="bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  icon={profile?.availability ? IconEyeOff : IconEye}
                >
                  {profile?.availability ? "Go Offline" : "Go Online"}
                </ActionBtn>
                <ActionBtn
                  onClick={() => { setIsEditing(!isEditing); setIsChangingPass(false); }}
                  isDark={isDark}
                  active={isEditing}
                  icon={isEditing ? IconX : IconEdit}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </ActionBtn>
                <ActionBtn
                  onClick={() => { setIsChangingPass(!isChangingPass); setIsEditing(false); }}
                  isDark={isDark}
                  active={isChangingPass}
                  activeClass="bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                  icon={isChangingPass ? IconX : IconKey}
                >
                  {isChangingPass ? "Cancel" : "Change Password"}
                </ActionBtn>
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="p-8 md:p-10">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cx("w-8 h-8 rounded-xl flex items-center justify-center", isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600")}>
                      <IconEdit size={13}/>
                    </div>
                    <div>
                      <h3 className={cx("text-sm font-black", isDark ? "text-white" : "text-slate-900")}>Edit Profile</h3>
                      <p className={cx("text-[11px]", isDark ? "text-slate-500" : "text-slate-400")}>Update your personal information below</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Display Name" name="volunteer_name" value={formData.volunteer_name} onChange={handleChange} isDark={isDark} />
                    <InputGroup label="Primary Phone" name="volunteer_phone" value={formData.volunteer_phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" isDark={isDark} />
                  </div>

                  <div className="space-y-2">
                    <Label isDark={isDark}>Residential Address</Label>
                    <textarea
                      name="volunteer_address"
                      value={formData.volunteer_address}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Enter your full residential address..."
                      className={cx(
                        "w-full rounded-2xl px-5 py-3.5 outline-none border font-medium text-sm resize-none transition-all duration-200",
                        isDark
                          ? "bg-[#0d1117] border-[#30363d] text-white placeholder-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className={cx(
                        "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      {savingProfile ? (
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : <IconCheck size={12} />}
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>

            ) : isChangingPass ? (
              <form onSubmit={onChangePassword}>
                <div className="max-w-sm mx-auto space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cx("w-8 h-8 rounded-xl flex items-center justify-center", isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600")}>
                      <IconKey size={13}/>
                    </div>
                    <div>
                      <h3 className={cx("text-sm font-black", isDark ? "text-white" : "text-slate-900")}>Change Password</h3>
                      <p className={cx("text-[11px]", isDark ? "text-slate-500" : "text-slate-400")}>Choose a strong new password</p>
                    </div>
                  </div>

                  <InputGroup label="Current Password" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} isDark={isDark} />
                  <InputGroup label="New Password" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Min. 8 characters" isDark={isDark} />

                  {/* strength indicator */}
                  {passwordData.newPassword.length > 0 && (
                    <div className="space-y-1.5 -mt-3">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => {
                          const len = passwordData.newPassword.length;
                          const strength = len < 6 ? 1 : len < 10 ? 2 : len < 14 ? 3 : 4;
                          return (
                            <div key={i} className={cx(
                              "h-1 flex-1 rounded-full transition-all duration-300",
                              i < strength
                                ? strength === 1 ? "bg-rose-500" : strength === 2 ? "bg-amber-400" : strength === 3 ? "bg-emerald-400" : "bg-emerald-500"
                                : isDark ? "bg-slate-700" : "bg-slate-200"
                            )} />
                          );
                        })}
                      </div>
                      <p className={cx("text-[10px] font-medium", isDark ? "text-slate-500" : "text-slate-400")}>
                        {passwordData.newPassword.length < 6 ? "Weak" : passwordData.newPassword.length < 10 ? "Fair" : passwordData.newPassword.length < 14 ? "Good" : "Strong"}
                      </p>
                    </div>
                  )}

                  <InputGroup label="Confirm New Password" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} isDark={isDark} />

                  {/* Match indicator */}
                  {passwordData.newPassword && passwordData.confirmPassword && (
                    <div className={cx(
                      "flex items-center gap-2 text-[11px] font-semibold -mt-3",
                      passwordData.newPassword === passwordData.confirmPassword ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {passwordData.newPassword === passwordData.confirmPassword
                        ? <><IconCheck size={11}/> Passwords match</>
                        : <><IconX size={11}/> Passwords don't match</>
                      }
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingPass}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    {savingPass ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : <IconKey size={12} />}
                    {savingPass ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>

            ) : (
              <div className="space-y-10">
                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <DataCard icon={IconMail}     label="Email Address"   value={profile?.volunteer_email}                                      isDark={isDark} />
                  <DataCard icon={IconPhone}    label="Contact Number"  value={profile?.volunteer_phone || "Not set"}                         isDark={isDark} />
                  <DataCard icon={IconBuilding} label="Assigned Center" value={profile?.center_id?.center_name || "Unassigned"} subValue={profile?.district_id?.district_name} isDark={isDark} highlight />
                </div>

                {/* Address */}
                <div className={cx(
                  "rounded-2xl p-5 border",
                  isDark ? "bg-[#0d1117] border-[#30363d]" : "bg-slate-50 border-slate-100"
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cx(
                      "mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                      isDark ? "bg-slate-800 text-slate-400" : "bg-white text-slate-500 shadow-sm border border-slate-100"
                    )}>
                      <IconHome size={14}/>
                    </div>
                    <div>
                      <Label isDark={isDark}>Residential Address</Label>
                      <p className={cx(
                        "mt-1.5 font-semibold text-sm leading-relaxed",
                        isDark ? "text-slate-200" : "text-slate-700"
                      )}>
                        {profile?.volunteer_address || "No residential address on file."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification Document */}
                {profile?.volunteer_proof && (
                  <>
                    <Divider isDark={isDark} />
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <IconShield size={13} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                        <SectionTitle isDark={isDark}>Verification Document</SectionTitle>
                      </div>
                      <div className="max-w-sm">
                        <div className={cx(
                          "rounded-2xl overflow-hidden border-2 shadow-lg transition-all hover:shadow-xl",
                          isDark ? "border-[#30363d]" : "border-slate-100"
                        )}>
                          <img
                            src={`${API_BASE}/uploads/volunteers/${profile.volunteer_proof.split("\\").pop()}`}
                            alt="ID Proof"
                            className="w-full h-48 object-cover"
                          />
                          <div className={cx(
                            "px-4 py-2.5 flex items-center gap-2",
                            isDark ? "bg-[#0d1117]" : "bg-slate-50"
                          )}>
                            <IconCheck size={11} className="text-emerald-500"/>
                            <span className={cx("text-[10px] font-black uppercase tracking-widest", isDark ? "text-slate-400" : "text-slate-500")}>
                              Identity Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Stats footer strip ── */}
        <div className={cx(
          "grid grid-cols-3 rounded-3xl border divide-x overflow-hidden",
          isDark ? "bg-[#161b22] border-[#30363d] divide-[#30363d]" : "bg-white border-slate-100 divide-slate-100 shadow-sm"
        )}>
          {[
            { label: "Member Since", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—" },
            { label: "Status",       value: profile?.availability ? "Active" : "Offline", highlight: profile?.availability },
            { label: "Profile",      value: profile?.profileCompleted ? "Verified" : "Pending", highlight: profile?.profileCompleted },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="px-6 py-5 text-center">
              <Label isDark={isDark}>{label}</Label>
              <p className={cx(
                "mt-1 font-black text-base",
                highlight ? (isDark ? "text-emerald-400" : "text-emerald-600") : (isDark ? "text-white" : "text-slate-800")
                
              )}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;