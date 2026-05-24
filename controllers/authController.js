const bcrypt = require("bcryptjs");

const otpGenerator = require("otp-generator");

const AuthUser = require("../models/AuthUser");

const {
  generateToken,
} = require("../utils/generateToken");

const {
  sendOTP,
} = require("../services/emailService");


// =========================
// SIGNUP
// =========================

exports.signup = async (req, res) => {

  try {

    const {
      username,
      email,
      password,
    } = req.body;

    // VALIDATION
    if (
      !username ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // CHECK EXISTING USER
    const userExists =
      await AuthUser.findOne({
        email,
      });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // GENERATE OTP
    const otp =
      otpGenerator.generate(6, {

        upperCaseAlphabets: false,

        lowerCaseAlphabets: false,

        specialChars: false,
      });

    // CREATE USER
    await AuthUser.create({

      username,

      email,

      password: hashedPassword,

      otp,

      otpExpiry:
        Date.now() +
        5 * 60 * 1000,

      isVerified: false,
    });

    // 🚀 SEND EMAIL IN BACKGROUND
    sendOTP(email, otp);

    // 🚀 FAST RESPONSE
    return res.status(201).json({

      success: true,

      message:
        "OTP sent successfully",
    });

  } catch (err) {

    console.log(
      "Signup Error:",
      err
    );

    return res.status(500).json({

      success: false,

      message:
        "Signup failed",
    });
  }
};


// =========================
// VERIFY EMAIL
// =========================

exports.verifyEmail = async (
  req,
  res
) => {

  try {

    const {
      email,
      otp,
    } = req.body;

    const user =
      await AuthUser.findOne({
        email,
      });

    // CHECK USER
    if (!user) {

      return res.status(400).json({

        message:
          "User not found",
      });
    }

    // CHECK OTP
    if (
      user.otp !== otp ||
      user.otpExpiry <
        Date.now()
    ) {

      return res.status(400).json({

        message:
          "Invalid or expired OTP",
      });
    }

    // VERIFY USER
    user.isVerified = true;

    user.otp = null;

    user.otpExpiry = null;

    await user.save();

    return res.json({

      success: true,

      message:
        "Email verified successfully",
    });

  } catch (err) {

    console.log(
      "Verify Error:",
      err
    );

    return res.status(500).json({

      success: false,

      message:
        "Verification failed",
    });
  }
};


// =========================
// LOGIN
// =========================

exports.login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // CHECK USER
    const user =
      await AuthUser.findOne({
        email,
      });

    if (!user) {

      return res.status(400).json({

        message:
          "User not found",
      });
    }

    // CHECK VERIFIED
    if (!user.isVerified) {

      return res.status(400).json({

        message:
          "Email not verified",
      });
    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({

        message:
          "Invalid credentials",
      });
    }

    // GENERATE TOKEN
    const token =
      generateToken(user._id);

    return res.json({

      success: true,

      token,

      user: {

        id: user._id,

        username:
          user.username,

        email:
          user.email,
      },
    });

  } catch (err) {

    console.log(
      "Login Error:",
      err
    );

    return res.status(500).json({

      success: false,

      message:
        "Login failed",
    });
  }
};