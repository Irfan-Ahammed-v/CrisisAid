import React from "react";
import { Route, Routes } from "react-router";
import CenterDashboard from "../Center/Pages/CenterDashboard/CenterDashboard";
import Requests from "../Center/Pages/Requests/Requests";
import DisasterReports from "../Center/Pages/DisasterReport/DisasterReports";






const CenterRouter  = () =>{
    return(
        <div>
    <Routes>
    <Route path="/" element={<CenterDashboard/>}/>
    <Route path="/requests" element={<Requests/>}/>
    <Route path="/disaster-reports" element={<DisasterReports/>}/>
    </Routes>
        </div>
    );
}
export default CenterRouter;