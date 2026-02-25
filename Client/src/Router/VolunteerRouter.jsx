import DisasterGallery from "../Volunteer/Pages/DisasterGallery/DisasterGallery";
import VolunteerFeedback from "../Volunteer/Pages/VolunteerFeedback/VolunteerFeedback";
import { VolunteerThemeProvider } from "../context/VolunteerThemeContext";
import VolunteerLayout from "../Volunteer/Layout/VolunteerLayout";
import { Route, Routes } from "react-router";
import VolunteerDashboard from "../Volunteer/Pages/VolunteerDashBoard/VolunteerDashBoard";
import VolunteerProfile from "../Volunteer/Pages/VolunteerProfile/VolunteerProfile";
import VolunteerAssignments from "../Volunteer/Pages/VolunteerAssignments/VolunteerAssignments";
import VolunteerRequests from "../Volunteer/Pages/VolunteerRequests/VolunteerRequests";

const VolunteerRouter = () => {
  return (
    <VolunteerThemeProvider>
      <Routes>
        <Route element={<VolunteerLayout />}>
          <Route path="/" element={<VolunteerDashboard />} />
          <Route path="home" element={<VolunteerDashboard />} />
          <Route path="profile" element={<VolunteerProfile />} />
          <Route path="assignments" element={<VolunteerAssignments />} />
          <Route path="requests" element={<VolunteerRequests />} />
          <Route path="disasters" element={<DisasterGallery />} />

          <Route path="feedback" element={<VolunteerFeedback />} />
          <Route path="*" element={<VolunteerDashboard />} />
        </Route>
      </Routes>
    </VolunteerThemeProvider>
  );
};

export default VolunteerRouter;
