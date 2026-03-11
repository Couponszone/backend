require('dotenv').config();
console.log("SENDGRID_API_KEY loaded:", !!process.env.SENDGRID_API_KEY);

const app = require('./src/app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});