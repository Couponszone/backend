// netlify/functions/api.js
const serverless = require("serverless-http");
const app = require("../../../backend/src/app"); // path to your existing Express app

module.exports.handler = serverless(app);