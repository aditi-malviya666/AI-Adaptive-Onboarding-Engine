# 🚀 AI-Adaptive Onboarding Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)

> An AI-driven, adaptive learning engine that parses a new hire's current skills (via Resume or diagnostic) and dynamically generates a personalized training pathway to reach role-specific competency.

---

## 📌 Problem Statement

Current corporate onboarding often uses static, "one-size-fits-all" curricula — experienced hires waste time on content they already know, while beginners get overwhelmed. This engine solves that by:
- Parsing skills from a **Resume** or **Job Description**
- Identifying the specific **skill gaps**
- Generating a **personalized, prerequisite-aware learning roadmap**
- Adapting the roadmap in real-time based on **quiz performance**

---

## ✅ Minimum Required Features

| Feature | Description |
|---|---|
| **Intelligent Parsing** | Extracts skills and experience levels from Resume and Job Description using O\*NET + NLP |
| **Dynamic Mapping** | Generates a personalized learning pathway that addresses identified skill gaps |
| **Functional Interface** | Web-based UI for uploading Resume/JD and visualizing the custom training roadmap |

---

## 🗂️ Project Structure

```
AI-Adaptive-Onboarding-Engine/
├── .env                    # Environment variables (HuggingFace API Key)
├── README.md
├── Dockerfile              # Docker configuration
├── requirements.txt        # Python dependencies
├── main.py                 # FastAPI application entry point
├── parser.py               # Resume & PDF text extraction
├── skill_extractor.py      # Skill extraction via O*NET + regex NLP
├── gap_analysis.py         # Semantic skill gap analysis (BERT / TF-IDF)
├── roadmap_generator.py    # Personalized learning path generator (DAG + LLM)
├── adaptive_engine.py      # Quiz scoring & roadmap status updater
├── chatbot.py              # AI Mentor chatbot (Llama-3-8B)
├── quiz_generator.py       # Adaptive difficulty quiz generation
├── frontend/               # Web UI (HTML, CSS, JS)
│   ├── index.html
│   ├── script.js
│   └── styles.css
└── datasets/               # O*NET skill graphs and knowledge base
```

---

## 🛠️ Tech Stack & Models

### Backend
- **FastAPI** — Async Python REST API framework
- **Uvicorn** — ASGI server for high-performance serving

### Machine Learning & NLP
- **Sentence-Transformers (`all-MiniLM-L6-v2`)** — Semantic skill similarity via BERT embeddings
- **Scikit-learn (TF-IDF)** — Fallback vectorizer for low-resource environments
- **Mistral-7B-Instruct / Llama-3-8B** — Via HuggingFace Inference API for LLM-based roadmap generation
- **NetworkX** — Directed Acyclic Graph (DAG) for skill prerequisite modeling

### Frontend
- Vanilla HTML / CSS / JavaScript — Glassmorphic, responsive single-page UI

---

## 🧠 Algorithms & Adaptive Logic

### 1. Semantic Skill Extraction
Skills are matched from the O\*NET Technology Skills and Skills datasets (8800+ skills) using **word-boundary-aware regex + substring matching**. Longer multi-word phrases are matched first to avoid partial collisions.

### 2. Semantic Gap Analysis
Rather than simple string equality, the **GapAnalyzer** uses **Cosine Similarity** on BERT embeddings (`all-MiniLM-L6-v2`) to identify semantically equivalent skills. For example, "Deep Learning" is recognized as a partial fulfillment for "Machine Learning". A configurable **threshold (default 0.75)** controls what is considered "fulfilled".

### 3. Adaptive Pathing (DAG + Topological Sort)
Missing skills are mapped onto a **Directed Acyclic Graph (DAG)** where edges represent prerequisite relationships (e.g., Python → Data Science). The roadmap is generated via **Topological Sort**, ensuring learners always encounter foundational concepts before advanced ones.

