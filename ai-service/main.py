from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os

load_dotenv()

app = FastAPI(title="HireIQ AI Service")

# allow the frontend and Java backend to make requests to this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# initialize Groq client using the key from .env
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class CVAnalysisRequest(BaseModel):
    cv_text: str
    job_description: str

class InterviewPrepRequest(BaseModel):
    job_description: str
    cv_text: str

@app.get("/")
def root():
    return {"message": "HireIQ AI Service running"}

# Railway pings this endpoint to check if the service is alive
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze-cv")
def analyze_cv(request: CVAnalysisRequest):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a technical recruiter. Always respond with valid JSON only, no extra text."
                },
                {
                    "role": "user",
                    "content": f"""You are a technical recruiter and ATS specialist reviewing a candidate's CV against a job description.


CV:
{request.cv_text}

Job Description:
{request.job_description}

Many companies use ATS software to filter CVs automatically before a human sees them. ATS systems scan for keywords and phrases from the job description. A CV that does not contain the right keywords will be rejected even if the candidate is qualified.

Provide a JSON response with exactly this structure:
{{
    "match_score": <number between 0 and 100 based on how well the CV would pass ATS filtering>,
    "ats_keywords_found": [<list of 3 important keywords from the job description that appear in the CV>],
    "ats_keywords_missing": [<list of 3 important keywords from the job description that are missing from the CV>],
    "strengths": [<list of 3 things the candidate does well>],
    "gaps": [<list of 3 skills or experiences the candidate is missing>],
    "summary": "<2 sentence honest assessment including ATS compatibility>"
}}"""
                }
            ]
        )

        return {"result": response.choices[0].message.content}

    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/interview-prep")
def interview_prep(request: InterviewPrepRequest):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a senior technical interviewer. Always respond with valid JSON only, no extra text."
                },
                {
                    "role": "user",
                    "content": f"""Generate interview questions for this candidate based on the job description.

CV:
{request.cv_text}

Job Description:
{request.job_description}

Respond with exactly this JSON structure:
{{
    "technical_questions": [
        {{
            "question": "<question>",
            "model_answer": "<what a good answer looks like>"
        }}
    ],
    "behavioural_questions": [
        {{
            "question": "<question>",
            "model_answer": "<what a good answer looks like>"
        }}
    ],
    "questions_to_ask_interviewer": [<3 smart questions the candidate should ask>]
}}

Generate 3 technical and 3 behavioural questions."""
                }
            ]
        )

        return {"result": response.choices[0].message.content}

    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))