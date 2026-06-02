import { createContext, useContext, useState, useCallback } from "react";

const CenterToastContext = createContext(null);

export function useCenterToast() {
  const ctx = useContext(CenterToastContext);
  if (!ctx) throw new Error("useCenterToast must be used within CenterToastProvider");
  return ctx.addToast;
}

// ── Toast Item ────────────────────────────────────────────────
const ICONS = {
  success: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const STYLES = {
  success: "bg-[#0d2b1d] border-emerald-700/50 text-emerald-300 [&_svg]:text-emerald-400",
  error:   "bg-[#2b0d0d] border-red-700/50    text-red-300    [&_svg]:text-red-400",
  warning: "bg-[#2b200d] border-amber-700/50  text-amber-300  [&_svg]:text-amber-400",
  info:    "bg-[#0d1a2b] border-blue-700/50   text-blue-300   [&_svg]:text-blue-400",
};

function ToastItem({ t, onRemove }) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-sm font-medium pointer-events-auto min-w-[280px] max-w-[360px] ${STYLES[t.type] || STYLES.info}`}
      style={{ animation: "toastSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      {ICONS[t.type]}
      <span className="flex-1 leading-relaxed">{t.message}</span>
      <button
        onClick={() => onRemove(t.id)}
        className="opacity-40 hover:opacity-100 transition-opacity ml-1 flex-shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────────
export function CenterToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <CenterToastContext.Provider value={{ addToast }}>
      {children}

      {/* Global Toast Renderer — upper-right corner */}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(36px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
        }
      `}</style>
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} t={t} onRemove={removeToast} />
        ))}
      </div>
    </CenterToastContext.Provider>
  );
}
