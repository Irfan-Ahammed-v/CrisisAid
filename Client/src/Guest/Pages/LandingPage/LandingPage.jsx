import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShieldIcon from "@mui/icons-material/Shield";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================= HERO SECTION (1 - LIGHT) ================= */}
      <section className="bg-gray-50 px-6 py-20 lg:px-16">
        <div className="max-w-7xl mx-auto text-center my-16">
          
          <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Structured Emergency <br /> Response for Critical Situations
          </h2>

          <div className="text-lg text-gray-600 space-y-2 mb-8 max-w-3xl mx-auto">
            <p>CrisisAid is a role-based emergency management platform that coordinates</p>
            <p>disaster relief through a hierarchical system of victims, volunteers,</p>
            <p>sub-centers, and main centers.</p>
          </div>

          <div className="flex justify-center gap-4 mb-10 flex-wrap">
            <Link 
              to="/Guest/camp" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-full text-base font-medium transition-colors"
            >
              Request Help <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </Link>
            
            <Link 
              to="/Guest/Volunteer" 
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-7 py-3 rounded-full text-base font-medium transition-colors border border-gray-300"
            >
              Become a Volunteer
            </Link>
            
            <Link 
              to="/Guest/center" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-full text-base font-medium transition-colors"
            >
              Request Help <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <CheckCircleIcon className="text-green-600" sx={{ fontSize: 32 }} />
              <div className="text-left">
                <p className="text-xl font-bold">1,250+</p>
                <p className="text-sm text-gray-600">Requests Resolved</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <PeopleIcon className="text-blue-600" sx={{ fontSize: 32 }} />
              <div className="text-left">
                <p className="text-xl font-bold">800+</p>
                <p className="text-sm text-gray-600">Verified Volunteers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <LocationOnIcon className="text-orange-600" sx={{ fontSize: 32 }} />
              <div className="text-left">
                <p className="text-xl font-bold">30+</p>
                <p className="text-sm text-gray-600">Active Regions</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS (2 - GRAY) ================= */}
      <section id="how-it-works" className="bg-gray-100 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">How CrisisAid Works</h2>
          <p className="text-center text-gray-600 mb-12">
            A structured, hierarchical approach to emergency response management
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                <InfoOutlineIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Victims Raise Requests</h3>
              <p className="text-gray-600 text-sm">
                Emergency requests for medical aid, food, rescue, or shelter are submitted
                and routed to the nearest sub-center.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <CorporateFareIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Centers Coordinate</h3>
              <p className="text-gray-600 text-sm">
                Sub-centers prioritize and assign tasks while main centers manage escalations.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircleOutlineIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Volunteers Execute</h3>
              <p className="text-gray-600 text-sm">
                Volunteers complete tasks and update status in real time for accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SYSTEM ROLES (3 - LIGHT) ================= */}
      <section className="bg-gray-50 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">System Roles</h2>
          <p className="text-center text-gray-600 mb-12">
            Five roles working together in a coordinated emergency hierarchy
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7 mt-12">
            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-red-600">
              <InfoOutlineIcon className="text-red-600 mb-4" sx={{ fontSize: 32 }} />
              <h3 className="text-xl font-semibold mb-2">Victim</h3>
              <p className="text-gray-600 text-sm">
                Submit emergency requests for help and assistance.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-blue-600">
              <PeopleIcon className="text-blue-600 mb-4" sx={{ fontSize: 32 }} />
              <h3 className="text-xl font-semibold mb-2">Volunteer</h3>
              <p className="text-gray-600 text-sm">
                Execute assigned tasks and update progress.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-orange-600">
              <CorporateFareIcon className="text-orange-600 mb-4" sx={{ fontSize: 32 }} />
              <h3 className="text-xl font-semibold mb-2">Sub-Center</h3>
              <p className="text-gray-600 text-sm">
                Prioritize and manage local emergency requests.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-teal-600">
              <PhoneInTalkIcon className="text-teal-600 mb-4" sx={{ fontSize: 32 }} />
              <h3 className="text-xl font-semibold mb-2">Main Center</h3>
              <p className="text-gray-600 text-sm">
                Coordinate multiple sub-centers and escalations.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-purple-600">
              <ShieldIcon className="text-purple-600 mb-4" sx={{ fontSize: 32 }} />
              <h3 className="text-xl font-semibold mb-2">Admin</h3>
              <p className="text-gray-600 text-sm">
                Monitor the entire system and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KEY FEATURES (4 - GRAY) ================= */}
      <section className="bg-gray-100 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">Key Features</h2>
          <p className="text-center text-gray-600 mb-12">
            Built for real-world disaster management
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-red-100 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <LocationOnIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Location-Based Routing</h3>
                <p className="text-gray-600 text-sm">Requests are routed to the nearest sub-center automatically.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircleOutlineIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Volunteer Verification</h3>
                <p className="text-gray-600 text-sm">Only verified volunteers receive assignments.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Secure & Scalable</h3>
                <p className="text-gray-600 text-sm">Role-based access with scalable architecture.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Priority Management</h3>
                <p className="text-gray-600 text-sm">Urgent requests are prioritized automatically.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <PeopleIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Analytics Dashboard</h3>
                <p className="text-gray-600 text-sm">Admins get real-time system insights.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <PhoneInTalkIcon sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Status Tracking</h3>
                <p className="text-gray-600 text-sm">Track requests from submission to completion.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA (5 - LIGHT) ================= */}
      <section className="bg-gray-50 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-12 text-center border border-blue-200">
              <h2 className="text-3xl font-bold mb-4">Become a Volunteer</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Join trained responders making real impact.
              </p>
              <Link 
                to="/Guest/Volunteer" 
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-full text-base font-medium transition-colors"
              >
                Join as Volunteer <VolunteerActivismIcon sx={{ fontSize: 20 }} />
              </Link>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-12 text-center border border-green-200">
              <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Submit a request and get connected instantly.
              </p>
              <Link 
                to="/Guest/camp" 
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-full text-base font-medium transition-colors"
              >
                Submit Request <ArrowForwardIcon sx={{ fontSize: 20 }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="px-6 py-6 text-center text-sm text-gray-600 border-t border-gray-200">
        © {new Date().getFullYear()} CrisisAid. All rights reserved.
      </footer>

    </div>
  );
};

export default LandingPage;