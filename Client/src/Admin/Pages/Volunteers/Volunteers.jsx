import { useEffect, useState } from "react";

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [centers, setCenters] = useState([]);
  const [places, setPlaces] = useState([]);

  const [district, setDistrict] = useState("");
  const [center, setCenter] = useState("");
  const [place, setPlace] = useState("");

  useEffect(() => {
    fetch("/api/admin/volunteers").then(res => res.json()).then(setVolunteers);
    fetch("/api/districts").then(res => res.json()).then(setDistricts);
  }, []);

  useEffect(() => {
    if (!district) {
      setCenters([]);
      setPlaces([]);
      return;
    }

    fetch(`/api/centers?district=${district}`)
      .then(res => res.json())
      .then(setCenters);

    setCenter("");
    setPlace("");
  }, [district]);

  useEffect(() => {
    if (!center) {
      setPlaces([]);
      return;
    }

    fetch(`/api/places?center=${center}`)
      .then(res => res.json())
      .then(setPlaces);

    setPlace("");
  }, [center]);

  const filteredVolunteers = volunteers.filter(v =>
    (!district || v.district_id === district) &&
    (!center || v.center_id === center) &&
    (!place || v.place_id === place)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Volunteer Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage volunteers by district, center and place
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Volunteers</p>
          <h2 className="text-2xl font-bold">{filteredVolunteers.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Districts</p>
          <h2 className="text-2xl font-bold">{districts.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Centers</p>
          <h2 className="text-2xl font-bold">{centers.length}</h2>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-5 rounded-lg shadow mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Filter Volunteers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="border rounded px-3 py-2 text-sm"
            value={district}
            onChange={e => setDistrict(e.target.value)}
          >
            <option value="">Select District</option>
            {districts.map(d => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>

          <select
            className="border rounded px-3 py-2 text-sm"
            value={center}
            disabled={!district}
            onChange={e => setCenter(e.target.value)}
          >
            <option value="">Select Center</option>
            {centers.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <select
            className="border rounded px-3 py-2 text-sm"
            value={place}
            disabled={!center}
            onChange={e => setPlace(e.target.value)}
          >
            <option value="">Select Place</option>
            {places.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Volunteer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVolunteers.map(v => (
          <div
            key={v._id}
            className="bg-white rounded-lg shadow hover:shadow-md transition p-5"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={v.photo}
                alt="volunteer"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{v.name}</h4>
                <p className="text-xs text-gray-500">{v.placeName}</p>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p><strong>District:</strong> {v.districtName}</p>
              <p><strong>Center:</strong> {v.centerName}</p>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => window.open(v.proof)}
                className="text-sm text-blue-600 hover:underline"
              >
                View Proof
              </button>

              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                View Profile
              </button>
            </div>
          </div>
        ))}

        {filteredVolunteers.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No volunteers found
          </div>
        )}
      </div>
    </div>
  );
}
