// Import the `pg` library
const { Pool } = require('pg');

// Create a new pool instance with your database credentials
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mimic_4',
  password: 'Ling2522',
  port: 5432,
});

// Function to connect to the database and log success or failure
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

// Export the pool to use in other parts of your application
module.exports = pool;
