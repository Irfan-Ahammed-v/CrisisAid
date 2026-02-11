import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import BadgeIcon from "@mui/icons-material/Badge";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import GroupsIcon from "@mui/icons-material/Groups";
import { Link } from "react-router";

const VolunteerLandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-gray-50 px-6 py-20 lg:px-16">
        <div className="max-w-7xl mx-auto text-center my-16">
          
          <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Stand Ready. <br /> Serve When It Matters Most.
          </h2>

          <div className="text-lg text-gray-600 space-y-2 mb-8 max-w-3xl mx-auto">
            <p>VolunteerAid connects verified volunteers with nearby relief camps</p>
            <p>during disasters, enabling fast response, coordination,</p>
            <p>and life-saving support.</p>
          </div>

          <div className="flex justify-center gap-4 mb-10">
            <Link 
              to="/Guest/volunteer_register" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-full text-base font-medium transition-colors"
            >
              Become a Volunteer <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <GroupsIcon className="text-blue-600" sx={{ fontSize: 32 }} />
              <div className="text-left">
                <p className="text-xl font-bold">9,500+</p>
                <p className="text-sm text-gray-600">Active Volunteers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <CheckCircleIcon className="text-green-600" sx={{ fontSize: 32 }} />
              <div className="text-left">
                <p className="text-xl font-bold">1,200+</p>
                <p className="text-sm text-gray-600">Operations Assisted</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <LocationOnIcon className="text-orange-600" sx={{ fontSize: 32 }} />
              <div className="text-left">
                <p className="text-xl font-bold">38+</p>
                <p className="text-sm text-gray-600">Districts Covered</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gray-100 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">How Volunteering Works</h2>
          <p className="text-center text-gray-600 mb-12">
            A trusted and verified workflow for disaster response
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <VolunteerActivismIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Volunteer Registration</h3>
              <p className="text-gray-600 text-sm">
                Register with basic details, location, and availability
                to join the volunteer network.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <BadgeIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-xl font-semibold mb-2">ID Verification</h3>
              <p className="text-gray-600 text-sm">
                Upload government-issued ID for verification
                to ensure safety and authenticity.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <NotificationsActiveIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive Alerts</h3>
              <p className="text-gray-600 text-sm">
                Get notified instantly when disasters or camp requests
                arise in your area.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <AssignmentTurnedInIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accept & Join</h3>
              <p className="text-gray-600 text-sm">
                Accept help requests and join relief operations
                coordinated by nearby camps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VOLUNTEER ROLES ================= */}
      <section className="bg-gray-50 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">Volunteer Roles</h2>
          <p className="text-center text-gray-600 mb-12">
            Different ways volunteers contribute during emergencies
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-12">
            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-blue-600">
              <GroupsIcon className="text-blue-600 mb-4" sx={{ fontSize: 32 }} />
              <h3 className="text-xl font-semibold mb-2">Field Volunteers</h3>
              <p className="text-gray-600 text-sm">
                Assist camps with logistics, food distribution, and shelter support.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-green-600">
              <VolunteerActivismIcon className="text-green-600 mb-4" sx={{ fontSize: 32 }} />
              <h3 className="text-xl font-semibold mb-2">Relief Assistants</h3>
              <p className="text-gray-600 text-sm">
                Support displaced individuals with daily needs and coordination.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-orange-600">
              <NotificationsActiveIcon className="text-orange-600 mb-4" sx={{ fontSize: 32 }} />
              <h3 className="text-xl font-semibold mb-2">Rapid Responders</h3>
              <p className="text-gray-600 text-sm">
                Respond quickly to emergency alerts within your locality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KEY FEATURES ================= */}
      <section className="bg-gray-100 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">Volunteer Features</h2>
          <p className="text-center text-gray-600 mb-12">
            Designed to keep volunteers informed, safe, and effective
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <BadgeIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Verified Identity</h3>
                <p className="text-gray-600 text-sm">Ensures trust and safety for camps and authorities.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <NotificationsActiveIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Real-time Alerts</h3>
                <p className="text-gray-600 text-sm">Instant notifications for nearby disasters and help requests.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <LocationOnIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Location-Based Requests</h3>
                <p className="text-gray-600 text-sm">Only receive requests relevant to your region.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <AssignmentTurnedInIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Operation Participation</h3>
                <p className="text-gray-600 text-sm">Join and track relief operations you accept.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="px-6 py-6 text-center text-sm text-gray-600 border-t border-gray-200">
        © {new Date().getFullYear()} VolunteerAid. All rights reserved.
      </footer>

    </div>
  );
};

export default VolunteerLandingPage;