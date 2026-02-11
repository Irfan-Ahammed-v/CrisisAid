import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./EditProfile.module.css";
import { Link } from "react-router";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "Rahul Nair",
    age: 24,
    phone: "9876543210",
    email: "rahul@ca.com",
    district: "Thrissur",
    center: "Ollur Center",
    bloodGroup: "O+",
    availability: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Volunteer Data:", formData);
    alert("Profile updated ");
  };

  return (
    <div className={styles.page}>

            {/* TOP BAR */}
      <div className={styles.topbar}>
        <Link to="/Volunteer/profile" className={styles.btn}>
          <ArrowBackIcon /> Back
        </Link>

        <h2 className={styles.title}>Edit Volunteer Profile</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>

        {/* BASIC INFO */}
        <div className={styles.section}>
          <h3>Basic Information</h3>

          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Age
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </label>

        {/* CONTACT */}
          <h3>Contact Details</h3>

          <label>
            Phone Number
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

        {/* LOCATION */}
          <h3>Location</h3>

          <label>
            District
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
            />
          </label>

          <label>
            Center
            <input
              type="text"
              name="center"
              value={formData.center}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button type="button" className={styles.cancel}>
            Cancel
          </button>
          <button type="submit" className={styles.save}>
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProfile;
