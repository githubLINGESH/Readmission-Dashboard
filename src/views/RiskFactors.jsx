import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Row, Col, Table } from "reactstrap";
import { Bar } from "react-chartjs-2";
import axios from 'axios';

const RiskFactors = () => {
  const [riskFactors, setRiskFactors] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);  // Add loading state
  const [error, setError] = useState(null);      // Add error state

  useEffect(() => {
    // Fetch risk factors from the backend
    axios.get('http://localhost:5000/api/risk-factor/get-data') 
      .then(response => {
        setRiskFactors(response.data);
        generateChartData(response.data);
        setLoading(false);   // Turn off loading once data is fetched
      })
      .catch(error => {
        console.error("Error fetching risk factors:", error);
        setError(error);
        setLoading(false);   // Turn off loading even if there's an error
      });
  }, []);

  // Generate chart data from the fetched risk factors
  const generateChartData = (data) => {
    const labels = data.map(factor => `Patient ${factor.subject_id}`);
    const ageRisk = data.map(factor => factor.age_risk);
    const diabetesRisk = data.map(factor => factor.diabetes_risk);
    const heartDiseaseRisk = data.map(factor => factor.heart_disease_risk);
    const bmiRisk = data.map(factor => factor.bmi_risk);

    setChartData({
      labels,
      datasets: [
        {
          label: "Age Risk",
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          data: ageRisk,
        },
        {
          label: "Diabetes Risk",
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          data: diabetesRisk,
        },
        {
          label: "Heart Disease Risk",
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          data: heartDiseaseRisk,
        },
        {
          label: "BMI Risk",
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
          data: bmiRisk,
        },
      ],
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <h5>Patient Risk Factors</h5>
                <p className="card-category">
                  Overview of key risk factors affecting patient health.
                </p>
              </CardHeader>
              <CardBody>
                <div style={{ height: "400px", marginBottom: "30px" }}>
                  <Bar 
                    data={chartData} 
                    options={{
                      responsive: true, // Make it responsive
                      maintainAspectRatio: false, // Allow better resizing
                    }}
                  />
                </div>
                <h5 className="mt-4">Detailed Risk Factors</h5>
                <div style={{ overflowX: "auto" }}>
                  <Table responsive striped bordered hover>
                    <thead>
                      <tr>
                        <th>Subject ID</th>
                        <th>Age Risk</th>
                        <th>Diabetes Risk</th>
                        <th>Heart Disease Risk</th>
                        <th>BMI Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskFactors.map((factor) => (
                        <tr key={factor.subject_id}>
                          <td>{factor.subject_id}</td>
                          <td>{factor.age_risk}</td>
                          <td>{factor.diabetes_risk}</td>
                          <td>{factor.heart_disease_risk}</td>
                          <td>{factor.bmi_risk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RiskFactors;
