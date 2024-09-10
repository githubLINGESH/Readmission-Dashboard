// controllers/dashboardController.js
const pool = require("../config/db");

exports.getDashboardData = async (req, res) => {
  try {
    console.log("Fetching dashboard data");
    const client = await pool.connect();

    const safeQuery = async (query, defaultValue = []) => {
      try {
        const result = await client.query(query);
        return result.rows;
      } catch (error) {
        console.error(`Error executing query: ${query}`, error);
        return defaultValue;
      }
    };

    const readmissionTrends = await safeQuery(`
      SELECT DATE_TRUNC('month', admittime) AS month, COUNT(*) AS readmissions
      FROM processed_admissions
      WHERE is_readmission = TRUE
      GROUP BY DATE_TRUNC('month', admittime)
      ORDER BY month LIMIt 10
    `);

    const riskDistribution = await safeQuery(`
      SELECT
        risk_level,
        COUNT(*) AS patient_count
      FROM (
        SELECT
          CASE
            WHEN (age_risk + diabetes_risk + heart_disease_risk + bmi_risk) / 4 < 30 THEN 'Low'
            WHEN (age_risk + diabetes_risk + heart_disease_risk + bmi_risk) / 4 < 70 THEN 'Medium'
            ELSE 'High'
          END AS risk_level
        FROM risk_factors
      ) AS risk_levels
      GROUP BY risk_level
      ORDER BY 
        CASE 
          WHEN risk_level = 'Low' THEN 1
          WHEN risk_level = 'Medium' THEN 2
          WHEN risk_level = 'High' THEN 3
        END
    `);

    const monthlyAdmissions = await safeQuery(`
      SELECT
        DATE_TRUNC('month', admittime) AS month,
        COUNT(*) AS total_admissions,
        SUM(CASE WHEN is_readmission THEN 1 ELSE 0 END) AS readmissions
      FROM processed_admissions
      GROUP BY DATE_TRUNC('month', admittime)
      ORDER BY month LIMIT 7
    `);

    const readmissionRate = await safeQuery(`
      SELECT ROUND(AVG(CASE WHEN is_readmission THEN 1 ELSE 0 END) * 100, 2) AS rate
      FROM processed_admissions
    `);

    const highRiskCount = await safeQuery(`
      SELECT COUNT(DISTINCT subject_id) AS count
      FROM patient_analysis.risk_prediction
      WHERE risk_level = 'High'
    `);    



    const totalAdmissions = await safeQuery(`
      SELECT COUNT(*) AS count
      FROM processed_admissions
    `);

    const demographics = await safeQuery('SELECT * FROM gender_distribution');
    const medicationUsage = await safeQuery('SELECT * FROM common_medications');
    const lengthOfStay = await safeQuery('SELECT * FROM length_of_stay_distribution');
    const vitalSigns = (await safeQuery('SELECT * FROM average_vital_signs'))[0] || {};

    // Placeholder for patient satisfaction (you might need to implement this)
    const patientSatisfaction = { rate: 95 }; // Example: 95% satisfaction rate

    client.release();

    const responseData = {
      readmissionTrends,
      readmissionRate: readmissionRate[0].rate,
      highRiskCount: parseInt(highRiskCount[0].count),
      totalAdmissions: parseInt(totalAdmissions[0].count),
      riskDistribution,
      monthlyAdmissions,
      demographics,
      medicationUsage,
      lengthOfStay,
      vitalSigns,
      patientSatisfaction: patientSatisfaction.rate
    };

    console.log("Sending response data:", responseData);
    res.json(responseData);
  } catch (err) {
    console.error('Error in getDashboardData:', err);
    res.status(500).json({ error: 'An error occurred while fetching dashboard data' });
  }
};


