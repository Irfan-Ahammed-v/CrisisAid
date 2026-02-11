import React from "react";
import SideBar from "../../Components/SideBar/SideBar";
import AdminRouter from "../../../Router/AdminRouter";

const AdminHome = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar wrapper - reserve collapsed width */}
      <div className="flex-shrink-0 w-20 h-screen relative overflow-visible">
        <SideBar />
      </div>

      {/* Main container */}
      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
        {/* NavBar would go here if needed */}
        {/* <NavBar /> */}
        
        {/* Scrollable main content area - Add pt-6 for top padding */}
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto p-4 pt-6 bg-transparent
                        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                        hover:scrollbar-thumb-gray-400">
          <AdminRouter />
        </main>
      </div>
    </div>
  );
};

export default AdminHome;