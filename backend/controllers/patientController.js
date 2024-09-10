const { getLatestRiskPrediction } = require('../models/riskPrediction');
const { getLatestLLMAnalysis } = require('../models/llmAnalysis');
const { getVisualizationData } = require("../models/patientModel");
const { transformVisualizationData } = require("../utils/dataTransformation");

exports.getPatientData = async (req, res) => {
    const { subjectId } = req.params;
    const { timestamp } = req.query;  // Use query param for filtering by timestamp

    try {
        const riskPredictions = await getLatestRiskPrediction(subjectId);  // Fetch all predictions
        const llmAnalyses = await getLatestLLMAnalysis(subjectId);           // Fetch all LLM analyses
        const visualizationData = await getVisualizationData(subjectId);

        if (!riskPredictions || !llmAnalyses || !visualizationData) {
            return res.status(404).json({ error: 'Data not found for the provided subject ID' });
        }

        // If a timestamp is provided, filter data by timestamp
        let filteredRiskPrediction = riskPredictions;
        let filteredLLMAnalysis = llmAnalyses;
        if (timestamp) {
            filteredRiskPrediction = riskPredictions.find(rp => new Date(rp.timestamp).toISOString() === timestamp);
            filteredLLMAnalysis = llmAnalyses.find(la => new Date(la.timestamp).toISOString() === timestamp);
        }

        // Get latest by default if no timestamp is provided
        const latestRiskPrediction = filteredRiskPrediction || riskPredictions[0];  // Assume latest is first
        const latestLLMAnalysis = filteredLLMAnalysis || llmAnalyses[0];

        // Transform the visualization data
        const transformedVisualizationData = transformVisualizationData(visualizationData);

        // Parse top features for the risk chart (for "Key Factors" chart)
        //const topFeatures = JSON.parse(latestRiskPrediction.top_features);

        // Transform data for the frontend

        const probability = parseFloat(latestRiskPrediction.probability);
        const riskScore = probability * 100; // Assuming `riskScore` is available in your prediction data
        const risk_level = latestRiskPrediction.risk_level;
        const recommendation = latestRiskPrediction.recommendation;

        const riskChartData = {
            labels: ['Risk', 'Safe'],
            datasets: [{
              data: [riskScore, 100 - riskScore],
              backgroundColor: ['#FF6384', '#36A2EB'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB']
            }]
          };

        // Transform LLM Analysis data for summary, care_plan, and additional fields
        const llmResponse = latestLLMAnalysis.llm_response;

        const summary = llmResponse.summary;
        const care_plan = llmResponse.care_plan;
        const additional_fields = llmResponse.additional_fields;

        // Send transformed data to the client
        res.json({
            riskPrediction: latestRiskPrediction,
            llmAnalysis: latestLLMAnalysis,
            visualizationData: transformedVisualizationData,
            riskChartData,
            probability,
            riskScore,
            risk_level,
            recommendation,
            summary,
            care_plan,
            additional_fields,
            riskPredictions,  // Return all predictions for filtering
            llmAnalyses       // Return all analyses for filtering
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
