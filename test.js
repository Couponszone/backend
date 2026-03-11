require('dotenv').config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testEmail() {
  try {
    await sgMail.send({
      to: "kritirai.hyd@gmail.com",
      from: process.env.EMAIL_FROM,
      subject: "Test Email from CouponsZone",
      text: "Hello! This is a test email.",
    });
    console.log("Test email sent successfully!");
  } catch (err) {
    console.error("Test email error:", err.response?.body || err);
  }
}

testEmail();