import React, { useState } from "react";
import AddPlace from "../AddPlace/AddPlace";
import AddType from "../AddType/AddType";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";

const PlaceTypeManager = () => {
  const [activeTab, setActiveTab] = useState("place"); // default active

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Master Entries</h1>
        <p className="text-gray-600 mt-2">
          Manage places and request types for the system
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
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Tab indicator */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <div className={`h-2 w-24 rounded-full ${activeTab === "place" ? "bg-blue-600" : "bg-green-600"}`}></div>
          <span className="text-sm font-medium text-gray-600">
            {activeTab === "place" ? "Adding/Editing Places" : "Adding/Editing Request Types"}
          </span>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === "place" && <AddPlace />}
          {activeTab === "type" && <AddType />}
        </div>
      </div>

      {/* INFO BOX */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">About Master Entries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-1">Places</h4>
            <p className="text-blue-600 text-sm">
              Add locations (cities, towns) where relief operations can take place. 
              These will be available when creating new relief centers.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-1">Request Types</h4>
            <p className="text-green-600 text-sm">
              Define categories for help requests (Medical, Food, Shelter, etc.). 
              These help organize and prioritize emergency responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceTypeManager;