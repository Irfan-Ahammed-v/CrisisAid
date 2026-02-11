import React from "react";
import { Route, Routes } from "react-router";
import CenterDashboard from "../Center/Pages/CenterDashboard/CenterDashboard";






const CenterRouter  = () =>{
    return(
        <div>
    <Routes>
    <Route path="/" element={<CenterDashboard/>}/>
    </Routes>
        </div>
    );
}
export default CenterRouter;