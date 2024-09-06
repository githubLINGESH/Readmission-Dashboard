import React, { useState, useEffect } from "react";
import { Table, Card, CardHeader, CardBody, CardTitle, Row, Col , TabPane} from "reactstrap";
import axios from "axios";

function ModelPrediction() {
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
        <TabPane>
              <iframe src="https://66p61f62-8501.inc1.devtunnels.ms/" style={{width:"1200px", height:"1000px"}}></iframe>
        </TabPane>
    </div>
  );
}

export default ModelPrediction;
