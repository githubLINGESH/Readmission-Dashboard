import os
import time
import asyncio
from dotenv import load_dotenv
from functools import lru_cache
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationChain
from database.connection import get_mimic_hosp_connection, get_mimic_icu_connection, close_connection
import google.generativeai as genai
from cachetools import TTLCache

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")
genai.configure(api_key=GEMINI_API_KEY)

# Initialize LangChain components
llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0, google_api_key=GEMINI_API_KEY)
embeddings = HuggingFaceEmbeddings()
memory = ConversationBufferMemory()

# Create a conversation chain
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True
)

# Create a cache for patient analysis results
patient_analysis_cache = TTLCache(maxsize=100, ttl=3600)  # Cache for 1 hour

# Create a global event loop
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

@lru_cache(maxsize=100)
def get_patient_data(subject_id):
    hosp_conn = get_mimic_hosp_connection()
    icu_conn = get_mimic_icu_connection()
    
    if not hosp_conn or not icu_conn:
        raise ConnectionError("Could not connect to one or both databases")
    
    try:
        with hosp_conn.cursor() as hosp_cur, icu_conn.cursor() as icu_cur:
            # Fetch admission data
            hosp_cur.execute("""
                SELECT admittime, dischtime, admission_type, admission_location, discharge_location, insurance, language, marital_status, race
                FROM admissions
                WHERE subject_id = %s
                ORDER BY admittime DESC
                LIMIT 1
            """, (subject_id,))
            admission_data = hosp_cur.fetchone()

            # Fetch diagnosis data
            hosp_cur.execute("""
                SELECT d.icd_code, di.long_title
                FROM diagnoses_icd d
                JOIN d_icd_diagnoses di ON d.icd_code = di.icd_code
                WHERE d.subject_id = %s
            """, (subject_id,))
            diagnoses = hosp_cur.fetchall()

            # Fetch lab events
            hosp_cur.execute("""
                SELECT l.charttime, di.label, l.value, l.valuenum, l.valueuom, l.flag
                FROM labevents l
                JOIN d_labitems di ON l.itemid = di.itemid
                WHERE l.subject_id = %s
                ORDER BY l.charttime DESC
                LIMIT 50
            """, (subject_id,))
            lab_events = hosp_cur.fetchall()

            # Fetch medication data
            hosp_cur.execute("""
                SELECT starttime, stoptime, drug, dose_val_rx, dose_unit_rx, route
                FROM prescriptions
                WHERE subject_id = %s
                ORDER BY starttime DESC
                LIMIT 20
            """, (subject_id,))
            medications = hosp_cur.fetchall()

            # Fetch ICU stay data
            icu_cur.execute("""
                SELECT intime, outtime, los
                FROM icustays
                WHERE subject_id = %s
                ORDER BY intime DESC
                LIMIT 1
            """, (subject_id,))
            icu_stay = icu_cur.fetchone()

            # Fetch vital signs from ICU
            icu_cur.execute("""
                SELECT charttime, valuenum, valueuom
                FROM chartevents
                WHERE subject_id = %s
                AND itemid IN (
                    220045, -- Heart Rate
                    220050, -- Arterial Blood Pressure systolic
                    220051, -- Arterial Blood Pressure diastolic
                    220052, -- Arterial Blood Pressure mean
                    220179, -- Temperature
                    220210  -- Respiratory Rate
                )
                ORDER BY charttime DESC
                LIMIT 100
            """, (subject_id,))
            icu_vitals = icu_cur.fetchall()

        return {
            'admission': admission_data,
            'diagnoses': diagnoses,
            'lab_events': lab_events,
            'medications': medications,
            'icu_stay': icu_stay,
            'icu_vitals': icu_vitals
        }
    finally:
        close_connection(hosp_conn)
        close_connection(icu_conn)

