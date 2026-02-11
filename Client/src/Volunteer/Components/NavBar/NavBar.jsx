import React, { useState } from "react";
import style from "./NavBar.module.css";

import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link } from "react-router";

const NavBar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  return (
    <header className={style.navbar}>
      <div></div>

      <div className={style.right}>
        {/* NOTIFICATION ICON */}
        <NotificationsIcon sx={{ fontSize: 28 }}
          className={style.rawIcon}
          onClick={() => {
            setOpenNotif(!openNotif);
            setOpenProfile(false); // close profile menu when opening notifications
          }}
        />

        {/* NOTIFICATION DROPDOWN */}
        {openNotif && (
          <div className={style.dropdownNotif}>
            <p className={style.notifItem}>No new notifications</p>
          </div>
        )}

        {/* PROFILE ICON */}
        <AccountCircleIcon sx={{ fontSize: 30 }}
          className={style.rawIcon}
          onClick={() => {
            setOpenProfile(!openProfile);
            setOpenNotif(false);
          }}
        />

        {/* PROFILE DROPDOWN */}
        {openProfile && (
          <div className={style.dropdown}>
            <Link to="/Volunteer/Profile" className={style.dropItem}>
              <AccountCircleIcon /> Profile
            </Link>

            <Link to="/Volunteer/Settings" className={style.dropItem}>
              <SettingsIcon /> Settings
            </Link>

            <button className={style.dropItem}>
              <LogoutIcon /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
