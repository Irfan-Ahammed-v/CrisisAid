import React from "react";
import { Route, Routes } from "react-router";
import CenterDashboard from "../Center/Pages/CenterDashboard/CenterDashboard";
import PendingRequests from "../Center/Pages/Pendingrequests/Pendingrequests";






const CenterRouter  = () =>{
    return(
        <div>
    <Routes>
    <Route path="/" element={<CenterDashboard/>}/>
    <Route path="/pending-requests" element={<PendingRequests/>}/>
    </Routes>
        </div>
    );
}
export default CenterRouter;