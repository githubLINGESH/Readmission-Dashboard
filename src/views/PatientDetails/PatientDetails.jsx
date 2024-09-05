import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Table,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import { format } from 'date-fns';
import { Bar } from "react-chartjs-2";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
} from 'recharts';
import './PatientDetails.css';


const initialPatientData = {
  name: "KARTHIK",
  age: 45,
  dateOfBirth: "1979-05-15",
  gender: "Male",
  bloodGroup: "O+",
  weight: 75,
  height: 175,
  bmi: 24.5,
  contact: "987-838-4898",
  email: "karthik.doe@example.com",
  address: "123 Main St, Springfield",
  occupation: "Engineer",
  insuranceProvider: "HealthCare Inc.",
  insuranceNumber: "HC123456789",
  emergencyContact: {
    name: "Jane",
    relationship: "Wife",
    phone: "987-654-3210",
  },
  medicalHistory: [
    { condition: "Hypertension", diagnosed: "2015-03-10", status: "Ongoing" },
    { condition: "Diabetes Type 2", diagnosed: "2020-07-22", status: "Managed" },
    { condition: "Asthma", diagnosed: "2018-11-05", status: "Controlled" },
    { condition: "Appendectomy", diagnosed: "2010-09-18", status: "Resolved" },
  ],
  medications: [
    { name: "Lisinopril", dosage: "10 mg", frequency: "Daily", startDate: "2015-03-15" },
    { name: "Metformin", dosage: "500 mg", frequency: "Twice Daily", startDate: "2020-07-25" },
    { name: "Albuterol", dosage: "90 mcg", frequency: "As needed", startDate: "2018-11-10" },
  ],
  allergies: ["Peanuts", "Penicillin", "Latex"],
  immunizations: [
    { name: "Influenza", date: "2023-10-01" },
    { name: "COVID-19", date: "2023-05-15" },
    { name: "Tetanus", date: "2020-03-20" },
  ],
  labResults: [
    { test: "HbA1c", result: "6.5%", date: "2023-06-01", normalRange: "4.0-5.6%" },
    { test: "Blood Pressure", result: "128/82 mmHg", date: "2023-06-01", normalRange: "<120/80 mmHg" },
    { test: "Cholesterol", result: "195 mg/dL", date: "2023-06-01", normalRange: "<200 mg/dL" },
  ],
  vitalSigns: [
    { date: "2023-06-01", bloodPressure: "128/82", heartRate: 72, temperature: 36.6 },
    { date: "2023-05-01", bloodPressure: "130/85", heartRate: 75, temperature: 36.7 },
    { date: "2023-04-01", bloodPressure: "126/80", heartRate: 70, temperature: 36.5 },
  ],
  recentVisits: [
    { date: "2023-06-15", reason: "Routine Checkup", doctor: "Dr. Smith", notes: "Patient reported feeling well. No significant changes." },
    { date: "2023-05-10", reason: "Asthma Follow-up", doctor: "Dr. Johnson", notes: "Asthma well-controlled. Continued current management plan." },
    { date: "2023-04-05", reason: "Diabetes Management", doctor: "Dr. Patel", notes: "HbA1c slightly elevated. Adjusted Metformin dosage." },
  ],
};