### 4. LLM-Augmented Roadmap (Mistral/Llama)
For novel or unrecognized skill gaps, the engine calls the **Mistral-7B-Instruct** model via HuggingFace to dynamically generate a structured learning path, returning a ranked JSON of steps with difficulty ratings.

### 5. Adaptive Feedback Loop (Reasoning Trace)
After each quiz, the `AdaptiveEngine` evaluates the score, updates the skill's **confidence level**, sets the roadmap step status (`completed`, `in_progress`, `needs_prerequisite`), and generates a human-readable **Reasoning Trace** explaining the AI's decision.

---

## 📊 Datasets

| Dataset | Source | Usage |
|---|---|---|
| O\*NET Technology Skills | [onetcenter.org](https://www.onetcenter.org/db_releases.html) | Skill taxonomy (8800+ skills) |
| O\*NET Skills | [onetcenter.org](https://www.onetcenter.org/db_releases.html) | Soft skills & competencies |
| Resume Dataset | [Kaggle](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset/data) | Resume parsing validation |
| Jobs & Job Descriptions | [Kaggle](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description) | JD skill extraction testing |

> ⚠️ All datasets and open-source models are publicly available and cited in compliance with the Data & Model Compliance policy.

---

## 📐 Architecture Diagram

```
Resume (PDF/Text)         Job Description
       │                        │
       └───────────┬────────────┘
                   ▼
        [ parser.py — PyPDF2 ]
                   │
                   ▼
    [ skill_extractor.py — O*NET NLP ]
                   │
         Extracted Skill Profiles
                   │
                   ▼
     [ gap_analysis.py — BERT Cosine Sim ]
                   │
         Identified Skill Gaps (Missing)
                   │
                   ▼
    [ roadmap_generator.py — DAG + LLM ]
                   │
       Personalized Learning Roadmap
                   │
                   ▼
       [ adaptive_engine.py — Quiz + Feedback ]
                   │
         Updated Roadmap + Reasoning Trace
                   │
                   ▼
            [ Web UI — frontend/ ]
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.9+
- pip
- HuggingFace API Key (for LLM-powered roadmap generation)
- Docker (optional)

### 1. Clone & Install
```bash
git clone https://github.com/vishalsnghkush/AI-Adaptive-Onboarding-Engine.git
cd AI-Adaptive-Onboarding-Engine
pip install -r requirements.txt
```

### 2. Configure API Keys
Create a `.env` file in the root:
```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

### 3. Run the Server
```bash
python main.py
# OR
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Open the UI at: **`http://localhost:8000/static/index.html`**

### Docker (Optional)
```bash
docker build -t ai-onboarding-engine .
docker run -p 8000:8000 ai-onboarding-engine
```

---

## 🏆 Evaluation Criteria

| Criterion | Weight | How We Address It |
|---|---|---|
| Technical Sophistication | 20% | BERT embeddings + DAG-based adaptive pathing + LLM integration |
| Grounding & Reliability | 15% | O\*NET-grounded skill extraction; TF-IDF fallback prevents hallucinations |
| Reasoning Trace | 10% | Per-quiz reasoning trace explaining the AI's adaptive decision |
| Product Impact | 10% | Match Score shows redundant training saved; roadmap focuses only on true gaps |
| User Experience | 15% | Premium glassmorphic web UI with interactive skill chips, live roadmap, and AI chatbot |
| Cross-Domain Scalability | 10% | O\*NET covers 8800+ skills across all job categories |
| Communication & Documentation | 20% | This README, Dockerfile, and source code comments |

---

## 📚 References

- [O\*NET Content Model & Database](https://www.onetcenter.org/db_releases.html)
- [Resume Dataset — Kaggle (snehaanbhawal)](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset/data)
- [Jobs and Job Description — Kaggle (kshitizregmi)](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description)
- [Sentence Transformers — `all-MiniLM-L6-v2`](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [Mistral-7B-Instruct-v0.2](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)
- [Llama-3-8B (Meta)](https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct)

---

## 👥 Team

| Name |
|---|
| Aditi Malviya |
| Vishal Kushwaha |
