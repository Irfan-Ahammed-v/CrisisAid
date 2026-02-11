import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const CenterRegister = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- FETCH DISTRICTS ---------------- */
  const fetchDistricts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/districts");
      setDistricts(res.data?.districts || []);
    } catch (err) {
      console.error(err);
      setDistricts([]);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const resetForm = () => {
    setDistrictId("");
    setEmail("");
    setPass("");
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      district_id: districtId,
      center_email: email,
      center_password: pass,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/center/register",
        payload
      );

      alert(res.data.message);
      resetForm();
      navigate("/guest/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Center Registration
          </h2>
          <p className="text-gray-600">
            Register a new center for disaster response coordination
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* District Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
              >
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.districtName}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                placeholder="center@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </>
              ) : (
                "Register Center"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/guest/login")}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-800 mb-2">About Center Registration</h3>
          <p className="text-blue-700 text-sm">
            Centers coordinate disaster relief operations within their district. 
            After registration, you'll need to verify your email before accessing 
            the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CenterRegister;