const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Centers = require("../models/centers");
const Admin = require("../models/admin");
const Volunteer = require("../models/volunteer");
const Camp = require("../models/reliefcamp");
const Center = require("../models/centers");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    let user = null;
    let role = null;
    let hashedPassword = null;

    // CHECK USER TYPE
    const camp = await Camp.findOne({ camp_email: email });
    if (camp) {
      user = camp;
      role = "camp";
      hashedPassword = camp.camp_password;
    }

    const center = await Centers.findOne({ center_email: email });
    if (!user && center) {
      user = center;
      role = "center";
      hashedPassword = center.center_password;
    }

    const volunteer = await Volunteer.findOne({ volunteer_email: email });
    if (!user && volunteer) {
      user = volunteer;
      role = "volunteer";
      hashedPassword = volunteer.volunteer_password;
    }

    const admin = await Admin.findOne({ admin_email: email });
    if (!user && admin) {
      user = admin;
      role = "admin";
      hashedPassword = admin.admin_password;
    }

    // USER NOT FOUND
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // CREATE JWT
    let district_id = null;
    let center_id = null;
    if (role === "camp") {
      district_id = user.district_id;
    }

    if (role === "center") {
      district_id = user.district_id;
    }

    if (role === "volunteer") {
      district_id = user.district_id;
      center_id = user.center_id;
      // or later: fetch from center if not directly stored
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: role,
        district_id: user.district_id,
        center_id: center_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // SET COOKIE (ONE COOKIE ONLY)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const { id, role } = req.user; // injected by verifyToken

    let user = null;
    let name = null;
    let profile = null;

    switch (role) {
      case "camp": {
        profile = await Camp.findById(id)
          .select("camp_name camp_status profileCompleted");
        if (profile) name = profile.camp_name;
        break;
      }

      case "center": {
        profile = await Center.findById(id)
          .select("center_name center_status");
        if (profile) name = profile.center_name;
        break;
      }

      case "admin": {
        profile = await Admin.findById(id)
          .select("admin_name");
        if (profile) name = profile.admin_name;
        break;
      }

      case "volunteer": {
        profile = await Volunteer.findById(id)
          .select("volunteer_name availability");
        if (profile) name = profile.volunteer_name;
        break;
      }

      default:
        return res.status(403).json({ message: "Invalid role" });
    }

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Unified response
    res.status(200).json({
      id,
      role,
      name,
      profile
    });

  } catch (err) {
    console.error("ME controller error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production
  });

  res.status(200).json({ message: "Logged out successfully" });
};

