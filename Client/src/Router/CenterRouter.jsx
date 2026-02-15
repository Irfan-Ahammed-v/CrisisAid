import React from "react";
import { Route, Routes } from "react-router";
import CenterDashboard from "../Center/Pages/CenterDashboard/CenterDashboard";
import Requests from "../Center/Pages/Requests/Requests";
import DisasterReports from "../Center/Pages/DisasterReport/DisasterReports";
import VolunteerManagement from "../Center/Pages/VolunteerManagment/VolunteerManagment";
import CampManagment from "../Center/Pages/CampManagment/CampManagment";
import PendingApprovals from "../Center/Pages/PendingApprovals/PendingApprovals";
import CenterProfile from "../Center/Pages/CenterProfile/CenterProfile";
import CenterLayout from "../Center/Components/CenterLayout";





const CenterRouter = () => {
  return (
    <Routes>
      <Route element={<CenterLayout />}>
        <Route path="/" element={<CenterDashboard />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/disaster-reports" element={<DisasterReports />} />
        <Route path="/volunteer-management" element={<VolunteerManagement />} />
        <Route path="/camp-management" element={<CampManagment />} />
        <Route path="/pending-approvals" element={<PendingApprovals />} />
        <Route path="/profile" element={<CenterProfile />} />
        <Route path="*" element={<div className="text-center py-10 text-slate-400">Page Not Found</div>} />
      </Route>
    </Routes>
  );
};
export default CenterRouter;