// routes/ReadmissionRoutes.js
const express = require('express');
const router = express.Router();
const ReadmissionController = require('../controllers/readmissionController');

// Route to fetch all readmission risk data
router.get('/get-notified', ReadmissionController.getAllRiskFactors);

// Route to fetch summary statistics (e.g., average readmission risk)
router.get('/risk-factor/summary', ReadmissionController.getSummary);

module.exports = router;
