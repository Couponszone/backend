const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');

// CRUD
router.post('/', couponController.createCoupon);
router.get('/', couponController.getCoupons);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);

// Click tracking
router.post("/click", couponController.clickCoupon);
router.get("/total", couponController.getTotalClicks);
router.get("/user/:userId", couponController.getUserClicks);

module.exports = router;