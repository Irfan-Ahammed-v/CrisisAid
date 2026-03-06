import React, { useEffect } from "react";
import { useVolunteerTheme } from "../../context/VolunteerThemeContext";
import VolunteerNavbar from "../Components/VolunteerNavbar";
import VolunteerFooter from "../Components/VolunteerFooter";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const VolunteerLayout = () => {
  const { theme } = useVolunteerTheme();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/guest/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-[#0d1117]" : "bg-slate-50"
        }`}
      >
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0d1117] text-slate-300 selection:bg-emerald-500/30"
          : "bg-slate-50 text-slate-700 selection:bg-emerald-500/20"
      }`}
    >
      <VolunteerNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <VolunteerFooter />
    </div>
  );
};


export default VolunteerLayout;
