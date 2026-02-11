import axios from "axios";
import React, { useEffect, useState } from "react";

const CampRegister = () => {
  /* ---------------- FORM STATE ---------------- */
  const [districts, setDistricts] = useState([]);
  const [centers, setCenters] = useState([]);

  const [Cname, setCname] = useState("");
  const [address, setAddress] = useState("");
  const [Cdetails, setCdetails] = useState("");

  const [districtId, setDistrictId] = useState("");
  const [centerId, setCenterId] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ---------------- FETCH DISTRICTS ---------------- */
  const fetchDistricts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/admin/districts"
      );
      setDistricts(res.data?.districts || []);
    } catch (err) {
      console.error(err);
      setDistricts([]);
    }
  };

  /* ---------------- FETCH CENTERS ---------------- */
  const fetchCenters = async (districtId) => {
    if (!districtId) {
      setCenters([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/camp/centers/${districtId}`
      );
      setCenters(res.data?.centers || []);
    } catch (err) {
      console.error(err);
      setCenters([]);
    }
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    fetchDistricts();
    fetchCenters(districtId);
    setCenterId(""); 
  }, [districtId]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      camp_name: Cname,
      camp_address: address,
      camp_details: Cdetails,
      district_id: districtId,
      center_id: centerId,
      camp_email: email,
      camp_password: password,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/camp/register",
        payload
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Camp Registration
          </h2>
          <p className="text-gray-600">
            Register a new relief camp in the system
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Camp Name */}
            <div>
              <label htmlFor="campName" className="block text-sm font-medium text-gray-700 mb-2">
                Camp Name
              </label>
              <input
                id="campName"
                type="text"
                value={Cname}
                onChange={(e) => setCname(e.target.value)}
                required
                placeholder="Enter camp name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Enter camp address"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Details */}
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                Camp Details
              </label>
              <textarea
                id="details"
                value={Cdetails}
                onChange={(e) => setCdetails(e.target.value)}
                required
                placeholder="Enter additional details about the camp"
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* District and Center Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* District */}
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  id="district"
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.districtName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Center */}
              <div>
                <label htmlFor="center" className="block text-sm font-medium text-gray-700 mb-2">
                  Center
                </label>
                <select
                  id="center"
                  value={centerId}
                  onChange={(e) => setCenterId(e.target.value)}
                  required
                  disabled={!districtId}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Center</option>
                  {centers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.center_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email and Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="camp@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Register Camp
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default CampRegister;
