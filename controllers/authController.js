const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const AuthUser = require("../models/AuthUser");
const { generateToken } = require("../utils/generateToken");
const { sendOTP } = require("../services/emailService");

// SIGNUP
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await AuthUser.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const user = await AuthUser.create({
    username,
    email,
    password: hashedPassword,
    otp,
    otpExpiry: Date.now() + 5 * 60 * 1000, // 5 min
  });

  await sendOTP(email, otp);

  res.json({ message: "OTP sent to email" });
};

// VERIFY OTP
exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  const user = await AuthUser.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  res.json({ message: "Email verified successfully" });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await AuthUser.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  if (!user.isVerified) {
    return res.status(400).json({ message: "Email not verified" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};