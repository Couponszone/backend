const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware'); // multer memory storage
const companyController = require('../controllers/company.controller');

// Create company
router.post('/', upload.single('logo'), companyController.createCompany);

// Get all companies
router.get('/', companyController.getCompanies);

// Update company (PUT or PATCH works)
router.put('/:id', upload.single('logo'), companyController.updateCompany);

// Delete company
router.delete('/:id', companyController.deleteCompany);

module.exports = router;