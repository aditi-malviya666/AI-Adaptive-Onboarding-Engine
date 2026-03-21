import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import shutil

# Import local modules
from parser import extract_text_from_pdf
from skill_extractor import get_skill_extractor
from gap_analysis import get_gap_analyzer
from roadmap_generator import get_roadmap_generator
from adaptive_engine import get_adaptive_engine
from chatbot import get_ai_mentor

app = FastAPI(title="AI-Adaptive Onboarding Engine API")

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend static files
app.mount("/static", StaticFiles(directory="frontend"), name="static")
from fastapi.responses import FileResponse

@app.get("/")
def serve_frontend():
    return FileResponse("frontend/index.html")
# Initialize engines on startup (or lazy load)
extractor = get_skill_extractor("datasets")
analyzer = get_gap_analyzer(model_name="tfidf")
roadmap_gen = get_roadmap_generator("datasets/skill_graph.json")
adaptive_engine = get_adaptive_engine()
mentor = get_ai_mentor()

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description_target: str

class QuestionRequest(BaseModel):
    question: str
    context: str = ""

class QuizResultRequest(BaseModel):
    roadmap: List[dict]
    skill_name: str
    score: int
    is_present: bool = False
    tier: str = "easy"



@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/analyze")
async def analyze_skills(
    job_description_target: str = Form(...),
    resume_text: Optional[str] = Form(None),
    resume_file: Optional[UploadFile] = File(None)
):
    jd_text = job_description_target
    final_resume_text = ""
    
    # Handle PDF Upload
    if resume_file and resume_file.filename and resume_file.filename.endswith('.pdf'):
        # Fix: Using a dot-prefix for temp file to avoid triggering uvicorn reloader
        temp_path = f".tmp_{resume_file.filename}" 
        contents = await resume_file.read()
        with open(temp_path, "wb") as buffer:
            buffer.write(contents)
        extracted = extract_text_from_pdf(temp_path)
        final_resume_text = extracted if extracted else ""
        print(f"PDF extracted text length: {len(final_resume_text)}")
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except Exception as e:
            print(f"Warning: Could not remove temp file {temp_path}: {e}")
    # Handle Text Input (Only if PDF didn't provide text or wasn't uploaded)
    if not final_resume_text and resume_text:
        final_resume_text = resume_text
    
    if not final_resume_text:
        return {"error": "Please provide either a valid PDF resume or text content."}
    
    # 1. Extract skills from Resume
    user_skills = sorted(list(set(extractor.extract_skills(final_resume_text))))
    
    # 2. Extract skills from Job Description
    req_skills = sorted(list(set(extractor.extract_skills(jd_text))))
    
    # 3. Gap Analysis
    gaps = analyzer.get_skill_gaps(req_skills, user_skills)
    # Ensure missing_skills is unique
    missing_skills = sorted(list(set(gaps["missing"])))
    
    # Overall match score (Cosine Similarity)
    match_score = analyzer.calculate_similarity(final_resume_text, jd_text)
    
    # 4. Generate Roadmap
    roadmap = roadmap_gen.generate_roadmap(missing_skills)
    
    return {
        "user_skills": user_skills,
        "required_skills": req_skills,
        "missing_skills": missing_skills,
        "fulfilled_skills": sorted(list(set(gaps["fulfilled"]))),
        "match_score": round(match_score * 100, 2),
        "roadmap": roadmap
    }

class GetQuizRequest(BaseModel):
    skill_name: str
    is_present_in_resume: bool = False
    previous_score: Optional[int] = None
    previous_tier: Optional[str] = None

from quiz_generator import generate_adaptive_quiz

@app.post("/api/get_quiz")
def get_quiz(req: GetQuizRequest):
    # Uses the predefined dictionary question bank (Adaptive System)
    questions = generate_adaptive_quiz(req.skill_name, req.is_present_in_resume, req.previous_score, req.previous_tier)
    return {"questions": questions}

@app.post("/api/ask")
def ask_mentor(req: QuestionRequest):
    response = mentor.ask_question(req.question, req.context)
    return {"reply": response}
    
@app.post("/api/evaluate_quiz")
def evaluate_quiz(req: QuizResultRequest):
    result = adaptive_engine.evaluate_quiz_score(req.roadmap, req.skill_name, req.score, req.is_present, req.tier)
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

