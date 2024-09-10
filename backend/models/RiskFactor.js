const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../config/db'); // Assuming you have a database config file

const sequelize = new Sequelize('postgres://postgres:Ling2522@localhost:5432/mimic_4', {
    dialect: 'postgres',
    logging: false, // set to console.log to see the raw SQL queries
  });

const RiskFactors = sequelize.define('RiskFactors', {
    subject_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    anchor_age: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    age_risk: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    diabetes_risk: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    heart_disease_risk: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bmi_risk: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'risk_factors', // Make sure this matches your PostgreSQL table name
    timestamps: false
});

module.exports = RiskFactors;
