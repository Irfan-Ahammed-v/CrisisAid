const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/authMiddleware");
const { me } = require("../controllers/auth.controller");

router.get("/me", verifyToken, me);
router.post("/login", login);
router.post("/logout", verifyToken, logout);

module.exports = router;



