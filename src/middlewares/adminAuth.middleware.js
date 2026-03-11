// src/middlewares/adminAuth.middleware.js
const jwt = require("jsonwebtoken");
const { supabase } = require("../../config/db");

exports.verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch admin info for req.admin
    const { data: admin } = await supabase
      .from("admins")
      .select("id, name, email")
      .eq("id", decoded.id)
      .maybeSingle();

    if (!admin) return res.status(401).json({ error: "Admin not found" });

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token expired or invalid" });
  }
};