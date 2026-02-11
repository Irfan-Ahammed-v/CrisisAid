import React from "react";
import style from "./SideBar.module.css";

import LogoutIcon from "@mui/icons-material/Logout";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Storefront from "@mui/icons-material/Storefront";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { NavLink } from "react-router";

const SideBar = () => {
  const linkClass = ({ isActive }) =>
    isActive ? `${style.navlinks} ${style.active}` : style.navlinks;

  return (
    <aside className={style.sidebar}>
      {/* TOP: Logo */}
      <div className={style.logoSection}>
        <div className={style.logoCircle}>CA</div>
        <div className={style.logoTextGroup}>
          <h2 className={style.logoTitle}>CrisisAid</h2>
          <p className={style.logoSubtitle}>Admin Panel</p>
        </div>
      </div>

      {/* MIDDLE: Navigation Links */}
      <nav className={style.links}>
        <p className={`${style.sectionLabel} ${style.collapsedText}`}>
          Overview
        </p>
        <NavLink to="/Admin" className={linkClass}>
          <SpaceDashboardIcon className={style.icon} />
          <span className={style.navText}>Dashboard</span>
        </NavLink>

        <p className={`${style.sectionLabel} ${style.collapsedText}`}>
          Requests
        </p>
        <NavLink to="/Admin/Requests" className={linkClass}>
          <ListAltIcon className={style.icon} />
          <span className={style.navText}>All Requests</span>
        </NavLink>
        <NavLink to="/Admin/Requests/Pending" className={linkClass}>
          <HourglassTopIcon className={style.icon} />
          <span className={style.navText}>Pending</span>
        </NavLink>
        <NavLink to="/Admin/Requests/Resolved" className={linkClass}>
          <CheckCircleIcon className={style.icon} />
          <span className={style.navText}>Resolved</span>
        </NavLink>

        <p className={`${style.sectionLabel} ${style.collapsedText}`}>People</p>
        <NavLink to="/Admin/Victims" className={linkClass}>
          <PeopleIcon className={style.icon} />
          <span className={style.navText}>Victims</span>
        </NavLink>
        <NavLink to="/Admin/Volunteers" className={linkClass}>
          <VolunteerActivismIcon className={style.icon} />
          <span className={style.navText}>Volunteers</span>
        </NavLink>

        <p className={`${style.sectionLabel} ${style.collapsedText}`}>
          Resourses
        </p>
        <NavLink to="/Admin/Centers" className={linkClass}>
          <Storefront className={style.icon} />
          <span className={style.navText}>Centers</span>
        </NavLink>

        <p className={`${style.sectionLabel} ${style.collapsedText}`}>
          Master Entries
        </p>
        <NavLink to="/Admin/MasterEntries" className={linkClass}>
          <AdminPanelSettingsIcon className={style.icon} />
          <span className={style.navText}>Master Entries </span>
        </NavLink>

        <p className={`${style.sectionLabel} ${style.collapsedText}`}>
          Insights
        </p>
        <NavLink to="/Admin/Reports" className={linkClass}>
          <AssessmentIcon className={style.icon} />
          <span className={style.navText}>Reports</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default SideBar;
