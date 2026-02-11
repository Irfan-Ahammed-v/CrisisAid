const express = require("express");
const { addDistrict,getDistricts,updateDistrict,deleteDistrict, getCentersByDistrict, addType, fetchTypes, updateType, deleteType, addPlace, fetchPlaces, updatePlace, deletePlace } = require("../controllers/admin.controller");

const router = express.Router();

router.post("/addDistrict", addDistrict);
router.get("/districts",getDistricts);
router.put("/district/:id",updateDistrict);
router.delete("/district/:id",deleteDistrict);
router.get("/centers/:districtId",getCentersByDistrict);
router.post("/type",addType);
router.get("/fetchtypes",fetchTypes);
router.put("/type/:id",updateType);
router.delete("/type/:id",deleteType);
router.post("/place/:id",addPlace);
router.get("/places/:districtId", fetchPlaces);
router.put("/place/:id", updatePlace);
router.delete("/place/:districtId",deletePlace)
module.exports = router;
