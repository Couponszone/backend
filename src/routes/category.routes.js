const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware'); // multer setup
const categoryController = require('../controllers/category.controller');

// Create category
router.post('/', upload.single('image'), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getCategories);

// Update category
router.put('/:id', upload.single('image'), categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;