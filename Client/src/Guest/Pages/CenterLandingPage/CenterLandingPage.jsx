import React from "react";
import { ArrowRight, Store, CheckCircle, Package, Users, MapPin, Bell, Truck } from "lucide-react";
import { Link } from "react-router";

const CenterLandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-gray-50 px-6 py-20 lg:px-16">
        <div className="max-w-7xl mx-auto text-center my-16">

          <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Relief Centers <br /> Powering Emergency Response
          </h2>

          <div className="text-lg text-gray-600 space-y-2 mb-8 max-w-3xl mx-auto">
            <p>Centers act as the backbone of disaster operations</p>
            <p>by managing resources, coordinating volunteers,</p>
            <p>and supporting nearby relief camps.</p>
          </div>

          <div className="flex justify-center gap-4 mb-10">
            <a 
              href="/Guest/center_register" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-full text-base font-medium transition-colors"
            >
              Register Center <ArrowRight size={20} />
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <Store className="text-red-600" size={32} />
              <div className="text-left">
                <p className="text-xl font-bold">480+</p>
                <p className="text-sm text-gray-600">Active Centers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <Package className="text-blue-600" size={32} />
              <div className="text-left">
                <p className="text-xl font-bold">2.4M+</p>
                <p className="text-sm text-gray-600">Resources Managed</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-200 min-w-[220px]">
              <MapPin className="text-green-600" size={32} />
              <div className="text-left">
                <p className="text-xl font-bold">42+</p>
                <p className="text-sm text-gray-600">Regions Covered</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gray-100 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">How Centers Operate</h2>
          <p className="text-center text-gray-600 mb-12">
            A structured system for efficient relief coordination
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Store size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Center Registration</h3>
              <p className="text-gray-600 text-sm">
                Centers register with location, facilities, storage capacity, and contact details.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authority Verification</h3>
              <p className="text-gray-600 text-sm">
                Centers are verified by administrators and authorities to ensure compliance and trust.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Bell size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive Requests</h3>
              <p className="text-gray-600 text-sm">
                Get requests from camps and admins for resources, logistics, or volunteer coordination.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Truck size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dispatch & Support</h3>
              <p className="text-gray-600 text-sm">
                Allocate resources, assign volunteers, and track support operations in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CENTER ROLES ================= */}
      <section className="bg-gray-50 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">Center Responsibilities</h2>
          <p className="text-center text-gray-600 mb-12">
            Key operational roles during disaster response
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-12">
            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-blue-600">
              <Package className="text-blue-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Resource Management</h3>
              <p className="text-gray-600 text-sm">
                Maintain and track food, medicine, and essential supplies.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-green-600">
              <Users className="text-green-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Volunteer Coordination</h3>
              <p className="text-gray-600 text-sm">
                Assign verified volunteers to camps and operations.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-orange-600">
              <Truck className="text-orange-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Logistics Support</h3>
              <p className="text-gray-600 text-sm">
                Ensure timely transportation of resources and aid.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-lg border-l-4 border-purple-600">
              <CheckCircle className="text-purple-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Status Reporting</h3>
              <p className="text-gray-600 text-sm">
                Provide updates on stock levels and operation progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KEY FEATURES ================= */}
      <section className="bg-gray-100 px-6 py-16 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-3">Center Features</h2>
          <p className="text-center text-gray-600 mb-12">
            Built for coordination, accountability, and scale
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Inventory Tracking</h3>
                <p className="text-gray-600 text-sm">Monitor stock levels in real time.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Volunteer Assignment</h3>
                <p className="text-gray-600 text-sm">Deploy volunteers efficiently where needed.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Request Alerts</h3>
                <p className="text-gray-600 text-sm">Instant alerts from camps and authorities.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Verified Operations</h3>
                <p className="text-gray-600 text-sm">All actions logged and auditable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="px-6 py-6 text-center text-sm text-gray-600 border-t border-gray-200">
        © {new Date().getFullYear()} CrisisAid Centers. All rights reserved.
      </footer>

    </div>
  );
};

export default CenterLandingPage;
