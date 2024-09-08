from flask import Flask, request, jsonify
from pydantic import BaseModel, ValidationError
from llm_analysis import process_patient
from flask_cors import CORS
import psycopg2
import json
import pandas as pd
import numpy as np
import joblib
from sqlalchemy import create_engine
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.utils import check_random_state
from typing import Dict, Any, List, Union
from datetime import datetime
import json

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
CORS(app)

# Database connection setup
def get_db_connection():
    return psycopg2.connect("dbname=mimic_4 user=postgres password=Ling2522 host=localhost")

# Classes for model prediction
class FixRandomState(BaseEstimator, TransformerMixin):
    def __init__(self, random_state=None):
        self.random_state = random_state

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X

def load_model():
    try:
        model = joblib.load('best_readmission_risk_model_fin.joblib')
    except TypeError as e:
        if "__randomstate_ctor()" in str(e):
            model = joblib.load('best_readmission_risk_model_fin.joblib', mmap_mode='r')
            for step in model.steps:
                if hasattr(step[1], 'random_state'):
                    step[1].random_state = check_random_state(step[1].random_state)
            model.steps.append(('fix_random_state', FixRandomState()))
        else:
            raise
    return model

model = load_model()

def ensure_all_columns(df, expected_columns):
    missing_cols = [col for col in expected_columns if col not in df.columns]
    if missing_cols:
        df = pd.concat([df, pd.DataFrame(columns=missing_cols)], axis=1)
        df.fillna(0, inplace=True)
    return df

def get_patient_data(subject_id):
    engine = create_engine('postgresql://postgres:Ling2522@localhost:5432/mimic_4')
    query = "SELECT * FROM mimiciv_derived.patient_prediction_data WHERE subject_id = %s"
    df = pd.read_sql(query, engine, params=(subject_id,))
    return df

@app.route('/predict', methods=['POST'])
def predict():
    subject_id = request.json.get('subject_id')
    if not subject_id:
        return jsonify({'error': 'No subject_id provided'}), 400

    # Retrieve data from PostgreSQL
    df = get_patient_data(subject_id)
    if df.empty:
        return jsonify({'error': 'No data found for the provided subject_id'}), 404
    
    # Prepare input data for prediction
    input_data = df.drop(columns=['subject_id'])  # Drop any non-feature columns

    # Ensure all expected columns are present
    expected_features = model.named_steps['preprocessor'].transformers_[0][1].get_feature_names_out()
    input_data = ensure_all_columns(input_data, expected_features)

    # Make prediction
    prediction = model.predict(input_data)
    probability = model.predict_proba(input_data)[0][1]

    # Get feature importances and top features
    feature_importance = model.named_steps['classifier'].feature_importances_
    feature_names = model.named_steps['preprocessor'].get_feature_names_out()

    # Sort feature importances in descending order
    indices = np.argsort(feature_importance)[::-1]
    
    # Get top 5 important features
    top_features = pd.DataFrame({
        'Feature': [feature_names[i] for i in indices[:5]],
        'Importance': [feature_importance[i] for i in indices[:5]]
    })

    # Convert top features to a list of dictionaries for easy JSON serialization
    top_features_json = top_features.to_dict(orient='records')

    result = {
        'prediction': int(prediction[0]),
        'probability': float(probability),
        'risk_level': 'High' if prediction[0] == 1 else 'Low',
        'recommendation': 'Consider implementing additional post-discharge support and follow-up for this patient.' if prediction[0] == 1 else 'Standard follow-up procedures should be sufficient for this patient.',
        'top_features': top_features_json  # Return top features
    }

    # Store prediction data in PostgreSQL
    prediction_request = PredictionRequest(
        subject_id=str(subject_id),  # Convert subject_id to string
        probability=result['probability'],
        prediction=result['prediction'],
        risk_level=result['risk_level'],
        recommendation=result['recommendation'],
        top_features=result['top_features']
    )
    try:
        store_risk_prediction_with_time(prediction_request)
    except ValidationError as e:
        return jsonify(e.errors()), 400

    return jsonify(result)



# Pydantic models for data validation and response structure
class PredictionRequest(BaseModel):
    subject_id: str
    probability: float
    prediction: int
    risk_level: str
    recommendation: str
    top_features: List[Dict[str, Any]]


