import React, { useState } from "react";
import axios from 'axios';
import { Card, CardHeader, CardBody, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import Papa from 'papaparse';

const RiskPrediction = () => {
  const predefinedDiagnoses = {
    '4019': 'Hypertension',
    'E785': 'Dyslipidemia',
    'I10': 'Essential hypertension',
    '2724': 'Hyperlipidemia',
    '25000': 'Diabetes mellitus type 2',
    'F329': 'Major depressive disorder',
    'Z87891': 'History of nicotine dependence',
    'K219': 'Gastro-esophageal reflux disease',
    '53081': 'Esophageal reflux',
    'I2510': 'Atherosclerotic heart disease',
    'F419': 'Anxiety disorder',
    '42731': 'Atrial fibrillation',
    '4280': 'Congestive heart failure',
    '311': 'Depressive disorder',
    '41401': 'Coronary atherosclerosis',
    'N179': 'Acute kidney failure',
    'Z20822': 'Contact with COVID-19',
    'V1582': 'Personal history of tobacco use',
    'Z7901': 'Abnormal glucose',
    '5849': 'Acute kidney failure',
    '2449': 'Hypothyroidism',
    'E039': 'Hypothyroidism',
    'Z794': 'Long term use of insulin',
    'E119': 'Type 2 diabetes mellitus',
    '3051': 'Tobacco use disorder',
    '2859': 'Anemia',
    'F17210': 'Nicotine dependence',
    'G4733': 'Obstructive sleep apnea',
    '40390': 'Hypertensive chronic kidney disease',
    'V5861': 'Long-term use of anticoagulants'
  };

  const predefinedProcedures = {
    '3893': 'Venous catheterization',
    '02HV33Z': 'Insertion of infusion device into superior vena cava',
    '3897': 'Central venous catheter placement',
    '3E0G76Z': 'Introduction of nutritional substance into upper GI',
    '966': 'Enteral infusion of concentrated nutritional substances',
    '0040': 'Conversion of cardiac rhythm',
    '9671': 'Continuous invasive mechanical ventilation',
    '5491': 'Percutaneous abdominal drainage',
    '3722': 'Left heart cardiac catheterization',
    '10E0XZZ': 'Defibrillation of heart',
    '4513': 'Small intestine endoscopy',
    '8744': 'Routine chest X-ray',
    '0DJ08ZZ': 'Inspection of small intestine',
    '5A1221Z': 'Performance of urinary filtration',
    '8856': 'Coronary arteriography',
    '3995': 'Hemodialysis',
    '8952': 'Electrocardiogram',
    '0BH17EZ': 'Insertion of endotracheal airway into trachea'
  };

  const [formData, setFormData] = useState({
    age: '',
    los: '',
    num_procedures: '',
    num_diagnoses: '',
    prev_admissions: '',
    days_since_last_discharge: '',
    charlson_score: '',
    gender: '',
    marital_status: '',
    insurance: '',
    admission_type: '',
    admission_date: '',
  });

  const [diagnoses, setDiagnoses] = useState(
    Object.keys(predefinedDiagnoses).reduce((acc, code) => ({ ...acc, [code]: false }), {})
  );
  const [procedures, setProcedures] = useState(
    Object.keys(predefinedProcedures).reduce((acc, code) => ({ ...acc, [code]: false }), {})
  );

  const [csvData, setCsvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('diagnoses.')) {
      const code = name.split('.')[1];
      setDiagnoses(prev => ({ ...prev, [code]: checked }));
    } else if (name.startsWith('procedures.')) {
      const code = name.split('.')[1];
      setProcedures(prev => ({ ...prev, [code]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setError("Error parsing CSV file.");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const payload = csvData ? { csvData } : {
        ...formData,
        admission_date: formData.admission_date || null, 
        ...Object.keys(diagnoses).reduce((acc, key) => {
          acc[`diagnosis_${key}`] = diagnoses[key];
          return acc;
        }, {}),
        ...Object.keys(procedures).reduce((acc, key) => {
          acc[`procedure_${key}`] = procedures[key];
          return acc;
        }, {}),
      };

      const response = await axios.post('http://127.0.0.1:5001/predict', payload);
      setPredictionResult(response.data);
    } catch (err) {
      console.error("Error predicting:", err);
      setError("Error predicting. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <h5>Predict Patient Readmission Risk</h5>
              <p className="card-category">Enter patient data or upload a CSV to predict readmission risk.</p>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="6">
                  
                  <FormGroup>
                        <Label for="admission_date">Admission Date</Label>
                        <Input
                        type="date"
                        name="admission_date"
                        id="admission_date"
                        value={formData.admission_date}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                        />
                    </FormGroup>
                  </Col>

                  <Col md="6">
                  
                    <FormGroup>
                      <Label for="age">Age</Label>
                      <Input
                        type="number"
                        name="age"
                        id="age"
                        placeholder="Enter age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      />
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <Label for="los">Length of Stay</Label>
                      <Input
                        type="number"
                        name="los"
                        id="los"
                        placeholder="Enter length of stay"
                        value={formData.los}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="num_procedures">Number of Procedures</Label>
                      <Input
                        type="number"
                        name="num_procedures"
                        id="num_procedures"
                        placeholder="Enter number of procedures"
                        value={formData.num_procedures}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="num_diagnoses">Number of Diagnoses</Label>
                      <Input
                        type="number"
                        name="num_diagnoses"
                        id="num_diagnoses"
                        placeholder="Enter number of diagnoses"
                        value={formData.num_diagnoses}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="prev_admissions">Previous Admissions</Label>
                      <Input
                        type="number"
                        name="prev_admissions"
                        id="prev_admissions"
                        placeholder="Enter number of previous admissions"
                        value={formData.prev_admissions}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="days_since_last_discharge">Days Since Last Discharge</Label>
                      <Input
                        type="number"
                        name="days_since_last_discharge"
                        id="days_since_last_discharge"
                        placeholder="Enter days since last discharge"
                        value={formData.days_since_last_discharge}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="charlson_score">Charlson Score</Label>
                      <Input
                        type="number"
                        name="charlson_score"
                        id="charlson_score"
                        placeholder="Enter Charlson score"
                        value={formData.charlson_score}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="gender">Gender</Label>
                      <Input
                        type="select"
                        name="gender"
                        id="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      >
                        <option value="">Select gender</option>
                        <option value="F">Female</option>
                        <option value="M">Male</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="marital_status">Marital Status</Label>
                      <Input
                        type="select"
                        name="marital_status"
                        id="marital_status"
                        value={formData.marital_status}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      >
                        <option value="">Select marital status</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="MARRIED">Married</option>
                        <option value="SINGLE">Single</option>
                        <option value="WIDOWED">Widowed</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="insurance">Insurance</Label>
                      <Input
                        type="select"
                        name="insurance"
                        id="insurance"
                        value={formData.insurance}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      >
                        <option value="">Select insurance</option>
                        <option value="Private">Private</option>
                        <option value="Medicare">Medicare</option>
                        <option value="Medicaid">Medicaid</option>
                        <option value="Other">Other</option>
                        <option value="No charge">No charge</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="admission_type">Admission Type</Label>
                      <Input
                        type="select"
                        name="admission_type"
                        id="admission_type"
                        value={formData.admission_type}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      >
                        <option value="">Select admission type</option>
                        <option value="ELECTIVE">Elective</option>
                        <option value="URGENT">Urgent</option>
                        <option value="DIRECT EMER.">Direct Emergency</option>
                        <option value="EW EMER.">EW Emergency</option>
                        <option value="DIRECT OBSERVATION">Direct Observation</option>
                        <option value="EU OBSERVATION">EU Observation</option>
                        <option value="AMBULATORY OBSERVATION">Ambulatory Observation</option>
                        <option value="OBSERVATION ADMIT">Observation Admit</option>
                        <option value="SURGICAL SAME DAY ADMISSION">Surgical Same Day Admission</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="admission_month">Admission Month</Label>
                      <Input
                        type="number"
                        name="admission_month"
                        id="admission_month"
                        placeholder="Enter admission month (1-12)"
                        value={formData.admission_month}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                        min="1"
                        max="12"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="admission_day_of_week">Admission Day of Week</Label>
                      <Input
                        type="select"
                        name="admission_day_of_week"
                        id="admission_day_of_week"
                        value={formData.admission_day_of_week}
                        onChange={handleInputChange}
                        required={!csvData}
                        disabled={!!csvData}
                      >
                        <option value="">Select day of week</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                
                <h5>Diagnoses</h5>
                <FormGroup>
                  <Row>
                    {Object.entries(predefinedDiagnoses).map(([code, description]) => (
                      <Col md="4" key={code}>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              id={`diagnoses-${code}`}
                              name={`diagnoses.${code}`}
                              checked={diagnoses[code] || false}
                              onChange={handleInputChange}
                              disabled={!!csvData}
                            />
                            {description} ({code})
                          </Label>
                        </FormGroup>
                      </Col>
                    ))}
                  </Row>
                </FormGroup>

                <h5>Procedures</h5>
                <FormGroup>
                  <Row>
                    {Object.entries(predefinedProcedures).map(([code, description]) => (
                      <Col md="4" key={code}>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              id={`procedures-${code}`}
                              name={`procedures.${code}`}
                              checked={procedures[code] || false}
                              onChange={handleInputChange}
                              disabled={!!csvData}
                            />
                            {description} ({code})
                          </Label>
                        </FormGroup>
                      </Col>
                    ))}
                  </Row>
                </FormGroup>

                <hr />
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label for="csvFile">Upload CSV File</Label>
                      <Input
                        type="file"
                        name="csvFile"
                        id="csvFile"
                        onChange={handleFileUpload}
                        accept=".csv"
                      />
                      <small className="form-text text-muted">
                        CSV should contain headers matching the form fields, diagnoses, and procedures.
                      </small>
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="primary" type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Form>

                {predictionResult && (
                <Alert color="info" className="mt-4">
                  <h5>Prediction Result</h5>
                  <p>Readmission Risk: {predictionResult.risk_level}</p>
                  <p>Probability: {(predictionResult.probability * 100).toFixed(2)}%</p>
                  <p>Recommendation: {predictionResult.recommendation}</p>
                </Alert>
              )}
              {error && (
                <Alert color="danger" className="mt-4">
                  {error}
                </Alert>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RiskPrediction;