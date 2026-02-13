const express = require("express");
const router = express.Router();
const { campRegister, getCentersByDistrict,home, getRequestitems, getPlaces, newdisaster, newRequest, getRequest, getRequests, getCampProfile, updateOccupancy, updateProfile, CampProof} = require("../controllers/camp.controller");
const { campAuth } = require("../middlewares/campAuth");
const upload = require("../middlewares/disasterProofUpload");
const uploadCampProof = require("../middlewares/uploadCampProof");
// const CampProof = require("../middlewares/uploadCampProof");

router.post("/register", campRegister);
router.get("/places",campAuth, getPlaces);
router.get("/centers/:districtId",getCentersByDistrict)
router.get("/home", campAuth, home)
router.get("/request-items", campAuth, getRequestitems);
router.post("/new-request", campAuth, newRequest);
router.get("/request/:requestId", campAuth, getRequest);
router.post(
  "/disaster",
  campAuth,
  upload.single("photo"), // field name MUST match frontend
  newdisaster
);
router.get("/requests", campAuth, getRequests);
router.get("/profile", campAuth, getCampProfile);
router.patch("/update-occupancy", campAuth, updateOccupancy);
router.patch("/update-profile", campAuth, updateProfile);
router.post(
  "/upload-proof",
  campAuth,
  uploadCampProof.single("camp_proof"),
  CampProof
);
module.exports = router;
