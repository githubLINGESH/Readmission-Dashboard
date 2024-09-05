// models/ReadmissionModel.js
const pool = require('../config/db');

const ReadmissionModel = {
  // Calculate and fetch all readmission risk data
  getAllReadmissionRisk: async () => {
    const query = `
      SELECT 
        p.subject_id, 
        p.anchor_age,
        MAX(a.admittime) as last_admission_date,
        MAX(a.dischtime + INTERVAL '30 days') as follow_up_date,
        CASE 
          -- Age over 65 or multiple admissions as high risk
          WHEN p.anchor_age > 65 OR COUNT(a.subject_id) > 2 THEN 'High'
          -- ICU stay or complex procedure as moderate risk
          WHEN EXISTS (
            SELECT 1 FROM mimiciv_icu.icustays icu WHERE icu.subject_id = p.subject_id
          ) OR EXISTS (
            SELECT 1 FROM mimiciv_hosp.procedures_icd proc WHERE proc.subject_id = p.subject_id
          ) THEN 'Moderate'
          -- Otherwise, low risk
          ELSE 'Low'
        END AS readmission_risk
      FROM mimiciv_hosp.patients p
      LEFT JOIN mimiciv_hosp.admissions a ON p.subject_id = a.subject_id
      LEFT JOIN vital_signs vs ON p.subject_id = vs.subject_id
      LEFT JOIN mimiciv_hosp.prescriptions pres ON p.subject_id = pres.subject_id
      GROUP BY p.subject_id, p.anchor_age LIMIT 1;
    `;
    const result = await pool.query(query);

    // console.log(result);
    return result.rows;
  },

  // Fetch summary analytics data (e.g., average readmission risk)
  getSummaryStats: async () => {
    const query = `
      SELECT 
        AVG(CASE 
          WHEN p.anchor_age > 65 OR COUNT(a.subject_id) > 2 THEN 3
          WHEN EXISTS (SELECT 1 FROM mimiciv_icu.icustays icu WHERE icu.subject_id = p.subject_id) OR EXISTS (SELECT 1 FROM mimiciv_hosp.procedures_icd proc WHERE proc.subject_id = p.subject_id) THEN 2
          ELSE 1
        END) AS avg_readmission_risk
      FROM mimiciv_hosp.patients p
      LEFT JOIN mimiciv_hosp.admissions a ON p.subject_id = a.subject_id
      GROUP BY p.subject_id;
    `;
    const result = await pool.query(query);
    return result.rows[0];
  },
};

module.exports = ReadmissionModel;
