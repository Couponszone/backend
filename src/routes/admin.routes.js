// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middlewares/adminAuth.middleware');

// Admin login → send OTP
router.post('/login', adminController.loginAdminWithPassword);

// Verify OTP
router.post('/login/verify-otp', adminController.verifyAdminLoginOtp);

// Dashboard (protected)
router.get('/dashboard', auth.verifyAdmin, adminController.getDashboard);

// Pending publishers
router.get('/publishers/pending', auth.verifyAdmin, adminController.getPendingPublishers);

// Approve publisher
router.put('/publishers/:id/approve', auth.verifyAdmin, adminController.approvePublisher);

// Pending coupons
router.get('/coupons/pending', auth.verifyAdmin, adminController.getPendingCoupons);

// Approve coupon
router.put('/coupons/:id/approve', auth.verifyAdmin, adminController.approveCoupon);

module.exports = router;