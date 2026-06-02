import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  MapPin, 
  Building2, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VolunteerRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [CenterId, setCenterId] = useState("");
  const [password, setPassword] = useState("");

  const [districts, setDistricts] = useState([]);
  const [centers, setCenters] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000";

  /* FETCH DISTRICTS */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/districts`)
      .then((res) => setDistricts(res.data.districts))
      .catch(console.error);
  }, []);

  /* FETCH SUBCENTERS WHEN DISTRICT */
  useEffect(() => {
    if (!districtId) {
      setCenters([]);
      setCenterId("");
      return;
    }

    axios
      .get(`${BASE_URL}/admin/centers/${districtId}`)
      .then((res) => setCenters(res.data.centers))
      .catch(console.error);
  }, [districtId]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Full name is required";
    else if (name.length < 3) newErrors.name = "Name must be at least 3 characters";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";
    else {
      const [username, domainPart] = email.split('@');
      const domainName = domainPart.split('.')[0];
      if (username.length < 3) newErrors.email = "Username part must be at least 3 characters";
      else if (domainName.length < 3) newErrors.email = "Domain name must be at least 3 characters";
    }

    if (!districtId) newErrors.districtId = "Please select a district";
    if (!CenterId) newErrors.CenterId = "Please select a center";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/volunteer/register`,
        {
          volunteer_name:name,
          volunteer_email:email,
          district_id:districtId,
          center_id:CenterId,
          volunteer_password:password,
        }
      );

      alert(res.data.message);
      navigate("/guest/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center px-6 py-12 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-10 text-center text-3xl font-black tracking-tight text-white uppercase">
          CrisisAid
        </h2>
        <h2 className="mt-2 text-center text-lg font-medium tracking-tight text-gray-400">
          Join the Response Force
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
              <Input 
                label="Full Name" 
                icon={<UserPlus size={18} />}
                value={name} 
                onChange={(val) => { setName(val); if(errors.name) setErrors({...errors, name: ""}) }} 
                error={errors.name} 
                placeholder="Enter your full name"
              />
              
              <Input 
                label="Email Address" 
                icon={<Mail size={18} />}
                type="email"
                value={email} 
                onChange={(val) => { setEmail(val); if(errors.email) setErrors({...errors, email: ""}) }} 
                error={errors.email} 
                placeholder="name@example.com"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="District"
                  icon={<MapPin size={18} />}
                  value={districtId}
                  onChange={(val) => { setDistrictId(val); if(errors.districtId) setErrors({...errors, districtId: ""}) }}
                  error={errors.districtId}
                  options={districts.map(d => ({
                    value: d._id,
                    label: d.districtName,
                  }))}
                  placeholder="Select District"
                />

                <Select
                  label="Target Center"
                  icon={<Building2 size={18} />}
                  value={CenterId}
                  onChange={(val) => { setCenterId(val); if(errors.CenterId) setErrors({...errors, CenterId: ""}) }}
                  error={errors.CenterId}
                  disabled={!districtId}
                  options={centers.map(s => ({
                    value: s._id,
                    label: s.center_name,
                  }))}
                  placeholder="Select Center"
                />
              </div>

              <Input
                label="Security Password"
                icon={<Lock size={18} />}
                type="password"
                value={password}
                onChange={(val) => { setPassword(val); if(errors.password) setErrors({...errors, password: ""}) }}
                error={errors.password}
                placeholder="Create a strong password"
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      REgister
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-400">
              Already have an account?{' '}
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
      <motion.p 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs text-red-400 mt-1 flex items-center gap-1.5"
      >
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
      <motion.p 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs text-red-400 mt-1 flex items-center gap-1.5"
      >
        <AlertCircle size={12} />
        {error}
      </motion.p>
    )}
  </div>
);


export default VolunteerRegister;
