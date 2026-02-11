import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Module navbars
import CampNavBar from "../Reliefcamp/Components/NavBar/NavBar";
// later you can add AdminNavbar, VolunteerNavbar, etc.

const MainLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      {/* Role-based navbar */}
      {user?.role === "camp" && <CampNavBar />}

      {/* Page content */}
      <Outlet />
    </>
  );
};

export default MainLayout;
