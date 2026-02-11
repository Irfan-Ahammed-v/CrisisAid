import React from "react";
import styles from "./MyProfile.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import Profile from '../../../assets/Profile.jpg'
import { Link } from "react-router";


const MyProfile = () => {
  return (
    <div className={styles.main}>
        <div className={styles.page}>

      {/* TOP BAR */}
      <div className={styles.topbar}>
        <Link to="/Volunteer" className={styles.btn}>
          <ArrowBackIcon /> Back
        </Link>

        <h2>My Profile</h2>

        <div className={styles.actions}>
          <div className={styles.btn}>
            <Link to="EditProfile" className={styles.dropItem}>
            <EditIcon /> Edit
          </Link>
          </div>
        </div>
      </div>

      {/* PROFILE HEADER */}
      <div className={styles.profileCard}>
        <img
          src={Profile}
          alt="volunteer"
          className={styles.avatar}
        />

        <div className={styles.profileInfo}>
          <h3>Rahul Nair</h3>
          <p>ID: VOL-1023</p>
          <p><LocationPinIcon/>Thrissur</p>
          <p><LocalPhoneIcon/>9876543210</p>
          <p><EmailIcon/> rahul@ca.com</p>
          <p>Member Since 28 june 2025</p>
        </div>
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>42</h3>
          <p>Requests Served</p>
        </div>
        <div className={styles.statCard}>
          <h3>2</h3>
          <p>Active Tasks</p>
        </div>
        <div className={styles.statCard}>
          <h3>38</h3>
          <p>Completed</p>
        </div>
      </div>

      {/* SKILLS */}
      <div className={styles.section}>
        <h3>Skills</h3>
        <div className={styles.chips}>
          <span>First Aid</span>
          <span>Driving</span>
          <span>Medical Support</span>
        </div>
      </div>

      {/* ASSIGNMENT HISTORY */}
      <div className={styles.section}>
        <h3>Assignment History</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>12 Dec</td>
              <td>Medical</td>
              <td>Thrissur</td>
              <td className={styles.green}>Completed</td>
            </tr>
            <tr>
              <td>14 Dec</td>
              <td>Food Supply</td>
              <td>Ollur</td>
              <td className={styles.orange}>In Progress</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    </div>
  );
};

export default MyProfile;
