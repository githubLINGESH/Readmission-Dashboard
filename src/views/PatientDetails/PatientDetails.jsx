import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, CardTitle, Row, Col, Input, Button, Table } from 'reactstrap';
import { Doughnut, Bar } from 'react-chartjs-2'; // Ensure react-chartjs-2 is installed
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PatientDetails() {
  const [subjectId, setSubjectId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [riskPredictions, setRiskPredictions] = useState([]);
  const [llmAnalyses, setLlmAnalyses] = useState([]);
  const [selectedTimestamp, setSelectedTimestamp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [riskChartData, setRiskChartData] = useState(null);
  const [probability, setProbability] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [summary, setSummary] = useState('');
  const [carePlan, setCarePlan] = useState('');
  const [additionalFields, setAdditionalFields] = useState('');

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `http://localhost:5000/api/patient/details/${subjectId}?timestamp=${selectedTimestamp}`;
      const response = await axios.get(apiUrl);
      const {
        riskPrediction,
        llmAnalysis,
        visualizationData,
        riskChartData,
        probability,
        riskScore,
        risk_level,
        recommendation,
        summary,
        care_plan,
        additional_fields,
        riskPredictions,
        llmAnalyses,
      } = response.data;

      setPatientData(visualizationData);
      setRiskPredictions(Array.isArray(riskPredictions) ? riskPredictions : []);
      setLlmAnalyses(Array.isArray(llmAnalyses) ? llmAnalyses : []);
      setRiskChartData(riskChartData);
      setProbability(probability);
      setRiskScore(riskScore);
      setRiskLevel(risk_level);
      setRecommendation(recommendation);
      setSummary(summary);
      setCarePlan(care_plan);
      setAdditionalFields(additional_fields);
    } catch (error) {
      setError('Error fetching patient data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectId) {
      fetchPatientData();
    }
  }, [subjectId, selectedTimestamp]);

  const renderSection = (title, data) => {
    if (!data) return null;

    return (
      <Card className="mb-6 shadow-md rounded-lg">
        <CardHeader className="bg-primary text-white p-4">
          <h2 className="text-2xl font-bold">{title}</h2>
        </CardHeader>
        <CardBody className="p-6">
          {typeof data === 'string' ? (
            <p className="text-gray-700">{data}</p>
          ) : (
            Object.entries(data).map(([key, value], index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-800">{key}</h3>
                {typeof value === 'object' ? (
                  <ul>
                    {Object.entries(value).map(([subKey, subValue], subIndex) => (
                      <li key={subIndex}>{subKey}: {subValue}</li>
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

  const renderTimestampDropdown = () => (
    <Input
      type="select"
      value={selectedTimestamp}
      onChange={(e) => setSelectedTimestamp(e.target.value)}
    >
      <option value="">Latest</option>
      {riskPredictions.map((prediction) => (
        <option key={prediction.timestamp} value={new Date(prediction.timestamp).toISOString()}>
          {new Date(prediction.timestamp).toLocaleString()}
        </option>
      ))}
    </Input>
  );

  const renderAdmissionStatsChart = () => {
    if (!patientData || !patientData.admissionStats) return null;

    const admissionData = [
      { name: 'Total Admissions', value: patientData.admissionStats.totalAdmissions },
      { name: 'Total ICU Stays', value: patientData.admissionStats.totalICUStays },
      { name: 'Emergency Admissions', value: patientData.admissionStats.emergencyAdmissions },
      { name: 'Elective Admissions', value: patientData.admissionStats.electiveAdmissions }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={admissionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderVitalSignsChart = () => {
    if (!patientData || !patientData.vitalSigns) return null;

    const vitalData = [
      { name: 'Heart Rate', value: patientData.vitalSigns.avgHeartRate },
      { name: 'Respiratory Rate', value: patientData.vitalSigns.avgRespiratoryRate },
      { name: 'Temperature', value: patientData.vitalSigns.avgTemperature },
      { name: 'SBP', value: patientData.vitalSigns.avgSBP },
      { name: 'DBP', value: patientData.vitalSigns.avgDBP },
      { name: 'O2 Saturation', value: patientData.vitalSigns.avgO2Saturation },
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={vitalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Patient Details</CardTitle>
              <p className="card-category">Enter a subject ID to view patient information</p>
            </CardHeader>
            <CardBody>
              <Input
                placeholder="Enter Subject ID"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              />
              <Button color="primary" onClick={fetchPatientData}>Fetch Data</Button>

              {loading && <p>Loading patient data...</p>}
              {error && <p className="text-danger">{error}</p>}

              {patientData && (
                <>
                  <div className="mb-3">
                    <h5>Select Analysis by Timestamp</h5>
                    {renderTimestampDropdown()}
                  </div>

                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Subject ID</strong></td>
                        <td>{patientData.basicInfo.subject_id}</td>
                      </tr>
                      <tr>
                        <td><strong>Age</strong></td>
                        <td>{patientData.basicInfo.age}</td>
                      </tr>
                      <tr>
                        <td><strong>Gender</strong></td>
                        <td>{patientData.basicInfo.gender}</td>
                      </tr>
                      <tr>
                        <td><strong>Insurance Provider</strong></td>
                        <td>{patientData.basicInfo.insuranceProvider}</td>
                      </tr>
                    </tbody>
                  </Table>

                  <h5 className="mt-4">Admission Statistics</h5>
                  {renderAdmissionStatsChart()}

                  <h5 className="mt-4">Vital Signs</h5>
                  {renderVitalSignsChart()}

                  <h5 className="mt-4">Medical Summary</h5>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Most Common Diagnosis</strong></td>
                        <td>{patientData.medicalSummary.mostCommonDiagnosis}</td>
                      </tr>
                      <tr>
                        <td><strong>Most Common Procedure</strong></td>
                        <td>{patientData.medicalSummary.mostCommonProcedure}</td>
                      </tr>
                      <tr>
                        <td><strong>Unique Medications</strong></td>
                        <td>{patientData.medicalSummary.uniqueMedications}</td>
                      </tr>
                      <tr>
                        <td><strong>Unique Lab Tests</strong></td>
                        <td>{patientData.medicalSummary.uniqueLabTests}</td>
                      </tr>
                    </tbody>
                  </Table>

                  <h5 className="mt-4">Recent Admission</h5>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Admission Time</strong></td>
                        <td>{patientData.recentAdmission.admittime}</td>
                      </tr>
                      <tr>
                        <td><strong>Discharge Time</strong></td>
                        <td>{patientData.recentAdmission.dischtime}</td>
                      </tr>
                      <tr>
                        <td><strong>Length of Stay</strong></td>
                        <td>{patientData.recentAdmission.lengthOfStay}</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              )}

              
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Card>
      <CardHeader className="bg-secondary text-white">
                <CardTitle tag="h5">Latest Risk Prediction</CardTitle>
      </CardHeader>
      <CardBody>
      {riskChartData && (
        <Row>
          <Col md="6">
            <Card>
              <CardHeader className="bg-secondary text-white">
                <h2>Readmission Risk</h2>
              </CardHeader>
              <CardBody>
                <Doughnut data={riskChartData} />
              </CardBody>
            </Card>
          </Col>

          <Col md="6">
            <Card>
              <CardHeader className="bg-secondary text-white">
                <h2>Current Condition</h2>
              </CardHeader>
              <CardBody>
                <p>Probability: {probability?.toFixed(2)}</p>
                <p>Risk Level: {riskLevel}</p>
                <p>Recommendation: {recommendation}</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {summary && (
        <>
          {renderSection('Patient Summary', summary)}
          {renderSection('Care Plan', carePlan)}
          {renderSection('Additional Considerations', additionalFields)}
        </>
      )}

      </CardBody>
      </Card>
    </div>
  );
}

export default PatientDetails;
