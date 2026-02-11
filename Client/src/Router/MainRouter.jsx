import React from "react";
import { Route, Routes } from "react-router";
import AdminHome from "../Admin/Pages/AdminHome/AdminHome";
import GuestHome from "../Guest/Pages/GuestHome/GuestHome";
import VolunteerHome from "../Volunteer/Pages/VolunteerHome/VolunteerHome";
import CampHome from "../Reliefcamp/Pages/CampHome/CampHome";
import CenterHome from "../Center/Pages/CenterHome/CenterHome";





const MainRouter  = () =>{
    return(
        <div>
    <Routes>
      <Route path="Guest/*" element={<GuestHome/>} />
      <Route path="Admin/*" element={<AdminHome/>} />
      <Route path="Volunteer/*" element={<VolunteerHome/>} />
      <Route path="camp/*" element={<CampHome/>} />
      <Route path="Center/*" element={<CenterHome/>} />
    </Routes>
        </div>
    );
}
export default MainRouter