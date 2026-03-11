// src/middlewares/upload.middleware.js
const multer = require('multer');

// store uploaded file in memory (buffer) before uploading to cloud
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;