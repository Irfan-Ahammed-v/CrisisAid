import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  Tent, 
  Mail, 
  Lock, 
  MapPin, 
  Building2, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  Loader2,
  Warehouse,
  ClipboardList,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CampRegister = () => {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000";

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

  /* ---------------- VALIDATION STATE ---------------- */
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  /* ---------------- FETCH CENTERS ---------------- */
  const fetchCenters = async (dId) => {
    if (!dId) {
      setCenters([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/camp/centers/${dId}`);
      setCenters(res.data?.centers || []);
    } catch (err) {
      console.error(err);
      setCenters([]);
    }
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (districtId) {
      fetchCenters(districtId);
    } else {
      setCenters([]);
    }
    setCenterId(""); 
  }, [districtId]);

  /* ---------------- VALIDATION LOGIC ---------------- */
  const validateForm = () => {
    const newErrors = {};
    
    if (!Cname.trim()) newErrors.Cname = "Camp name is required";
    else if (Cname.length < 3) newErrors.Cname = "Name must be at least 3 characters";

    if (!address.trim()) newErrors.address = "Address is required";
    else if (address.length < 10) newErrors.address = "Please provide more detail";

    if (!Cdetails.trim()) newErrors.Cdetails = "Camp details are required";

    if (!districtId) newErrors.districtId = "Select a district";
    if (!centerId) newErrors.centerId = "Select a center";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email address";
    else {
      const [username, domainPart] = email.split('@');
      const domainName = domainPart.split('.')[0];
      if (username.length < 3) newErrors.email = "Username too short";
      else if (domainName.length < 3) newErrors.email = "Domain too short";
    }

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Min. 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
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
        `${BASE_URL}/camp/register`,
        payload
      );
      alert(res.data.message);
      navigate("/guest/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center px-6 py-12 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-10 text-center text-3xl font-black tracking-tight text-white uppercase">
          CrisisAid
        </h2>
        <h2 className="mt-2 text-center text-lg font-medium tracking-tight text-gray-400">
          Establish a new emergency response unit
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm"
        >
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Camp Name" 
                  icon={<Warehouse size={18} />}
                  value={Cname} 
                  onChange={(val) => { setCname(val); if(errors.Cname) setErrors({...errors, Cname: ""}) }} 
                  error={errors.Cname} 
                  placeholder="e.g. Hope Relief Station"
                />

                <Input 
                  label="Physical Address" 
                  icon={<MapPin size={18} />}
                  value={address} 
                  onChange={(val) => { setAddress(val); if(errors.address) setErrors({...errors, address: ""}) }} 
                  error={errors.address} 
                  placeholder="Full location details"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                  Operational Details
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-4 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                    <ClipboardList size={18} />
                  </div>
                  <textarea
                    value={Cdetails}
                    onChange={(e) => { setCdetails(e.target.value); if(errors.Cdetails) setErrors({...errors, Cdetails: ""}) }}
                    placeholder="Describe facilities and capacity..."
                    rows="3"
                    className={`
                      w-full rounded-xl bg-white/5 px-4 pl-12 py-3 text-white outline-none border transition-all sm:text-sm resize-none
                      ${errors.Cdetails ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}
                      placeholder:text-gray-600
                    `}
                  />
                </div>
                {errors.Cdetails && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 mt-1">{errors.Cdetails}</motion.p>
                )}
              </div>

              {/* Hierarchy Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="District"
                  icon={<MapPin size={18} />}
                  value={districtId}
                  onChange={(val) => { setDistrictId(val); if(errors.districtId) setErrors({...errors, districtId: ""}) }}
                  error={errors.districtId}
                  options={districts.map(d => ({ value: d._id, label: d.districtName }))}
                  placeholder="Select district"
                />

                <Select
                  label="Supervising Center"
                  icon={<Building2 size={18} />}
                  value={centerId}
                  onChange={(val) => { setCenterId(val); if(errors.centerId) setErrors({...errors, centerId: ""}) }}
                  error={errors.centerId}
                  disabled={!districtId}
                  options={centers.map(c => ({ value: c._id, label: c.center_name}))}
                  placeholder="Select center"
                />
              </div>

              {/* Access Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Access Email" 
                  icon={<Mail size={18} />}
                  type="email"
                  value={email} 
                  onChange={(val) => { setEmail(val); if(errors.email) setErrors({...errors, email: ""}) }} 
                  error={errors.email} 
                  placeholder="camp@service.gov"
                />

                <Input
                  label="password"
                  icon={<Lock size={18} />}
                  type="password"
                  value={password}
                  onChange={(val) => { setPassword(val); if(errors.password) setErrors({...errors, password: ""}) }}
                  error={errors.password}
                  placeholder="Min. 6 characters"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Register
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-400">
              Already part of the network?{' '}
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

/* ---------- REUSABLE COMPONENTS ---------- */

const Input = ({ label, icon, value, onChange, type = "text", error, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full rounded-xl bg-white/5 px-4 pl-12 py-3 text-white outline-none border transition-all sm:text-sm
          ${error ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}
          placeholder:text-gray-600
        `}
      />
    </div>
    {error && (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 mt-1 flex items-center gap-1.5">
        <AlertCircle size={12} />
        {error}
      </motion.p>
    )}
  </div>
);

const Select = ({ label, icon, value, onChange, options, placeholder, disabled, error }) => (
  <div className="space-y-2">
    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors z-10">
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full rounded-xl bg-white/5 px-4 pl-12 py-3 text-white outline-none border transition-all sm:text-sm appearance-none cursor-pointer
          ${error ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}
          disabled:opacity-30 disabled:cursor-not-allowed
        `}
      >
        <option value="" className="bg-gray-800 text-gray-400">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-gray-800 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">
        ▼
      </div>
    </div>
    {error && (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 mt-1 flex items-center gap-1.5">
        <AlertCircle size={12} />
        {error}
      </motion.p>
    )}
  </div>
);

export default CampRegister;
