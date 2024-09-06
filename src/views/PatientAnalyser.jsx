import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const PatientAnalysis = ({ subjectId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/patient/${10000032}/full_analysis`);
        setAnalysis(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient analysis');
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [subjectId]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!analysis) return <div className="text-center">No analysis available</div>;

  const { risk_assessment, patient_history, care_plan } = analysis;
  const riskScore = risk_assessment.risk_score;
  const keyRiskFactors = risk_assessment.risk_factors;

  const riskChartData = {
    labels: ['Risk', 'Safe'],
    datasets: [{
      data: [riskScore, 100 - riskScore],
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB']
    }]
  };

  const factorsChartData = {
    labels: keyRiskFactors.map(factor => factor.split(':')[0]),
    datasets: [{
      label: 'Risk Factors',
      data: keyRiskFactors.map(() => Math.random() * 100),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Patient Analysis for Subject ID: {subjectId}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Readmission Risk</h2>
          <Doughnut data={riskChartData} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Key Risk Factors</h2>
          <Bar data={factorsChartData} />
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Patient History Summary</h2>
          <div className="bg-white p-4 rounded shadow">
            {patient_history.summary.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Current Condition</h2>
          <div className="bg-white p-4 rounded shadow">
            <p>{risk_assessment.detailed_assessment}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Personalized Care Plan</h2>
          <div className="bg-white p-4 rounded shadow">
            {care_plan.plan.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Key Risk Factors</h2>
          <div className="bg-white p-4 rounded shadow">
            <ul className="list-disc pl-5">
              {keyRiskFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientAnalysis;