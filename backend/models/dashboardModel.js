// models/index.js
const db = require("../config/db");
const { Sequelize, DataTypes } = require('sequelize');

// Update these with your actual database credentials
const sequelize = new Sequelize('postgres://postgres:Ling2522@localhost:5432/mimic_4', {
  dialect: 'postgres',
  logging: false, // set to console.log to see the raw SQL queries
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define models
db.ReadmissionStats = sequelize.define('ReadmissionStats', {
  readmission_rate: {
    type: DataTypes.FLOAT,
  },
}, { tableName: 'readmission_stats', timestamps: false });

db.HighRiskPatients = sequelize.define('HighRiskPatients', {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, { tableName: 'high_risk_patients', timestamps: false });

db.ProcessedAdmissions = sequelize.define('ProcessedAdmissions', {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  hadm_id: {
    type: DataTypes.INTEGER,
  },
  admittime: {
    type: DataTypes.DATE,
  },
  dischtime: {
    type: DataTypes.DATE,
  },
  is_readmission: {
    type: DataTypes.BOOLEAN,
  },
}, { tableName: 'processed_admissions', timestamps: false });

db.DemographicsSummary = sequelize.define('DemographicsSummary', {
  metric: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.FLOAT,
  },
}, { tableName: 'demographics_summary', timestamps: false });

db.AgeDistribution = sequelize.define('AgeDistribution', {
  age: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'age_distribution', timestamps: false });

db.GenderDistribution = sequelize.define('GenderDistribution', {
  gender: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'gender_distribution', timestamps: false });

db.ICUStatsSummary = sequelize.define('ICUStatsSummary', {
  metric: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.FLOAT,
  },
}, { tableName: 'icu_stats_summary', timestamps: false });

db.ICUTypeDistribution = sequelize.define('ICUTypeDistribution', {
  icu_type: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'icu_type_distribution', timestamps: false });

db.LengthOfStayDistribution = sequelize.define('LengthOfStayDistribution', {
  los_category: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'length_of_stay_distribution', timestamps: false });

db.LabResultsSummary = sequelize.define('LabResultsSummary', {
  metric: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.FLOAT,
  },
}, { tableName: 'lab_results_summary', timestamps: false });

db.CommonLabTests = sequelize.define('CommonLabTests', {
  itemid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'common_lab_tests', timestamps: false });

db.MedicationUsageSummary = sequelize.define('MedicationUsageSummary', {
  metric: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.FLOAT,
  },
}, { tableName: 'medication_usage_summary', timestamps: false });

db.CommonMedications = sequelize.define('CommonMedications', {
  drug: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'common_medications', timestamps: false });

db.PatientDetails = sequelize.define('PatientDetails', {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  // Add other fields as needed
}, { tableName: 'patient_details', timestamps: false });

db.RiskFactors = sequelize.define('RiskFactors', {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  risk_score: {
    type: DataTypes.FLOAT,
  },
  // Add other risk factor fields
}, { tableName: 'risk_factors', timestamps: false });

db.PatientVisits = sequelize.define('PatientVisits', {
  date: {
    type: DataTypes.DATE,
    primaryKey: true,
  },
  visit_count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'patient_visits', timestamps: false });

db.ReadmissionsOverTime = sequelize.define('ReadmissionsOverTime', {
  date: {
    type: DataTypes.DATE,
    primaryKey: true,
  },
  readmission_count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'readmissions_over_time', timestamps: false });

db.ProceduresSummary = sequelize.define('ProceduresSummary', {
  metric: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.FLOAT,
  },
}, { tableName: 'procedures_summary', timestamps: false });

db.CommonProcedures = sequelize.define('CommonProcedures', {
  procedure_code: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'common_procedures', timestamps: false });

db.ProceduresPerAdmissionStats = sequelize.define('ProceduresPerAdmissionStats', {
  metric: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.FLOAT,
  },
}, { tableName: 'procedures_per_admission_stats', timestamps: false });

db.MicrobiologySummary = sequelize.define('MicrobiologySummary', {
  metric: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.FLOAT,
  },
}, { tableName: 'microbiology_summary', timestamps: false });

db.CommonOrganisms = sequelize.define('CommonOrganisms', {
  organism: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'common_organisms', timestamps: false });

db.SpecimenTypes = sequelize.define('SpecimenTypes', {
  specimen_type: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
  },
}, { tableName: 'specimen_types', timestamps: false });

db.VitalSigns = sequelize.define('VitalSigns', {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  charttime: {
    type: DataTypes.DATE,
    primaryKey: true,
  },
  temperature: DataTypes.FLOAT,
  heartrate: DataTypes.FLOAT,
  resprate: DataTypes.FLOAT,
  o2sat: DataTypes.FLOAT,
  sbp: DataTypes.FLOAT,
  dbp: DataTypes.FLOAT,
}, { tableName: 'vital_signs', timestamps: false });

db.AverageVitalSigns = sequelize.define('AverageVitalSigns', {
  subject_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  avg_temperature: DataTypes.FLOAT,
  avg_heartrate: DataTypes.FLOAT,
  avg_resprate: DataTypes.FLOAT,
  avg_o2sat: DataTypes.FLOAT,
  avg_sbp: DataTypes.FLOAT,
  avg_dbp: DataTypes.FLOAT,
}, { tableName: 'average_vital_signs', timestamps: false });

module.exports = db;