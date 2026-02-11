import React from "react";
import { ArrowRight, Home, Users, CheckCircle, MapPin, Activity, Info, Package, Heart } from "lucide-react";

const ReliefCampLandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-gray-50 px-6 py-20 lg:px-16">
        <div className="max-w-7xl mx-auto text-center my-16">

          <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Organized Relief Camps <br /> For Emergency Shelter & Care
          </h2>

          <div className="text-lg text-gray-600 space-y-2 mb-8 max-w-3xl mx-auto">
            <p>ReliefCamp is a centralized platform for managing emergency shelters,</p>
            <p>resource distribution, medical support, and displaced people</p>
            <p>during natural or man-made disasters.</p>
          </div>

          <div className="flex justify-center gap-4 mb-10">
            <a 
              href="/Guest/camp_register" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-full text-base font-medium transition-colors"
            >
              Register Camp <ArrowRight size={20} />
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <CheckCircle className="text-green-600" size={32} />
              <div className="text-left">
                <p className="text-xl font-bold">320+</p>
                <p className="text-sm text-gray-600">Camps Managed</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <Users className="text-blue-600" size={32} />
              <div className="text-left">
                <p className="text-xl font-bold">18,000+</p>
                <p className="text-sm text-gray-600">People Sheltered</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <MapPin className="text-orange-600" size={32} />
              <div className="text-left">
                <p className="text-xl font-bold">45+</p>
                <p className="text-sm text-gray-600">Disaster Zones</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gray-100 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">How ReliefCamp Works</h2>
          <p className="text-center text-gray-600 mb-12">
            A structured approach to shelter and resource management
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                <Info size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Camp Registration</h3>
              <p className="text-gray-600 text-sm">
                Relief camps are registered with location, capacity, facilities, and contact details.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Package size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resource Allocation</h3>
              <p className="text-gray-600 text-sm">
                Food, medicine, clothing, and essentials are tracked and distributed efficiently.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">People Care & Tracking</h3>
              <p className="text-gray-600 text-sm">
                Camp residents are monitored for health, safety, and relocation needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SYSTEM ROLES ================= */}
      <section className="bg-gray-50 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">Relief Camp Roles</h2>
          <p className="text-center text-gray-600 mb-12">
            Coordinated roles for effective relief operations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7 mt-12">
            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-red-600">
              <Home className="text-red-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Camp Admin</h3>
              <p className="text-gray-600 text-sm">
                Manages shelter capacity, facilities, and daily operations.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-blue-600">
              <Users className="text-blue-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Volunteers</h3>
              <p className="text-gray-600 text-sm">
                Assist with logistics, food distribution, and care.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-orange-600">
              <Activity className="text-orange-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Medical Team</h3>
              <p className="text-gray-600 text-sm">
                Provide medical aid and health monitoring.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-teal-600">
              <Package className="text-teal-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Resource Manager</h3>
              <p className="text-gray-600 text-sm">
                Tracks inventory and supplies.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-purple-600">
              <CheckCircle className="text-purple-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Authorities</h3>
              <p className="text-gray-600 text-sm">
                Oversee compliance and disaster coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KEY FEATURES ================= */}
      <section className="bg-gray-100 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">Key Features</h2>
          <p className="text-center text-gray-600 mb-12">
            Built for large-scale disaster relief operations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-red-100 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Home size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Camp Capacity Tracking</h3>
                <p className="text-gray-600 text-sm">Monitor occupancy and available shelter space.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Resource Inventory</h3>
                <p className="text-gray-600 text-sm">Track food, water, medicine, and supplies.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Medical Support</h3>
                <p className="text-gray-600 text-sm">Integrated health and emergency care tracking.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Status Monitoring</h3>
                <p className="text-gray-600 text-sm">Real-time updates on camp conditions.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Volunteer Coordination</h3>
                <p className="text-gray-600 text-sm">Assign helpers efficiently across camps.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Location Based Access</h3>
                <p className="text-gray-600 text-sm">Find and manage camps by region.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="px-6 py-6 text-center text-sm text-gray-600 border-t border-gray-200">
        © {new Date().getFullYear()} ReliefCamp. All rights reserved.
      </footer>

    </div>
  );
};

export default ReliefCampLandingPage;