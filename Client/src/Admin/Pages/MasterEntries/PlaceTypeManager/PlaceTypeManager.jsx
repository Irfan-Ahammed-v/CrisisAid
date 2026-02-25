import React, { useState } from "react";
import AddPlace from "../AddPlace/AddPlace";
import AddType from "../AddType/AddType";
import AddDisasterType from "../AddDisasterType/AddDisasterType";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import WarningIcon from "@mui/icons-material/Warning";

const PlaceTypeManager = () => {
  const [activeTab, setActiveTab] = useState("place"); // default active

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Master Entries</h1>
        <p className="text-gray-600 mt-2">
          Manage system-level entities for relief coordination
        </p>
      </div>

      {/* TAB BUTTONS */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                     ${activeTab === "place" 
                       ? "bg-blue-600 text-white shadow-lg" 
                       : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                     }`}
          onClick={() => setActiveTab("place")}
        >
          <LocationOnIcon sx={{ fontSize: 20 }} />
          Manage Places
        </button>

        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                     ${activeTab === "type" 
                       ? "bg-blue-600 text-white shadow-lg" 
                       : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                     }`}
          onClick={() => setActiveTab("type")}
        >
          <CategoryIcon sx={{ fontSize: 20 }} />
          Manage Request Types
        </button>

        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                     ${activeTab === "disaster" 
                       ? "bg-blue-600 text-white shadow-lg" 
                       : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                     }`}
          onClick={() => setActiveTab("disaster")}
        >
          <WarningIcon sx={{ fontSize: 20 }} />
          Manage Disaster Types
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Tab indicator */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <div className={`h-2 w-24 rounded-full transition-all duration-300 ${
            activeTab === "place" ? "bg-blue-600" : activeTab === "type" ? "bg-green-600" : "bg-red-600"
          }`}></div>
          <span className="text-sm font-medium text-gray-600">
            {activeTab === "place" && "Adding/Editing Places"}
            {activeTab === "type" && "Adding/Editing Request Types"}
            {activeTab === "disaster" && "Adding Disaster Categories"}
          </span>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === "place" && <AddPlace />}
          {activeTab === "type" && <AddType />}
          {activeTab === "disaster" && <AddDisasterType />}
        </div>
      </div>

      {/* INFO BOX */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">About Master Entries</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-1">Places</h4>
            <p className="text-blue-600 text-sm">
              Locations for relief operations. Used for relief center registration.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-1">Request Types</h4>
            <p className="text-green-600 text-sm">
              Categories for help requests (Medical, Food, etc.) to organize responses.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-1">Disaster Types</h4>
            <p className="text-red-600 text-sm">
              Define types of emergencies (Flood, Landslide, etc.) to report active incidents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceTypeManager;