class LLMResponseRequest(BaseModel):
    subject_id: str
    prediction: PredictionRequest
    llm_response: Dict[str, Any]



def store_risk_prediction_with_time(data: PredictionRequest):
    timestamp = datetime.now()
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO patient_analysis.risk_prediction (subject_id, probability, prediction, risk_level, recommendation, top_features, timestamp)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, 
                (data.subject_id, data.probability, data.prediction, data.risk_level, data.recommendation, json.dumps(data.top_features), timestamp)
            )
            conn.commit()

def store_llm_analysis_with_time(subject_id, llm_response):
    timestamp = datetime.now()
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO patient_analysis.llm_analysis (subject_id, llm_response, timestamp)
                VALUES (%s, %s, %s)
                """, 
                (subject_id, json.dumps(llm_response), timestamp)
            )
            conn.commit()


from typing import Dict, Any, List, Union

def parse_llm_response(llm_result: str) -> Dict[str, Any]:
    parsed_response = {}
    current_section = None
    current_content = []
    
    print(f"Starting to parse LLM result:\n{llm_result}")  # Debug log
    
    lines = llm_result.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check for main section headers (starts with '**' and ends with '**')
        if line.startswith('**') and line.endswith('**'):
            if current_section:
                parsed_response[current_section] = parse_section_content(current_content)
                print(f"Parsed section '{current_section}': {parsed_response[current_section]}")  # Debug log
            current_section = line.strip('*').strip()
            current_content = []
        else:
            current_content.append(line)
    
    # Parse the last section
    if current_section:
        parsed_response[current_section] = parse_section_content(current_content)
        print(f"Parsed section '{current_section}': {parsed_response[current_section]}")  # Debug log
    
    print(f"Final parsed response: {parsed_response}")  # Debug log
    return parsed_response

def parse_section_content(content: List[str]) -> Union[str, Dict[str, Any]]:
    if not content:
        return ""
    
    # Check if the section has bullet points
    if any(line.strip().startswith('*') for line in content):
        return parse_bulleted_list(content)
    else:
        return ' '.join(content)

def parse_bulleted_list(lines: List[str]) -> Dict[str, Any]:
    result = {}
    current_item = None
    current_content = []
    
    for line in lines:
        line = line.strip()
        if line.startswith('*'):
            if current_item:
                result[current_item] = ' '.join(current_content)
            current_item = line[1:].strip()
            current_content = []
        elif current_item:
            current_content.append(line)
    
    # Add the last item
    if current_item:
        result[current_item] = ' '.join(current_content)
    
    return result


@app.route('/llm_analysis', methods=['POST'])
def llm_analysis():
    data = request.json
    print(f"Received data for LLM analysis: {data}")  # Log received data

    if not data:
        return jsonify({'error': 'No data provided in the request'}), 400

    subject_id = data.get('subjectId')
    prediction_data = data.get('predictionData')

    if not subject_id:
        return jsonify({'error': 'No subjectId provided in the request data'}), 400
    if not prediction_data:
        return jsonify({'error': 'No predictionData provided in the request data'}), 400

    try:
        # Analyze patient data using process_patient
        summary, care_plan, additional_fields = process_patient(subject_id)

        # Log results before parsing
        print(f"LLM Summary: {summary}")
        print(f"LLM Care Plan: {care_plan}")
        print(f"LLM Additional Fields: {additional_fields}")

        # Parse the LLM response
        parsed_summary = parse_llm_response(summary)
        parsed_care_plan = parse_llm_response(care_plan)
        parsed_additional_fields = parse_llm_response(additional_fields)

        # Store LLM analysis data in PostgreSQL
        store_llm_analysis_with_time(subject_id, {
            'summary': parsed_summary,
            'care_plan': parsed_care_plan,
            'additional_fields': parsed_additional_fields
        })

        return jsonify({
            'summary': parsed_summary,
            'care_plan': parsed_care_plan,
            'additional_fields': parsed_additional_fields
        })
    except Exception as e:
        print(f"Error in llm_analysis: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred during analysis'}), 500
    

if __name__ == '__main__':
    app.run(port=8000, debug=True)
