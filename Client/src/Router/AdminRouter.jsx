import React from "react";
import { Route, Routes } from "react-router";
import AdminDashboard from "../Admin/Pages/AdminDashboard/AdminDashboard";
import Volunteers from "../Admin/Pages/Volunteers/Volunteers";
import Centers from "../Admin/Pages/Centers/Centers";
import PlaceTypeManager from "../Admin/Pages/MasterEntries/PlaceTypeManager/PlaceTypeManager";
import AdminLayout from "../Admin/Components/AdminLayout";
import AdminReports from "../Admin/Pages/Reports/AdminReports";
import DownloadReports from "../Admin/Pages/DownloadReports/DownloadReports";

const AdminRouter  = () =>{
    return(
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<AdminDashboard/>}/>
        <Route path="Volunteers" element={<Volunteers/>}/>
        <Route path="Centers" element={<Centers/>}/>
        <Route path="Reports" element={<AdminReports />} />
        <Route path="DownloadReports" element={<DownloadReports />} />
        <Route path="MasterEntries" element={<PlaceTypeManager/>} />
      </Route>
    </Routes>
    );
}
export default AdminRouter;