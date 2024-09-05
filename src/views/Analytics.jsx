// Updated Analytics.js
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Button } from "reactstrap";
import { Line } from "react-chartjs-2";
import axios from 'axios';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    patient_visits: [],
    readmissions_over_time: []
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/analytics/analysis-data')
      .then(response => setAnalyticsData(response.data))
      .catch(error => console.error('Error fetching analytics data:', error));
  }, []);

  const data = {
    labels: analyticsData.patient_visits.map(item => item.admittime),
    datasets: [
      {
        label: "Patient Visits",
        fill: true,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        data: analyticsData.patient_visits.map(item => item.hadm_id),
      },
      {
        label: "Readmissions",
        fill: true,
        backgroundColor: "rgba(255,99,132,0.4)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 2,
        data: analyticsData.readmissions_over_time.map(item => item.hadm_id),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Analytics Overview</CardTitle>
              <p className="card-category">
                Insights on patient visits and readmissions.
              </p>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="12">
                  <div style={{ height: "400px" }}>
                    <Line data={data} options={options} />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Analytics;
