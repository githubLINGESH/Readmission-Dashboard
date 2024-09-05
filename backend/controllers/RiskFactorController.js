const pool = require('../config/db');

exports.getRiskFactors = async (req, res) => {
  try {
    console.log("Fetching Analytical Data");

    const client = await pool.connect(); // Ensure connection to the pool
    const result = await client.query('SELECT * FROM risk_factors LIMIT 10'); // Query for risk factors
    client.release(); // Release the client

    console.log(result.rows);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Failed to fetch risk factors:', error);
    res.status(500).json({ error: 'Failed to fetch risk factors data.' });
  }
};
