import React from "react";
import { Route, Routes } from "react-router";
import AdminHome from "../Admin/Pages/AdminHome/AdminHome";
import GuestHome from "../Guest/Pages/GuestHome/GuestHome";
import VolunteerRouter from "./VolunteerRouter";
import CampHome from "../Reliefcamp/Pages/CampHome/CampHome";
import CenterRouter from "./CenterRouter";





const MainRouter  = () =>{
    return(
        <div>
    <Routes>
      <Route path="Guest/*" element={<GuestHome/>} />
      <Route path="Admin/*" element={<AdminHome/>} />
      <Route path="Volunteer/*" element={<VolunteerRouter/>} />
      <Route path="Camp/*" element={<CampHome/>} />
      <Route path="Center/*" element={<CenterRouter/>} />    </Routes>
        </div>
    );
}
export default MainRouter