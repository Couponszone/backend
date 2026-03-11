const express = require('express');
const cors = require('cors');
require('dotenv').config();

const couponRoutes = require('./routes/coupon.routes');
const companyRoutes = require('./routes/company.routes');
const categoryRoutes = require('./routes/category.routes');
const adminRoutes = require('./routes/admin.routes');




const app = express();

app.use(cors());
app.use(express.json());







app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/categories', categoryRoutes);

module.exports = app;