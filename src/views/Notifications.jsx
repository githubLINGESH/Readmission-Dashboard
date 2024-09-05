import React, { useState, useEffect } from "react";
import { Table, Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import axios from "axios";

function ReadmissionRiskTable() {
  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/risk-factor/get-notified")
      .then(response => {
        setPatientsData(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Patient Readmission Risk Table</CardTitle>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Readmission Risk</th>
                    <th>Last Admission Date</th>
                    <th>Next Follow-Up Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patientsData.map((patient, index) => (
                    <tr key={index}>
                      <td>{patient.subject_id}</td>
                      <td>{patient.anchor_age}</td>
                      <td>
                        <span className={`badge ${patient.readmission_risk === "High" ? "badge-danger" : patient.readmission_risk === "Moderate" ? "badge-warning" : "badge-success"}`}>
                          {patient.readmission_risk}
                        </span>
                      </td>
                      <td>{patient.last_admission_date}</td>
                      <td>{patient.follow_up_date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReadmissionRiskTable;
