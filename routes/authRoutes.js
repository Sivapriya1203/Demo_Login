const express = require("express");
const { register, login, getUserEmail } = require("../Controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getemail", getUserEmail);

module.exports = router;
