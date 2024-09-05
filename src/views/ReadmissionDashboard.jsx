import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faAmbulance, faRunning, faHeart } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/data');
        console.log("Response Data", response.data);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const {
    readmissionRate,
    highRiskCount,
    totalAdmissions,
    readmissionTrends,
    riskDistribution,
    monthlyAdmissions,
    demographics,
    medicationUsage,
    lengthOfStay,
    vitalSigns,
    patientSatisfaction
  } = dashboardData;

  const patientReadmissionChart = {
    data: {
      labels: readmissionTrends.map(item => new Date(item.month).toLocaleDateString()),
      datasets: [{
        label: "Readmission Rate",
        borderColor: "#f17e5d",
        backgroundColor: "#f17e5d",
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        data: readmissionTrends.map(item => parseInt(item.readmissions)),
      }],
    },
    options: {
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
      scales: {
        y: {
          ticks: {
            color: "#9f9f9f",
            beginAtZero: true,
            maxTicksLimit: 7,
          },
          grid: {
            drawBorder: false,
            display: true,
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
          },
          ticks: {
            padding: 10,
            color: "#9f9f9f",
          },
        },
      },
    },
  };

  const patientRiskDistributionChart = {
    data: {
      labels: ['Low', 'Medium', 'High'],
      datasets: [{
        label: "Risk Levels",
        backgroundColor: ["#4acccd", "#fcc468", "#ef8157"],
        borderWidth: 0,
        data: [
          riskDistribution.find(item => item.risk_level === 'Low')?.patient_count || 0,
          riskDistribution.find(item => item.risk_level === 'Medium')?.patient_count || 0,
          riskDistribution.find(item => item.risk_level === 'High')?.patient_count || 0
        ],
      }],
    },
    options: {
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
      maintainAspectRatio: false,
    },
  };

  const totalAdmissionsChart = {
    data: {
      labels: monthlyAdmissions.map(item => new Date(item.month).toLocaleDateString()),
      datasets: [
        {
          label: "Admissions",
          data: monthlyAdmissions.map(item => parseInt(item.total_admissions)),
          fill: false,
          borderColor: "#85c1e9",
          backgroundColor: "transparent",
          pointBorderColor: "#85c1e9",
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: "Readmissions",
          data: monthlyAdmissions.map(item => parseInt(item.readmissions)),
          fill: false,
          borderColor: "#ef8157",
          backgroundColor: "transparent",
          pointBorderColor: "#ef8157",
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: true },
      },
      scales: {
        y: {
          ticks: {
            color: "#9f9f9f",
            beginAtZero: true,
            maxTicksLimit: 7,
          },
          grid: {
            drawBorder: false,
            display: true,
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
          },
          ticks: {
            padding: 10,
            color: "#9f9f9f",
          },
        },
      },
    },
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="text-center text-warning">
                        <FontAwesomeIcon icon={faChartBar} />
                      </i>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Readmission Rate</p>
                      <CardTitle tag="p">{readmissionRate}%</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Updated now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className=" text-center text-warning">
                        <FontAwesomeIcon icon={faAmbulance} style={{ color: 'salmon' }}/>
                      </i>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">High-Risk Patients</p>
                      <CardTitle tag="p">{highRiskCount}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-calendar" /> Last 24 hours
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className=" text-center text-warning">
                        <FontAwesomeIcon icon={faRunning} style={{ color: 'skyblue' }}/>
                      </i>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Admissions</p>
                      <CardTitle tag="p">{totalAdmissions}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Updated now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className=" text-center text-warning">
                        <FontAwesomeIcon icon={faHeart} style={{ color: 'lightgreen' }}/>
                      </i>
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Satisfied Patients</p>
                      <CardTitle tag="p">{patientSatisfaction}%</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> In the last month
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Readmission Trends</CardTitle>
                <p className="card-category">Past Month Performance</p>
              </CardHeader>
              <CardBody>
                <Bar
                  data={patientReadmissionChart.data}
                  options={patientReadmissionChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 10 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Risk Distribution</CardTitle>
                <p className="card-category">Current Patient Risk Levels</p>
              </CardHeader>
              <CardBody style={{ height: "266px" }}>
                <Pie
                  data={patientRiskDistributionChart.data}
                  options={patientRiskDistributionChart.options}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-primary" /> Low Risk{" "}
                  <i className="fa fa-circle text-warning" /> Medium Risk{" "}
                  <i className="fa fa-circle text-danger" /> High Risk{" "}
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-calendar" /> Last updated today
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">Admissions Over Time</CardTitle>
                <p className="card-category">Past Year Performance</p>
              </CardHeader>
              <CardBody style={{ height: "266px" }} className="m-2">
                <Line
                  data={totalAdmissionsChart.data}
                  options={totalAdmissionsChart.options}
                />
              </CardBody>
              <CardFooter>
                <div className="chart-legend">
                  <i className="fa fa-circle text-info" /> Admissions{" "}
                  <i className="fa fa-circle text-warning" /> Readmissions
                </div>
                <hr />
                <div className="card-stats">
                  <i className="fa fa-check" /> Data validated
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Patient Demographics</CardTitle>
                <p className="card-category">Gender Distribution</p>
              </CardHeader>
              <CardBody >
              <Line
                  data={{
                    labels: demographics.map(item => item.gender),
                    datasets: [{
                      label :"Gender",
                      data: demographics.map(item => item.count),
                      backgroundColor: ['#36A2EB'],
                      borderColor: "#85c1e9",
                      pointBorderColor: "      ",
                      pointRadius: 3,
                      pointHoverRadius: 5,
                      borderWidth: 2,
                      tension: 0.4,
                    }]
                  }}
                />

              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Medication Usage</CardTitle>
                <p className="card-category">Common Medications</p>
              </CardHeader>
              <CardBody>
                <Bar
                  data={{
                    labels: medicationUsage.map(item => item.drug),
                    datasets: [{
                      label: 'Usage',
                      data: medicationUsage.map(item => item.count),
                      backgroundColor: 'rgba(75,192,192,0.4)',
                      borderColor: 'rgba(75,192,192,1)',
                    }]
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Length of Stay</CardTitle>
                <p className="card-category">Patient Stay Duration</p>
              </CardHeader>
              <CardBody>
                <Bar
                  data={{
                    labels: lengthOfStay.map(item => item.los),
                    datasets: [{
                      label: "Length of Stay",
                      data: lengthOfStay.map(item => item.count),
                      backgroundColor: '#42A5F5'
                    }]
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Vital Signs</CardTitle>
                <p className="card-category">Average Vital Signs</p>
              </CardHeader>
              <CardBody>
              <Bar
                  data={{
                    labels: ['Heart Rate', 'Respiratory Rate', 'Temperature'],
                    datasets: [{
                      label: 'Average',
                      data: [vitalSigns.heart_rate, vitalSigns.respiratory_rate, vitalSigns.temperature],
                      backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    }]
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;