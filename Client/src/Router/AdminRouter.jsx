import React from "react";
import { Route, Routes } from "react-router";
import AdminDashboard from "../Admin/Pages/AdminDashboard/AdminDashboard";
import AllRequest from "../Admin/Pages/AllRequests/AllRequest";
import PendingRequests from "../Admin/Pages/PendingRequests/PendingRequests";
import ResolvedRequests from "../Admin/Pages/ResolvedRequests/ResolvedRequests";
import Victims from "../Admin/Pages/Victims/Victims";
import Volunteers from "../Admin/Pages/Volunteers/Volunteers";
import Centers from "../Admin/Pages/Centers/Centers";
import PlaceTypeManager from "../Admin/Pages/MasterEntries/PlaceTypeManager/PlaceTypeManager";

const AdminRouter  = () =>{
    return(
        <div>
    <Routes>
      <Route path="/" element={<AdminDashboard/>}/>
      <Route path="Requests" element={<AllRequest/>}/>
      <Route path="Requests/Pending" element={<PendingRequests/>}/>
      <Route path="Requests/Resolved" element={<ResolvedRequests/>}/>
      <Route path="Victims" element={<Victims/>}/>
      <Route path="Volunteers" element={<Volunteers/>}/>
      <Route path="Centers" element={<Centers/>}/>
      <Route path="MasterEntries" element={<PlaceTypeManager/>} />

      
    </Routes>
        </div>
    );
}
export default AdminRouter;