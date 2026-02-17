const express = require("express");
const { addDistrict,getDistricts,updateDistrict,deleteDistrict, getCentersByDistrict, addType, addPlace, fetchPlaces, updatePlace, deletePlace, fetchItems, deleteItem, updateItem, addItem } = require("../controllers/admin.controller");

const router = express.Router();

router.post("/addDistrict", addDistrict);
router.get("/districts",getDistricts);
router.put("/district/:id",updateDistrict);
router.delete("/district/:id",deleteDistrict);
router.get("/centers/:districtId",getCentersByDistrict);
router.post("/item",addItem);
router.get("/items",fetchItems);
router.put("/item/:id",updateItem);
router.delete("/item/:id",deleteItem);
router.post("/place/:id",addPlace);
router.get("/places/:districtId", fetchPlaces);
router.put("/place/:id", updatePlace);
router.delete("/place/:districtId",deletePlace)
module.exports = router;
