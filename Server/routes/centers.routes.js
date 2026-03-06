const express = require("express");
const {
  centerReg,
  completeCenterProfile,
  centerLogout,
  home,
  getOverview,
  getCamps,
  updateCampStatus,
  getRequests,
  getVolunteers,
  updateRequestStatus,
  assignVolunteers,
  VolunteersApproval,
  verifyVolunteer,
  getAllDisasters,
  updateDisasterStatus
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
router.get("/getrequests", centerAuth, getRequests);
router.get("/volunteers", centerAuth, getVolunteers);
router.get("/pending-volunteers",centerAuth,VolunteersApproval);
router.put("/updateRequest/:requestId", centerAuth, updateRequestStatus);
router.put("/assignVolunteers/:requestId", centerAuth, assignVolunteers);
router.put("/updateCamp/:campId",centerAuth, updateCampStatus);
router.put("/verify-volunteer/:volunteerId", centerAuth, verifyVolunteer);
router.get("/disasters",centerAuth,getAllDisasters);
router.put("/updateDisasterStatus/:disasterId",centerAuth, updateDisasterStatus);
module.exports = router;
