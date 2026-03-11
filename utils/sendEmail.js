// utils/sendEmail.js
require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.ZEPTOMAIL_SMTP_HOST, // smtp.zeptomail.in
  port: process.env.ZEPTOMAIL_SMTP_PORT, // 465 for SSL
  secure: true, 
  auth: {
    user: process.env.ZEPTOMAIL_SMTP_USER, 
    pass: process.env.ZEPTOMAIL_SMTP_PASS, 
  },
});

async function sendOTP(email, otp, name = "Admin", product_name = "Coupons Zone Website") {
  try {
    const textTemplate = `
Hi <b>${name}</b>,

Verify your email address. Below is your <b>One Time Password</b>:

${otp}

If you didn't request this OTP, ignore the email.

If you'd like to know more about <b>${product_name}</b> or want to get in touch with us, contact our customer support team.

Thank you,
The Coupons Zone Support Team
`;

    const htmlTemplate = `
<p>Hi ${name},</p>
<p>Verify your email address. Below is your One Time Password:</p>
<h2>${otp}</h2>
<p>If you didn't request this OTP, ignore the email.</p>
<p>If you'd like to know more about ${product_name} or want to get in touch with us, contact our customer support team.</p>
<p>Thank you,</p>
<p>The Coupons Zone Support Team</p>
`;

    const info = await transporter.sendMail({
      from: `"CouponsZone" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Your OTP for ${product_name}`,
      text: textTemplate,
      html: htmlTemplate,
    });

    console.log("SMTP email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = sendOTP;