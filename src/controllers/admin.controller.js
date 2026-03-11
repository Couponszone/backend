// src/controllers/admin.controller.js

const { supabase } = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../../utils/otp");
const sendOTP = require("../../utils/sendEmail");


// Allowed admin emails
const allowedAdmins = [
  "kritirai.hyd@gmail.com",
  "raipunit4@gmail.com"
];

// ================= ADMIN LOGIN (SEND OTP) =================
exports.loginAdminWithPassword = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email)
      return res.status(400).json({ error: "Email required" });

    email = email.trim().toLowerCase();

    // Check allowed admin
    if (!allowedAdmins.includes(email))
      return res.status(403).json({ error: "Access denied" });

    // Fetch admin from DB
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (adminError) return res.status(400).json({ error: adminError.message });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    // Password validation if provided
    if (password) {
      const valid = await bcrypt.compare(password, admin.password_hash);
      if (!valid) return res.status(401).json({ error: "Invalid password" });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Remove previous OTPs
    await supabase.from("admin_otp").delete().eq("email", email);

    // Insert new OTP
    const { error: insertError } = await supabase.from("admin_otp").insert([
      { email, otp, expires_at: expiresAt }
    ]);

    if (insertError) {
      console.error("OTP INSERT ERROR:", insertError);
      return res.status(500).json({ error: "Failed to create OTP" });
    }

    // Send OTP via ZeptoMail
    try {
      console.log(`Sending OTP ${otp} to ${email}`);
      await sendOTP(email, otp, admin.name);
    } catch (err) {
      console.error("SEND OTP ERROR:", err.response?.data || err);
      return res.status(500).json({
        error: "Failed to send OTP. Check ZeptoMail configuration."
      });
    }

    return res.json({
      message: "OTP sent to your email",
      expiresAt,
      expiresAtTimestamp: new Date(expiresAt).getTime()
    });

  } catch (err) {
    console.error("LOGIN ADMIN ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};


// ================= VERIFY OTP =================
exports.verifyAdminLoginOtp = async (req, res) => {

  try {

    let { email, otp } = req.body;

    if (!email || !otp)
      return res
        .status(400)
        .json({ error: "Email and OTP required" });

    email = email.trim().toLowerCase();
    otp = otp.toString().trim();

    // Fetch latest OTP
    const { data: otpRows, error } = await supabase
      .from("admin_otp")
      .select("*")
      .eq("email", email)
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      console.error("OTP FETCH ERROR:", error);
      return res.status(500).json({ error: "Failed to verify OTP" });
    }

    if (!otpRows || otpRows.length === 0)
      return res.status(400).json({
        error: "OTP not found"
      });

    const otpData = otpRows[0];

    // Check OTP match
    if (String(otpData.otp) !== otp)
      return res.status(400).json({
        error: "Invalid OTP"
      });

    // Check expiry
    const expiresAt = new Date(otpData.expires_at);

    if (expiresAt.getTime() < Date.now())
      return res.status(400).json({
        error: "OTP expired"
      });

    // Delete used OTP
    await supabase
      .from("admin_otp")
      .delete()
      .eq("id", otpData.id);

    // Fetch admin
    const { data: admin } = await supabase
      .from("admins")
      .select("id,name,email")
      .eq("email", email)
      .maybeSingle();

    if (!admin)
      return res.status(404).json({
        error: "Admin not found"
      });

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      message: "Login successful",
      token,
      admin
    });

  } catch (err) {

    console.error("VERIFY ADMIN LOGIN OTP ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
};



// ================= DASHBOARD =================
exports.getDashboard = async (req, res) => {

  res.json({
    admin: req.admin,
    message: `Welcome, ${req.admin.name}!`
  });

};



// ================= PENDING PUBLISHERS =================
exports.getPendingPublishers = async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("publishers")
      .select("id,name,email,mobile_number,status")
      .eq("status", "pending");

    if (error)
      return res.status(400).json({
        error: error.message
      });

    res.json({
      publishers: data
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};



// ================= APPROVE PUBLISHER =================
exports.approvePublisher = async (req, res) => {

  const { id } = req.params;

  try {

    const { data, error } = await supabase
      .from("publishers")
      .update({
        status: "approved"
      })
      .eq("id", id)
      .select()
      .single();

    if (error)
      return res.status(400).json({
        error: error.message
      });

    res.json({
      message: "Publisher approved",
      publisher: data
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};



// ================= PENDING COUPONS =================
exports.getPendingCoupons = async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("publisher_coupons")
      .select("*")
      .eq("status", "pending");

    if (error)
      return res.status(400).json({
        error: error.message
      });

    res.json({
      coupons: data
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};



// ================= APPROVE COUPON =================
exports.approveCoupon = async (req, res) => {

  const { id } = req.params;

  try {

    const { data, error } = await supabase
      .from("publisher_coupons")
      .update({
        status: "approved"
      })
      .eq("id", id)
      .select()
      .single();

    if (error)
      return res.status(400).json({
        error: error.message
      });

    res.json({
      message: "Coupon approved successfully",
      coupon: data
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};
