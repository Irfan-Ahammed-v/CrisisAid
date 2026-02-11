import React from "react";
import { Route, Routes } from "react-router";
import CampDashboard from "../Reliefcamp/Pages/CampDashboard/CampDashboard";
import NewRequest from "../Reliefcamp/Pages/newRequest/newRequest";
import ReportDisaster from "../Reliefcamp/Pages/ReportDisaster/ReportDisaster";
import RequestView from "../Reliefcamp/Pages/RequestView/RequestView";
import RequestList from "../Reliefcamp/Pages/RequestList/RequestList";
import CampProfile from "../Reliefcamp/Pages/CampProfile/CampProfile";

const CampRouter  = () =>{
    return(
        <div>
    <Routes>
   <Route path="/" element={<CampDashboard/>}/>
   <Route path="/new-request" element={<NewRequest/>}/>
    <Route path="/report-disaster" element={<ReportDisaster/>}/>
    <Route path="/request-view/:id" element={<RequestView/>}/>
    <Route path="/Requests" element={<RequestList/>}/>
    <Route path="/profile" element={<CampProfile/>}/>
    </Routes>
        </div>
    );
}
export default CampRouter;