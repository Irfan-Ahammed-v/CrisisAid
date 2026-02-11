const express = require("express");
const {
  centerReg,
  completeCenterProfile,
  centerLogout,
  home
} = require("../controllers/centers.controller");

const { centerAuth } = require("../middlewares/centerAuth");
const { profileCompletedCheck } = require("../middlewares/profileCompleted");

const router = express.Router();

/* ---------- PUBLIC ROUTES ---------- */
router.post("/register", centerReg);

/* ---------- PROTECTED ROUTES ---------- */
router.put("/complete-profile", centerAuth, completeCenterProfile);
 
router.get("/home", centerAuth,home);


router.post("/logout", centerLogout);


module.exports = router;

