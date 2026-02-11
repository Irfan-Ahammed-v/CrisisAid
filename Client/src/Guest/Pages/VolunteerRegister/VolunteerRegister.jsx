import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const VolunteerRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [CenterId, setCenterId] = useState("");
  const [password, setPassword] = useState("");

  const [districts, setDistricts] = useState([]);
  const [centers, setCenters] = useState([]);

  const navigate = useNavigate();

  /* FETCH DISTRICTS */
  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/districts")
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
      .get(`http://localhost:5000/admin/centers/${districtId}`)
      .then((res) => setCenters(res.data.centers))
      .catch(console.error);
  }, [districtId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/volunteer/register",
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
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Volunteer Registration
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Register to assist in crisis response
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input label="Full Name" value={name} onChange={setName} />
          <Input label="Email" value={email} onChange={setEmail} />

          {/* DISTRICT */}
          <Select
            label="District"
            value={districtId}
            onChange={setDistrictId}
            options={districts.map(d => ({
              value: d._id,
              label: d.districtName,
            }))}
            placeholder="Select District"
          />

          {/* SUBCENTER */}
          <Select
            label="Center"
            value={CenterId}
            onChange={setCenterId}
            disabled={!districtId}
            options={centers.map(s => ({
              value: s._id,
              label: s.center_name,
            }))}
            placeholder="Select Subcenter"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerRegister;

/* ---------- REUSABLE INPUT ---------- */

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full rounded-lg border border-gray-300
        px-3 py-2.5 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
      required
    />
  </div>
);

/* ---------- REUSABLE SELECT ---------- */

const Select = ({ label, value, onChange, options, placeholder, disabled }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="
        w-full rounded-lg border border-gray-3  00
        px-3 py-2.5 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:bg-gray-100 disabled:text-gray-400
      "
      required
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
