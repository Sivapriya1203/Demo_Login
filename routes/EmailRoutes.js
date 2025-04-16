const express = require("express");
const { sendOtp,verifyOtp, changePassword } = require("../Controllers/emailController");

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp',verifyOtp)
router.post("/change-password", changePassword);


module.exports = router;