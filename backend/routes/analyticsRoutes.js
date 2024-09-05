// routes/AnalyticsRoutes.js
const express = require('express');
const { getAnalyticsData } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/analysis-data', getAnalyticsData);

module.exports = router;
