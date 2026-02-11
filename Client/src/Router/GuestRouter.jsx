import React from "react";
import { Route, Routes } from "react-router";
import LandingPage from "../Guest/Pages/LandingPage/LandingPage";
import ReliefCampLandingPage from "../Guest/Pages/ReliefCampLandingPage/ReliefCampLandingPage";
import CampRegister from "../Guest/Pages/CampRegister/CampRegister";
import VolunteerRegister from "../Guest/Pages/VolunteerRegister/VolunteerRegister";
import VolunteerLandingPage from "../Guest/Pages/VolunteerLandingPage/VolunteerLandingPage";
import CenterLandingPage from "../Guest/Pages/CenterLandingPage/CenterLandingPage";
import CenterRegister from "../Guest/Pages/CenterRegister/CenterRegister";
import Login from "../Guest/Pages/Login/Login";






const GuestRouter  = () =>{
    return(
        <div>
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="camp" element={<ReliefCampLandingPage/>}/>
      <Route path="camp_register" element={<CampRegister/>}/>
      <Route path="volunteer" element={<VolunteerLandingPage/>}/>
      <Route path="volunteer_register" element={<VolunteerRegister/>}/>
      <Route path="center" element={<CenterLandingPage/>}/>
      <Route path="center_register" element={<CenterRegister/>}/>
      <Route path="Login" element={<Login/>}/>

    </Routes>
        </div>
    );
}
export default GuestRouter;