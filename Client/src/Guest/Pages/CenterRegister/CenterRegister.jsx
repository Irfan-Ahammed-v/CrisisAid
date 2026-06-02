import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  Building2, 
  Mail, 
  Lock, 
  MapPin, 
  ArrowLeft, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  Loader2,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CenterRegister = () => {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000";

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* ---------------- FETCH DISTRICTS ---------------- */
  const fetchDistricts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/districts`);
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
    setErrors({});
  };

  /* ---------------- VALIDATION LOGIC ---------------- */
  const validateForm = () => {
    const newErrors = {};

    if (!districtId) newErrors.districtId = "Please select a district";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";
    else {
      const [username, domainPart] = email.split('@');
      const domainName = domainPart.split('.')[0];
      if (username.length < 3) newErrors.email = "Username part must be at least 3 characters";
      else if (domainName.length < 3) newErrors.email = "Domain name must be at least 3 characters";
    }

    if (!pass) newErrors.password = "Password is required";
    else if (pass.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const payload = {
      district_id: districtId,
      center_email: email,
      center_password: pass,
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/center/register`,
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-10 text-center text-3xl font-black tracking-tight text-white uppercase">
          CrisisAid
        </h2>
        <h2 className="mt-2 text-center text-lg font-medium tracking-tight text-gray-400">
          Establish a new regional coordination hub
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm"
        >
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* District Select */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                  Primary District
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors z-10">
                    <MapPin size={18} />
                  </div>
                  <select
                    value={districtId}
                    onChange={(e) => { setDistrictId(e.target.value); if(errors.districtId) setErrors({...errors, districtId: ""}) }}
                    className={`
                      w-full rounded-xl bg-white/5 px-4 pl-12 py-3 text-white outline-none border transition-all sm:text-sm appearance-none cursor-pointer
                      ${errors.districtId ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}
                    `}
                  >
                    <option value="" className="bg-gray-800 text-gray-400">Select administrative district</option>
                    {districts.map((d) => (
                      <option key={d._id} value={d._id} className="bg-gray-800">
                        {d.districtName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">
                    ▼
                  </div>
                </div>
                {errors.districtId && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-red-400 mt-1 flex items-center gap-1.5"
                  >
                    <AlertCircle size={12} />
                    {errors.districtId}
                  </motion.p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                  Access Email
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors({...errors, email: ""}) }}
                    placeholder="center@service.gov"
                    className={`
                      w-full rounded-xl bg-white/5 px-4 pl-12 py-3 text-white outline-none border transition-all sm:text-sm
                      ${errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}
                      placeholder:text-gray-600
                    `}
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-red-400 mt-1 flex items-center gap-1.5"
                  >
                    <AlertCircle size={12} />
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                  Security Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => { setPass(e.target.value); if(errors.password) setErrors({...errors, password: ""}) }}
                    placeholder="Create a secure gateway code"
                    className={`
                      w-full rounded-xl bg-white/5 px-4 pl-12 py-3 text-white outline-none border transition-all sm:text-sm
                      ${errors.password ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}
                      placeholder:text-gray-600
                    `}
                  />
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-red-400 mt-1 flex items-center gap-1.5"
                  >
                    <AlertCircle size={12} />
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Register Center
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-400">
              Already a member?{' '}
              <button 
                onClick={() => navigate("/guest/login")} 
                className="font-bold text-indigo-400 hover:text-indigo-300"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CenterRegister;