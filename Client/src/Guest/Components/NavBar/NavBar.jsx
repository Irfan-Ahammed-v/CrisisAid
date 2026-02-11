import React from "react";
import style from "./NavBar.module.css";

const NavBar = () => {
  return (
    <header className={style.navbar}>
      {/* Left: Logo */}
      <div className={style.logoBlock}>
        <div className={style.logoCircle}>CA</div>
        <div>
          <h1 className={style.logoText}>CrisisAid</h1>
        </div>
      </div>

      <nav className={style.navLinks}>
        <a href="#top" className={style.navLink}>Home</a>
        <a href="#how-it-works" className={style.navLink}>How it works</a>
        <a href="#features" className={style.navLink}>Who we support</a>
        <a href="#volunteer" className={style.navLink}>Volunteer</a>
      </nav>


      <a href="" className={style.primaryBtn}>
        Request Help
      </a>
    </header>
  );
};

export default NavBar;
