import React, { useState } from "react";
import { Card, CardHeader, CardBody, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import axios from 'axios';
import Papa from 'papaparse';

const RiskPrediction = () => {
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
    admission_month: '',
    admission_day_of_week: '',
  });

  const [diagnoses, setDiagnoses] = useState({});
  const [procedures, setProcedures] = useState({});
  const [csvData, setCsvData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleDiagnosisChange = (code) => {
    setDiagnoses({ ...diagnoses, [code]: !diagnoses[code] });
  };

  const handleProcedureChange = (code) => {
    setProcedures({ ...procedures, [code]: !procedures[code] });
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
    setSaved(false);
    setPredictionResult(null);

    try {
      const payload = csvData ? { csvData } : { ...formData, diagnoses, procedures };

      const response = await axios.post('http://localhost:5000/api/risk-factor/save-and-predict', payload);
      setSaved(true);
      setPredictionResult(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error saving or predicting:", err);
      setError("Error saving or predicting. Please try again.");
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
                    <Col md="4">
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            id="diagnoses-4019"
                            name="diagnoses.4019"
                            checked={diagnoses['4019'] || false}
                            onChange={handleInputChange}
                          />
                          Hypertension (4019)
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            id="diagnoses-E785"
                            name="diagnoses.E785"
                            checked={diagnoses['E785'] || false}
                            onChange={handleInputChange}
                          />
                          Dyslipidemia (E785)
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            id="diagnoses-I10"
                            name="diagnoses.I10"
                            checked={diagnoses['I10'] || false}
                            onChange={handleInputChange}
                          />
                          Essential hypertension (I10)
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            id="diagnoses-2724"
                            name="diagnoses.2724"
                            checked={diagnoses['2724'] || false}
                            onChange={handleInputChange}
                          />
                          Hyperlipidemia (2724)
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            id="diagnoses-25000"
                            name="diagnoses.25000"
                            checked={diagnoses['25000'] || false}
                            onChange={handleInputChange}
                          />
                          Diabetes mellitus type 2 (25000)
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            id="diagnoses-F329"
                            name="diagnoses.F329"
                            checked={diagnoses['F329'] || false}
                            onChange={handleInputChange}
                          />
                          Major depressive disorder (F329)
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-Z87891"
        name="diagnoses.Z87891"
        checked={diagnoses['Z87891'] || false}
        onChange={handleInputChange}
      />
      History of nicotine dependence (Z87891)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-K219"
        name="diagnoses.K219"
        checked={diagnoses['K219'] || false}
        onChange={handleInputChange}
      />
      Gastro-esophageal reflux disease (K219)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-53081"
        name="diagnoses.53081"
        checked={diagnoses['53081'] || false}
        onChange={handleInputChange}
      />
      Esophageal reflux (53081)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-I2510"
        name="diagnoses.I2510"
        checked={diagnoses['I2510'] || false}
        onChange={handleInputChange}
      />
      Atherosclerotic heart disease (I2510)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-F419"
        name="diagnoses.F419"
        checked={diagnoses['F419'] || false}
        onChange={handleInputChange}
      />
      Anxiety disorder (F419)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-42731"
        name="diagnoses.42731"
        checked={diagnoses['42731'] || false}
        onChange={handleInputChange}
      />
      Atrial fibrillation (42731)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-4280"
        name="diagnoses.4280"
        checked={diagnoses['4280'] || false}
        onChange={handleInputChange}
      />
      Congestive heart failure (4280)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-311"
        name="diagnoses.311"
        checked={diagnoses['311'] || false}
        onChange={handleInputChange}
      />
      Depressive disorder (311)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-41401"
        name="diagnoses.41401"
        checked={diagnoses['41401'] || false}
        onChange={handleInputChange}
      />
      Coronary atherosclerosis (41401)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-N179"
        name="diagnoses.N179"
        checked={diagnoses['N179'] || false}
        onChange={handleInputChange}
      />
      Acute kidney failure (N179)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-Z20822"
        name="diagnoses.Z20822"
        checked={diagnoses['Z20822'] || false}
        onChange={handleInputChange}
      />
      Contact with COVID-19 (Z20822)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-V1582"
        name="diagnoses.V1582"
        checked={diagnoses['V1582'] || false}
        onChange={handleInputChange}
      />
      Personal history of tobacco use (V1582)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-Z7901"
        name="diagnoses.Z7901"
        checked={diagnoses['Z7901'] || false}
        onChange={handleInputChange}
      />
      Abnormal glucose (Z7901)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-5849"
        name="diagnoses.5849"
        checked={diagnoses['5849'] || false}
        onChange={handleInputChange}
      />
      Acute kidney failure (5849)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-2449"
        name="diagnoses.2449"
        checked={diagnoses['2449'] || false}
        onChange={handleInputChange}
      />
      Hypothyroidism (2449)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-E039"
        name="diagnoses.E039"
        checked={diagnoses['E039'] || false}
        onChange={handleInputChange}
      />
      Hypothyroidism (E039)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-Z794"
        name="diagnoses.Z794"
        checked={diagnoses['Z794'] || false}
        onChange={handleInputChange}
      />
      Long term use of insulin (Z794)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-E119"
        name="diagnoses.E119"
        checked={diagnoses['E119'] || false}
        onChange={handleInputChange}
      />
      Type 2 diabetes mellitus (E119)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-3051"
        name="diagnoses.3051"
        checked={diagnoses['3051'] || false}
        onChange={handleInputChange}
      />
      Tobacco use disorder (3051)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-2859"
        name="diagnoses.2859"
        checked={diagnoses['2859'] || false}
        onChange={handleInputChange}
      />
      Anemia (2859)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-F17210"
        name="diagnoses.F17210"
        checked={diagnoses['F17210'] || false}
        onChange={handleInputChange}
      />
      Nicotine dependence (F17210)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-G4733"
        name="diagnoses.G4733"
        checked={diagnoses['G4733'] || false}
        onChange={handleInputChange}
      />
      Obstructive sleep apnea (G4733)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-40390"
        name="diagnoses.40390"
        checked={diagnoses['40390'] || false}
        onChange={handleInputChange}
      />
      Hypertensive chronic kidney disease (40390)
    </Label>
  </FormGroup>
</Col>

<Col md="4">
  <FormGroup check>
    <Label check>
      <Input
        type="checkbox"
        id="diagnoses-V5861"
        name="diagnoses.V5861"
        checked={diagnoses['V5861'] || false}
        onChange={handleInputChange}
      />
      Long-term use of anticoagulants (V5861)
    </Label>
  </FormGroup>
</Col>
 </Row>
 </FormGroup>

    <h5>Procedures</h5>

    <FormGroup>
      {/* <Label for="procedures">Procedures</Label> */}
      <Row>

        <Col md="4">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                id="procedures-3893"
                name="procedures.3893"
                checked={procedures['3893'] || false}
                onChange={handleInputChange}
              />
              Venous catheterization (3893)
            </Label>
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                id="procedures-02HV33Z"
                name="procedures.02HV33Z"
                checked={procedures['02HV33Z'] || false}
                onChange={handleInputChange}
              />
              Insertion of infusion device into superior vena cava (02HV33Z)
            </Label>
          </FormGroup>
        </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-3897"
              name="procedures.3897"
              checked={procedures['3897'] || false}
              onChange={handleInputChange}
            />
            Central venous catheter placement (3897)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-3E0G76Z"
              name="procedures.3E0G76Z"
              checked={procedures['3E0G76Z'] || false}
              onChange={handleInputChange}
            />
            Introduction of nutritional substance into upper GI (3E0G76Z)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-966"
              name="procedures.966"
              checked={procedures['966'] || false}
              onChange={handleInputChange}
            />
            Enteral infusion of concentrated nutritional substances (966)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-0040"
              name="procedures.0040"
              checked={procedures['0040'] || false}
              onChange={handleInputChange}
            />
            Conversion of cardiac rhythm (0040)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-9671"
              name="procedures.9671"
              checked={procedures['9671'] || false}
              onChange={handleInputChange}
            />
            Continuous invasive mechanical ventilation (9671)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-5491"
              name="procedures.5491"
              checked={procedures['5491'] || false}
              onChange={handleInputChange}
            />
            Percutaneous abdominal drainage (5491)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-3722"
              name="procedures.3722"
              checked={procedures['3722'] || false}
              onChange={handleInputChange}
            />
            Left heart cardiac catheterization (3722)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-10E0XZZ"
              name="procedures.10E0XZZ"
              checked={procedures['10E0XZZ'] || false}
              onChange={handleInputChange}
            />
            Defibrillation of heart (10E0XZZ)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-4513"
              name="procedures.4513"
              checked={procedures['4513'] || false}
              onChange={handleInputChange}
            />
            Small intestine endoscopy (4513)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-8744"
              name="procedures.8744"
              checked={procedures['8744'] || false}
              onChange={handleInputChange}
            />
            Routine chest X-ray (8744)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-0DJ08ZZ"
              name="procedures.0DJ08ZZ"
              checked={procedures['0DJ08ZZ'] || false}
              onChange={handleInputChange}
            />
            Inspection of small intestine (0DJ08ZZ)
          </Label>
        </FormGroup>
      </Col>

      <Col md="4">
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              id="procedures-5A1221Z"
              name="procedures.5A1221Z"
              checked={procedures['5A1221Z'] || false}
              onChange={handleInputChange}
            />
            Performance of urinary filtration (5A1221Z)
          </Label>
        </FormGroup>
      </Col>


        <Col md="4">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                id="procedures-8856"
                name="procedures.8856"
                checked={procedures['8856'] || false}
                onChange={handleInputChange}
              />
              Coronary arteriography (8856)
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                id="procedures-3995"
                name="procedures.3995"
                checked={procedures['3995'] || false}
                onChange={handleInputChange}
              />
              Hemodialysis (3995)
            </Label>
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                id="procedures-8952"
                name="procedures.8952"
                checked={procedures['8952'] || false}
                onChange={handleInputChange}
              />
              Electrocardiogram (8952)
            </Label>
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                id="procedures-0BH17EZ"
                name="procedures.0BH17EZ"
                checked={procedures['0BH17EZ'] || false}
                onChange={handleInputChange}
              />
              Insertion of endotracheal airway into trachea (0BH17EZ)
            </Label>
          </FormGroup>
        </Col>
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

              {saved && (
                <Alert color="success" className="mt-4">
                  Data saved successfully.
                </Alert>
              )}
              {predictionResult && (
                <Alert color="info" className="mt-4">
                  <h5>Prediction Result</h5>
                  <p>Readmission Risk: {predictionResult.risk}</p>
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