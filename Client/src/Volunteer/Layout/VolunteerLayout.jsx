import React from "react";
import { useVolunteerTheme } from "../../context/VolunteerThemeContext";
import VolunteerNavbar from "../Components/VolunteerNavbar";
import VolunteerFooter from "../Components/VolunteerFooter";
import { Outlet } from "react-router";

const VolunteerLayout = () => {
  const { theme } = useVolunteerTheme();

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
