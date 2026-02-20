const express = require("express");
const {
  centerReg,
  completeCenterProfile,
  centerLogout,
  home,
  getOverview,
  getCamps,
  updatecapacity,
  approveCamp,
  RejectCamp,
  updateCampStatus
} = require("../controllers/centers.controller");

const { centerAuth } = require("../middlewares/centerAuth");
const { profileCompletedCheck } = require("../middlewares/profileCompleted");

const router = express.Router();

/* ---------- PUBLIC ROUTES ---------- */
router.post("/register", centerReg);

/* ---------- PROTECTED ROUTES ---------- */
router.get("/overview",centerAuth,getOverview);
router.put("/complete-profile", centerAuth, completeCenterProfile);
router.get("/home", centerAuth,home);
router.post("/logout", centerLogout);
router.get("/getcamps",centerAuth,getCamps);
router.put("/updateCamp/:campId",centerAuth, updateCampStatus);
module.exports = router;

