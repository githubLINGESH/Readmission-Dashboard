import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement } from 'chart.js';
import { Card, CardHeader, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
// import './PatientAnalysis.css';  // Include a custom CSS file for additional styling

ChartJS.register(ArcElement, Tooltip, Legend, BarElement);

const fetchAnalysis = async (subjectId, setAnalysis, setLoading, setError) => {
  try {
    setLoading(true);
    console.log("SubjectId", subjectId);
    const predictionResponse = await axios.post('http://127.0.0.1:8000/predict', { subject_id: subjectId });
    const llmResponse = await axios.post('http://127.0.0.1:8000/llm_analysis', { 
      subjectId,
      predictionData: predictionResponse.data 
    });
    setAnalysis({
      ...predictionResponse.data,
      llm_analysis: llmResponse.data
    });
    setLoading(false);
  } catch (err) {
    setError('Failed to fetch patient analysis');
    setLoading(false);
  }
};


const PatientAnalysis = () => {
  const [subjectId, setSubjectId] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (subjectId) {
      fetchAnalysis(subjectId, setAnalysis, setLoading, setError);
    }
  };

  useEffect(() => {
    // Initial data fetch can be optional based on your design
  }, []);

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;

  const { probability = 0, risk_level = 'Unknown', recommendation = 'No recommendation available' } = analysis || {};
  const { 
    summary = {},
    care_plan = {},
    additional_fields = {}
  } = (analysis && analysis.llm_analysis) || {};

  const riskScore = probability * 100;

  const riskChartData = {
    labels: ['Risk', 'Safe'],
    datasets: [{
      data: [riskScore, 100 - riskScore],
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB']
    }]
  };

  const keyFactorsData = analysis && analysis.top_features ? {
    labels: analysis.top_features.map(f => f.Feature),  // Feature names
    datasets: [{
      label: 'Key Factors',
      data: analysis.top_features.map(f => f.Importance),  // Feature importance values
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#4BC0C0', '#7D4CDB', '#D4E157']
    }]
  } : null;

  const renderSection = (title, data) => {
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) return null;

    return (
      <Card className="mb-6 shadow-md rounded-lg">
        <CardHeader className="bg-primary text-white p-4">
          <h2 className="text-2xl font-bold">{title}</h2>
        </CardHeader>
        <CardBody className="p-6">
          {typeof data === 'string' ? (
            <p className="text-gray-700 text-base leading-relaxed">{data}</p>
          ) : (
            Object.entries(data).map(([key, value], index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{key}</h3>
                {typeof value === 'object' ? (
                  <ul className="list-disc pl-5 text-gray-600">
                    {Object.entries(value).map(([subKey, subValue], subIndex) => (
                      <li key={subIndex}>{subKey}{subValue && `: ${subValue}`}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">{value}</p>
                )}
              </div>
            ))
          )}
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="content">
    <div className="content bg-light-gray py-10">
      <div className="container max-w-7xl mx-auto">
        {/* Form Section for Subject ID Input */}
        <Form onSubmit={handleFormSubmit} className="mb-8">
          <Row className="justify-content-center">
            <Col md="4">
              <FormGroup>
                <Label for="subjectId">Enter Subject ID</Label>
                <Input 
                  type="text" 
                  id="subjectId" 
                  value={subjectId} 
                  onChange={(e) => setSubjectId(e.target.value)} 
                  placeholder="e.g. 10004235"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="2" className="align-self-end">
              <Button color="primary" type="submit">Submit</Button>
            </Col>
          </Row>
        </Form>

        {/* Analysis Results */}
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">Patient Analysis</h1>
        
        {analysis && (
          <>
            <Row className="mb-12">
              <Col md="6">
                <Card className="shadow-md rounded-lg">
                  <CardHeader className="bg-secondary text-white p-4">
                    <h2 className="text-2xl font-semibold">Readmission Risk</h2>
                  </CardHeader>
                  <CardBody className="p-6">
                    <Doughnut data={riskChartData} />
                  </CardBody>
                </Card>
              </Col>

              <Col md="6">
                <Card className="shadow-md rounded-lg">
                  <CardHeader className="bg-secondary text-white p-4">
                    <h2 className="text-2xl font-semibold">Current Condition</h2>
                  </CardHeader>
                  <CardBody className="p-6">
                    <p className="text-gray-700"><strong>Probability:</strong> {probability.toFixed(2)}</p>
                    <p className="text-gray-700"><strong>Risk score:</strong> {riskScore.toFixed(2)}</p>
                    <p className="text-gray-700"><strong>Risk Level:</strong> {risk_level}</p>
                    <p className="text-gray-700"><strong>Recommendation:</strong> {recommendation}</p>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Key Factors Chart */}
            <Row className="mb-12">
              <Col md="12">
                <Card className="shadow-md rounded-lg">
                  <CardHeader className="bg-info text-white p-4">
                    <h2 className="text-2xl font-semibold">Key Factors</h2>
                  </CardHeader>
                  <CardBody className="p-6">
                    <Bar data={keyFactorsData} />
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <div className="space-y-8">
              {renderSection("Patient Summary", summary)}
              {renderSection("Care Plan", care_plan)}
              {renderSection("Additional Considerations", additional_fields)}
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default PatientAnalysis;
