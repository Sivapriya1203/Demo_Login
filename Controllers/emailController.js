// const nodemailer = require("nodemailer");
// const crypto = require("crypto");
// const bcrypt = require("bcrypt");
// const db = require("../config/db"); // MySQL database connection


// let otpStore = {};

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// const sendOtp = (req, res) => {
//   const { email } = req.body;

//   const otp = crypto.randomInt(100000, 999999).toString();

//   otpStore[email] = {
//     otp,
//     expiry: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
//   };

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is: ${otp}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).json({ msg: "Failed to send OTP", error });
//     }
//     res.status(200).json({ msg: "OTP sent successfully!" });
//   });
// };

// const verifyOtp = (req, res) => {
//   const { email, otp } = req.body;

//   if (otpStore[email]) {
//     const storedOtp = otpStore[email].otp;
//     const expiryTime = otpStore[email].expiry;

//     if (Date.now() > expiryTime) {
//       delete otpStore[email];
//       return res.status(400).json({ msg: "OTP expired, please request a new one." });
//     }

//     if (otp === storedOtp) {
//       delete otpStore[email];
//       return res.status(200).json({ msg: "OTP verified successfully!" });
//     } else {
//       return res.status(400).json({ msg: "Invalid OTP. Please try again." });
//     }
//   } else {
//     return res.status(400).json({ msg: "OTP not found. Please request a new one." });
//   }
// };

// const changePassword = async (req, res) => {
//   const { email, newPassword } = req.body;

//   if (!email || !newPassword) {
//     return res.status(400).json({ msg: "Email and newPassword are required", success: false });
//   }

//   try {
//     // Query to find user by email
//     db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
//       if (err) {
//         return res.status(500).json({ msg: "Server error while retrieving user", success: false });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ msg: "User not found", success: false });
//       }

//       const user = results[0]; // The first matching user

//       // Hash the new password
//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       // Update the user's password
//       db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err, updateResults) => {
//         if (err) {
//           return res.status(500).json({ msg: "Server error while updating password", success: false });
//         }

//         res.status(200).json({ msg: "Password changed successfully!", success: true });
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: "Server error while changing password", success: false });
//   }
// };

// module.exports = {
//   sendOtp,
//   verifyOtp,
//   changePassword,
// };












const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // MongoDB User model

let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send OTP to user email
const sendOtp = (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();

  otpStore[email] = {
    otp,
    expiry: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ msg: "Failed to send OTP", error });
    }
    res.status(200).json({ msg: "OTP sent successfully!" });
  });
};

// Verify OTP
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email]) {
    const storedOtp = otpStore[email].otp;
    const expiryTime = otpStore[email].expiry;

    if (Date.now() > expiryTime) {
      delete otpStore[email];
      return res.status(400).json({ msg: "OTP expired, please request a new one." });
    }

    if (otp === storedOtp) {
      delete otpStore[email];
      return res.status(200).json({ msg: "OTP verified successfully!" });
    } else {
      return res.status(400).json({ msg: "Invalid OTP. Please try again." });
    }
  } else {
    return res.status(400).json({ msg: "OTP not found. Please request a new one." });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ msg: "Email and newPassword are required", success: false });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ msg: "Password changed successfully!", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while changing password", success: false });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  changePassword,
};
