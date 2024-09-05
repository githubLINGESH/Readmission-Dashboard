// server.js (or app.js)
const express = require('express');
const bodyParser = require('body-parser');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const RiskRoutes = require('./routes/RiskFactorRoute');
const ReadmissionRoutes = require('./routes/ReadmissionRoutes');
const cors = require('cors');

// Initialize an Express app
const app = express();

// Use middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Basic route to test server is running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Use the dashboard routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/risk-factor', RiskRoutes,ReadmissionRoutes);

// Start the server on a specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
