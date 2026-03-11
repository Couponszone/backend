require("dotenv").config(); // Load .env
const nodemailer = require("nodemailer");

// Configure SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.ZEPTOMAIL_SMTP_HOST,
  port: process.env.ZEPTOMAIL_SMTP_PORT,
  secure: process.env.ZEPTOMAIL_SMTP_PORT == 465, // SSL for 465, false for 587
  auth: {
    user: process.env.ZEPTOMAIL_SMTP_USER,
    pass: process.env.ZEPTOMAIL_SMTP_PASS,
  },
});

async function sendOTP(email, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"CouponsZone" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "CouponsZone Admin OTP",
      text: `Your OTP is ${otp}`,
      html: `
        <h2>CouponsZone Admin Login</h2>
        <p>Your OTP:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    console.log("OTP sent successfully:", info.messageId);
  } catch (err) {
    console.error("Error sending OTP:", err);
    throw new Error("Failed to send OTP");
  }
}

module.exports = sendOTP;