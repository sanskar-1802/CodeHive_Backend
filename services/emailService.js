const nodemailer = require("nodemailer");

exports.sendOTP = async (email, otp) => {

  try {

    const transporter = nodemailer.createTransport({

      host: "smtp.gmail.com",

      port: 587,

      secure: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: "CodeHive OTP Verification",

      html: `
        <div style="
          font-family: Arial;
          padding: 20px;
        ">
          <h2>CodeHive Verification</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>
            OTP expires in 5 minutes.
          </p>
        </div>
      `,
    });

    console.log(
      "✅ Email sent:",
      info.response
    );

  } catch (error) {

    console.log(
      "❌ Email error:",
      error
    );
  }
};