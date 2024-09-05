// controllers/ReadmissionController.js
const ReadmissionModel = require('../models/readmissionModel');

const ReadmissionController = {
  // Controller to fetch all readmission risk data
  getAllRiskFactors: async (req, res) => {
    try {
      console.log("Api Requested");
      const data = await ReadmissionModel.getAllReadmissionRisk();
      res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching readmission risk data:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Controller to fetch summary analytics
  getSummary: async (req, res) => {
    try {
      const summary = await ReadmissionModel.getSummaryStats();
      res.status(200).json(summary);
    } catch (err) {
      console.error('Error fetching summary:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },
};

module.exports = ReadmissionController;
