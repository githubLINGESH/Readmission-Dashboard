import React, { useState } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Alert,
} from "reactstrap";

function UserProfile() {
  const [formData, setFormData] = useState({
    username: "patient123",
    email: "patient@example.com",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St, Melbourne",
    city: "Melbourne",
    country: "Australia",
    postalCode: "3000",
    phone: "123-456-7890",
    medicalHistory: "",
    currentMedications: "",
    riskFactors: "",
    carePlanDetails: "Regular follow-ups every month.",
    about: "Patient with a history of heart disease.",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation can be added here
    setSuccessMessage("Profile updated successfully!");
  };

  return (
    <>
      <div className="content">
        {successMessage && <Alert color="success">{successMessage}</Alert>}
        <Row>
          <Col md="4">
            <Card className="card-user">
              <div className="image">
                <img alt="Background" src={require("assets/img/damir-bosnjak.jpg")} />
              </div>
              <CardBody>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="User Avatar"
                      className="avatar border-gray"
                      src={require("assets/img/mike.jpg")}
                    />
                    <h5 className="title">{`${formData.firstName} ${formData.lastName}`}</h5>
                  </a>
                  <p className="description">@{formData.username}</p>
                </div>
                <p className="description text-center">{formData.about}</p>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="button-container">
                  <Row>
                    <Col className="ml-auto" lg="3" md="6" xs="6">
                      <h5>
                        12 <br />
                        <small>Files</small>
                      </h5>
                    </Col>
                    <Col className="ml-auto mr-auto" lg="4" md="6" xs="6">
                      <h5>
                        2GB <br />
                        <small>Used</small>
                      </h5>
                    </Col>
                    <Col className="mr-auto" lg="3">
                      <h5>
                        24.6$ <br />
                        <small>Spent</small>
                      </h5>
                    </Col>
                  </Row>
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="8">
            <Card className="card-user">
              <CardHeader>
                <CardTitle tag="h5">Edit Profile</CardTitle>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="5">
                      <FormGroup>
                        <label>Username</label>
                        <Input
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Username"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-1" md="3">
                      <FormGroup>
                        <label>Email address</label>
                        <Input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email"
                          type="email"
                          required
                          aria-label="Email address"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="4">
                      <FormGroup>
                        <label>Phone Number</label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          type="tel"
                          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Home Address"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <FormGroup>
                        <label>City</label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-1" md="4">
                      <FormGroup>
                        <label>Country</label>
                        <Input
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="Country"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="4">
                      <FormGroup>
                        <label>Postal Code</label>
                        <Input
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="ZIP Code"
                          type="number"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Medical History</label>
                        <Input
                          name="medicalHistory"
                          value={formData.medicalHistory}
                          onChange={handleChange}
                          type="textarea"
                          placeholder="Enter your medical history..."
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Current Medications</label>
                        <Input
                          name="currentMedications"
                          value={formData.currentMedications}
                          onChange={handleChange}
                          type="textarea"
                          placeholder="List current medications..."
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Risk Factors</label>
                        <Input
                          name="riskFactors"
                          value={formData.riskFactors}
                          onChange={handleChange}
                          type="textarea"
                          placeholder="List any risk factors..."
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Care Plan Details</label>
                        <Input
                          name="carePlanDetails"
                          value={formData.carePlanDetails}
                          onChange={handleChange}
                          type="textarea"
                          placeholder="Describe your care plan..."
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <div className="update ml-auto mr-auto">
                      <Button
                        className="btn-round"
                        color="primary"
                        type="submit"
                      >
                        Update Profile
                      </Button>
                      <Button
                        className="btn-round"
                        color="secondary"
                        type="button"
                        onClick={() => setFormData({ ...formData, phone: "", website: "" })}
                      >
                        Reset
                      </Button>
                    </div>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserProfile;
