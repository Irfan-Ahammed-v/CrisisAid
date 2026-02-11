import React from "react";
import { Route, Routes } from "react-router";
import MyProfile from "../Volunteer/Pages/MyProfile/MyProfile";
import EditProfile from "../Volunteer/Pages/EditProfile/EditProfile";
import VolunteerDashBoard from "../Volunteer/Pages/VolunteerDashBoard/VolunteerDashBoard";


const VolunteerRouter = () => {
  return (
    <Routes>
      <Route path="*" element={<VolunteerDashBoard/>}/>
      <Route path="home" element={<VolunteerDashBoard />} />
      <Route path="Profile" element={<MyProfile />} />
      <Route path="Profile/Edit" element={<EditProfile/>} />
    </Routes>
  );
};

export default VolunteerRouter;
