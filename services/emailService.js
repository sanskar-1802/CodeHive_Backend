const nodemailer = require("nodemailer");

exports.sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account",
      text: `Your OTP is ${otp}`,
    });

    console.log("Email sent:", info.response); // ✅ ADD THIS
  } catch (error) {
    console.error("Email error:", error); // ❌ IMPORTANT
  }
};