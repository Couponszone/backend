const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOTP(email, otp) {
  try {
    await sgMail.send({
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "CouponsZone Admin OTP",
      text: `Your OTP is ${otp}`,
      html: `
      <h2>CouponsZone Admin Login</h2>
      <p>Your OTP:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 5 minutes.</p>
      `
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error.response?.body || error);
    throw new Error("Failed to send OTP");
  }
}

module.exports = sendOTP;