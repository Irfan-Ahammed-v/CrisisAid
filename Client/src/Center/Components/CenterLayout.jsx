import React from "react";
import { Outlet } from "react-router";
import CenterNavbar from "./CenterNavbar";

const CenterLayout = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <CenterNavbar />
      <div className="flex-1 w-full bg-[#0d1117]">
        <Outlet />
      </div>
    </div>
  );
};

export default CenterLayout;
