// controllers/analyticsController.js
const pool = require("../config/db");

const getAnalyticsData = async (req, res) => {
  try {
    console.log("Fetching Analytics");
    const patientVisitsResult = await pool.query('SELECT * FROM patient_visits LIMIT 10');
    const readmissionsResult = await pool.query('SELECT * FROM readmissions_over_time LIMIT 10');

    console.log(patientVisitsResult);
    console.log(readmissionsResult);

    res.json({
      patient_visits: patientVisitsResult.rows,
      readmissions_over_time: readmissionsResult.rows,
    });
  } catch (err) {
    console.error('Error fetching analytics data', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAnalyticsData,
};
