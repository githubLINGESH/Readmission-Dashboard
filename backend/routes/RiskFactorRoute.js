const express = require('express');
const router = express.Router();
const RiskFactorController = require('../controllers/RiskFactorController');

router.get('/get-data', RiskFactorController.getRiskFactors);
// router.get('/risk-factors/:id', RiskFactorController.getRiskFactorById);

module.exports = router;