function PatientDetails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patientData, setPatientData] = useState(initialPatientData);
  const [activeTab, setActiveTab] = useState('1');

  const handleSearch = () => {
    if (searchTerm.toLowerCase() === "john doe") {
      setPatientData(initialPatientData);
    } else {
      setPatientData(null);
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const renderVitalSignsChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={patientData.vitalSigns}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <BarChart yAxisId="left" type="monotone" dataKey="heartRate" stroke="#8884d8" name="Heart Rate" />
          <BarChart yAxisId="right" type="monotone" dataKey="temperature" stroke="#82ca9d" name="Temperature" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderLabResultsChart = () => {
    const labData = patientData.labResults.map(result => ({
      date: format(new Date(result.date), 'MMM dd, yyyy'),
      value: parseFloat(result.result)
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={labData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" name="Lab Result" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderMedicationChart = () => {
    const medData = patientData.medications.map((med, index) => ({
      name: med.name,
      dosage: parseInt(med.dosage) || 0, // Parse dosage as a number
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={medData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="dosage" stroke="#82ca9d" name="Dosage (mg)" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="patient-details-content">
      <Row>
        <Col md="12">
          <Card className="patient-details-card">
            <CardHeader className="patient-details-header">
              <CardTitle tag="h5">Patient Details</CardTitle>
              <p className="patient-details-category">
                Comprehensive patient information for healthcare professionals.
              </p>
            </CardHeader>
            <CardBody>
            <form className="flex w-1/2">
                <InputGroup className="patient-search-bar">
                  <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <InputGroupAddon addonType="append">
                    <Button onClick={handleSearch}>Search</Button>
                  </InputGroupAddon>
                </InputGroup>
              </form>

              {patientData ? (
                <>
                  <Row className="patient-info-section">
                    <Col md="6">
                      <h5 className="patient-details-subtitle">Basic Information</h5>
                      <ul className="patient-details-list">
                        <li><strong>Name:</strong> {patientData.name}</li>
                        <li><strong>Age:</strong> {patientData.age}</li>
                        <li><strong>Date of Birth:</strong> {patientData.dateOfBirth}</li>
                        <li><strong>Gender:</strong> {patientData.gender}</li>
                        <li><strong>Blood Group:</strong> {patientData.bloodGroup}</li>
                        <li><strong>Height:</strong> {patientData.height} cm</li>
                        <li><strong>Weight:</strong> {patientData.weight} kg</li>
                        <li><strong>BMI:</strong> {patientData.bmi.toFixed(1)}</li>
                      </ul>
                    </Col>
                    <Col md="6">
                      <h5 className="patient-details-subtitle">Contact Information</h5>
                      <ul className="patient-details-list">
                        <li><strong>Contact:</strong> {patientData.contact}</li>
                        <li><strong>Email:</strong> {patientData.email}</li>
                        <li><strong>Address:</strong> {patientData.address}</li>
                        <li><strong>Occupation:</strong> {patientData.occupation}</li>
                        <li><strong>Insurance Provider:</strong> {patientData.insuranceProvider}</li>
                        <li><strong>Insurance Number:</strong> {patientData.insuranceNumber}</li>
                        <li><strong>Emergency Contact:</strong> {patientData.emergencyContact.name} ({patientData.emergencyContact.relationship}) - {patientData.emergencyContact.phone}</li>
                      </ul>
                    </Col>
                  </Row>

                  <Nav tabs>
                    <NavItem>
                      <NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => toggleTab('1')}>
                        Medical History
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => toggleTab('2')}>
                        Medications & Allergies
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => toggleTab('3')}>
                        Lab Results & Vital Signs
                      </NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink
                        className={`${activeTab === '4' ? 'active' : ''} custom-nav-link`}
                        onClick={() => { toggleTab('4'); }}
                      >
                        Recent Visits
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <h5 className="patient-details-title mt-3">Medical History</h5>
                      <Table className="patient-details-table">
                        <thead>
                          <tr>
                            <th>Condition</th>
                            <th>Diagnosed</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientData.medicalHistory.map((entry, index) => (
                            <tr key={index}>
                              <td>{entry.condition}</td>
                              <td>{format(new Date(entry.diagnosed), 'MMM dd, yyyy')}</td>
                              <td>{entry.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <h5 className="patient-details-title mt-4">Immunizations</h5>
                      <Table className="patient-details-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientData.immunizations.map((immunization, index) => (
                            <tr key={index}>
                              <td>{immunization.name}</td>
                              <td>{format(new Date(immunization.date), 'MMM dd, yyyy')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </TabPane>

                    <TabPane tabId="2">
                      <h5 className="patient-details-title mt-3">Current Medications</h5>
                      <Table className="patient-details-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Start Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientData.medications.map((medication, index) => (
                            <tr key={index}>
                              <td>{medication.name}</td>
                              <td>{medication.dosage}</td>
                              <td>{medication.frequency}</td>
                              <td>{format(new Date(medication.startDate), 'MMM dd, yyyy')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <h5 className="patient-details-title mt-4">Medication Chart</h5>
                      {renderMedicationChart()}
                      <h5 className="patient-details-title mt-4">Allergies</h5>
                      <ul className="patient-details-list">
                        {patientData.allergies.map((allergy, index) => (
                          <li key={index}>{allergy}</li>
                        ))}
                      </ul>
                    </TabPane>

                    <TabPane tabId="3">
                      <h5 className="patient-details-title mt-3">Lab Results</h5>
                      <Table className="patient-details-table">
                        <thead>
                          <tr>
                            <th>Test</th>
                            <th>Result</th>
                            <th>Date</th>
                            <th>Normal Range</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientData.labResults.map((result, index) => (
                            <tr key={index}>
                              <td>{result.test}</td>
                              <td>{result.result}</td>
                              <td>{format(new Date(result.date), 'MMM dd, yyyy')}</td>
                              <td>{result.normalRange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <h5 className="patient-details-title mt-4">Vital Signs Chart</h5>
                      {renderVitalSignsChart()}
                      <h5 className="patient-details-title mt-4">Lab Results Chart</h5>
                      {renderLabResultsChart()}
                    </TabPane>

                    <TabPane tabId="4">
                      <h5 className="patient-details-title mt-3">Recent Visits</h5>
                      <Table className="patient-details-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Doctor</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientData.recentVisits.map((visit, index) => (
                            <tr key={index}>
                              <td>{format(new Date(visit.date), 'MMM dd, yyyy')}</td>
                              <td>{visit.reason}</td>
                              <td>{visit.doctor}</td>
                              <td>{visit.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </TabPane>
                  </TabContent>
                </>
              ) : (
                <Card className="patient-details-card">
                  <CardBody>
                    <h5 className="patient-details-title">No patient found with the name "{searchTerm}".</h5>
                  </CardBody>
                </Card>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PatientDetails;
