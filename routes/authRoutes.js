const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verifyEmail,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/verify", verifyEmail);
router.post("/login", login);

module.exports = router;