import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import CenterNavbar from "./CenterNavbar";
import { useAuth } from "../../context/AuthContext";

const CenterLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/guest/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col font-sans selection:bg-amber-500/30">
      <CenterNavbar />
      <div className="flex-1 w-full bg-[#0d1117] relative">
        <Outlet />
      </div>
    </div>
  );
};

export default CenterLayout;