def create_vector_store(patient_data):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    texts = []
    metadatas = []

    # Process admission data
    admission_text = f"Admission: {patient_data['admission']}"
    chunks = text_splitter.split_text(admission_text)
    texts.extend(chunks)
    metadatas.extend([{"source": "admission"}] * len(chunks))

    # Process diagnoses
    diagnoses_text = "Diagnoses: " + "; ".join([f"{code}: {title}" for code, title in patient_data['diagnoses']])
    chunks = text_splitter.split_text(diagnoses_text)
    texts.extend(chunks)
    metadatas.extend([{"source": "diagnoses"}] * len(chunks))

    # Process lab events
    lab_text = "Lab Events: " + "; ".join([f"{label}: {value} {valueuom} ({flag})" for _, label, value, _, valueuom, flag in patient_data['lab_events']])
    chunks = text_splitter.split_text(lab_text)
    texts.extend(chunks)
    metadatas.extend([{"source": "lab_events"}] * len(chunks))

    # Process medications
    med_text = "Medications: " + "; ".join([f"{drug} {dose_val_rx} {dose_unit_rx} {route}" for _, _, drug, dose_val_rx, dose_unit_rx, route in patient_data['medications']])
    chunks = text_splitter.split_text(med_text)
    texts.extend(chunks)
    metadatas.extend([{"source": "medications"}] * len(chunks))

    # Process ICU stay
    if patient_data['icu_stay']:
        icu_text = f"ICU Stay: Intime: {patient_data['icu_stay'][0]}, Outtime: {patient_data['icu_stay'][1]}, LOS: {patient_data['icu_stay'][2]}"
        chunks = text_splitter.split_text(icu_text)
        texts.extend(chunks)
        metadatas.extend([{"source": "icu_stay"}] * len(chunks))

    # Process ICU vitals
    icu_vitals_text = "ICU Vitals: " + "; ".join([f"{charttime}: {valuenum} {valueuom}" for charttime, valuenum, valueuom in patient_data['icu_vitals']])
    chunks = text_splitter.split_text(icu_vitals_text)
    texts.extend(chunks)
    metadatas.extend([{"source": "icu_vitals"}] * len(chunks))

    return FAISS.from_texts(texts, embeddings, metadatas=metadatas)

def format_patient_data(patient_data):
    formatted = []
    for key, value in patient_data.items():
        if key == 'admission':
            formatted.append(f"Admission: {', '.join(map(str, value))}")
        elif key == 'diagnoses':
            formatted.append("Diagnoses: " + "; ".join([f"{code}: {title}" for code, title in value]))
        elif key == 'lab_events':
            formatted.append("Lab Events: " + "; ".join([f"{label}: {value} {valueuom} ({flag})" for _, label, value, _, valueuom, flag in value[:5]]))  # Limit to 5 for brevity
        elif key == 'medications':
            formatted.append("Medications: " + "; ".join([f"{drug} {dose_val_rx} {dose_unit_rx} {route}" for _, _, drug, dose_val_rx, dose_unit_rx, route in value[:5]]))  # Limit to 5 for brevity
        elif key == 'icu_stay':
            formatted.append(f"ICU Stay: Intime: {value[0]}, Outtime: {value[1]}, LOS: {value[2]}")
        elif key == 'icu_vitals':
            formatted.append("ICU Vitals: " + "; ".join([f"{charttime}: {valuenum} {valueuom}" for charttime, valuenum, valueuom in value[:5]]))  # Limit to 5 for brevity
    return "\n".join(formatted)

def rate_limited_predict(prompt_input):
    max_retries = 5
    base_delay = 2
    for attempt in range(max_retries):
        try:
            return conversation.predict(input=prompt_input)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt)
            print(f"API call failed. Retrying in {delay} seconds... Error: {str(e)}")
            time.sleep(delay)

def analyze_patient_data(subject_id):
    if subject_id in patient_analysis_cache:
        print(f"Returning cached result for patient {subject_id}")
        return patient_analysis_cache[subject_id]

    patient_data = get_patient_data(subject_id)
    if not patient_data:
        return None, None, None
    
    formatted_patient_data = format_patient_data(patient_data)

    prompts = {
        "summary": f"""Based on the patient data provided, generate a detailed summary and analysis.
        The patient data includes:
        {formatted_patient_data}
        
        Provide an overview of the patient's medical history, including key risk factors and any relevant insights.""",
        
        "care_plan": f"""Based on the provided patient data, generate a personalized care plan.
        Patient Data:
        {formatted_patient_data}
        
        Provide specific recommendations for care, including potential interventions, follow-ups, and monitoring.""",
        
        "additional_fields": f"""Given the following patient data, identify additional fields or factors that should be considered for a comprehensive risk analysis:
        Patient Data:
        {formatted_patient_data}
        
        Provide a list of additional fields or factors along with their potential impact on the patient's risk analysis."""
    }

    results = {}
    for key, prompt in prompts.items():
        results[key] = rate_limited_predict(prompt)

    patient_analysis_cache[subject_id] = (results["summary"], results["care_plan"], results["additional_fields"])
    return results["summary"], results["care_plan"], results["additional_fields"]

def process_patient(subject_id):
    return analyze_patient_data(subject_id)