# 🚀 AI-Adaptive Onboarding Engine

> A hackathon project that builds an AI-driven, adaptive learning engine that parses a new hire's current capabilities (via resume or diagnostic) and dynamically maps an optimized, personalized training pathway to reach role-specific competency.

---

## 📌 Problem Statement

Current corporate onboarding often utilizes static, "one-size-fits-all" curricula, resulting in significant inefficiencies. Experienced hires waste time on known concepts, while beginners may be overwhelmed by advanced modules.

**The Challenge:** Build an AI-driven, adaptive learning engine that:
- Parses a new hire's current capabilities from a **Resume** or **diagnostic assessment**
- Dynamically maps an optimized, **personalized learning pathway**
- Addresses the specific **"skill gap"** identified for role-specific competency

---

## ✅ Minimum Required Features

To be eligible for judging, the solution must demonstrate:

| Feature | Description |
|---|---|
| **Intelligent Parsing** | Extraction of skills and experience levels from a Resume and a target Job Description |
| **Dynamic Mapping** | Generation of a personalized learning pathway that addresses the specific "skill gap" identified |
| **Functional Interface** | A minimal web-based UI allowing users to upload documents (Resume/JD) and visualize their custom training roadmap |

---

## 🗂️ Project Structure

```
AI-Adaptive-Onboarding-Engine/
├── .env                    # Environment variables (HuggingFace API Key)
├── README.md
├── Dockerfile              # Docker configuration
├── requirements.txt        # Python dependencies
├── main.py                 # FastAPI application entry point
├── parser.py               # Resume text extraction logic
├── skill_extractor.py      # Skill extraction using NLP
├── gap_analysis.py         # Skill gap & analysis mapping
├── roadmap_generator.py    # Generates custom learning paths
├── adaptive_engine.py      # Dynamic quizzing & assessment logic
├── chatbot.py              # AI Mentor chatbot
├── frontend/               # Web UI components (HTML, CSS, JS)
│   ├── index.html
│   ├── script.js
│   └── styles.css
└── datasets/               # Datasets and knowledge graphs
```

---

## 🛠️ Tech Stack & Models

- **LLMs / Embeddings:** (e.g., Llama 3, BERT, Mistral) — *must be cited in documentation*
- **Frameworks:** (e.g., LangChain, FastAPI, Streamlit, Flask)
- **Datasets:**
  - [Resume Dataset – Kaggle](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset/data)
  - [Job Descriptions – OneNetCenter](https://www.onetcenter.org/db_releases.html)
  - [Job & Description Dataset – Kaggle](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description)

> ⚠️ All datasets and open-source models **must be explicitly cited** in documentation.

---

## ⚙️ Setup & Installation

### Prerequisites

- Python 3.9+
- pip / conda
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/aditi-malviya666/AI-Adaptive-Onboarding-Engine.git
cd AI-Adaptive-Onboarding-Engine

# Install dependencies
pip install -r requirements.txt
```

### Environment Setup

Create a `.env` file in the root directory and add the following:

```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

### Running the Application

Start the backend server and frontend view:

```bash
# Standard spin-up
python main.py

# Alternatively, run via Uvicorn explicitly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server runs on `http://localhost:8000`. Access the interactive Web UI at `http://localhost:8000/static/index.html`.

Or with Docker:

```bash
docker build -t ai-onboarding-engine .
docker run -p 8080:8080 ai-onboarding-engine
```

---

## 🧠 How It Works

1. **Input:** User uploads their **Resume** (PDF/text) and a **Job Description**
2. **Parsing:** NLP engine extracts skills, experience levels, and competencies
3. **Skill Gap Analysis:** Compares candidate profile against role requirements using an Adaptive Pathing algorithm (Graph-based or Knowledge Tracing)
4. **Learning Pathway:** Generates a personalized, ordered training roadmap to bridge identified gaps
5. **UI Visualization:** Displays the roadmap on an interactive web interface

---

## 📊 Data & Model Compliance

- **Transparency:** Only publicly available datasets are used (e.g., O\*NET, LinkedIn Skills, Kaggle)
- **Originality:** While pre-trained models are encouraged, the **"Adaptive Logic"** (how the system decides what to teach next) is an original implementation
- All models and datasets are cited below in the [References](#references) section
rw
---

## 📐 Architecture & Workflow

```
Resume (PDF/Text)      Job Description
       │                      │
       └──────────┬───────────┘
                  ▼
         [ NLP Parser / LLM ]
                  │
        Extracted Skills Profile
                  │
                  ▼
        [ Skill Gap Analyzer ]
        (Graph / Knowledge Tracing)
                  │
         Identified Skill Gaps
                  │
                  ▼
       [ Pathway Generator ]
                  │
     Personalized Learning Roadmap
                  │
                  ▼
          [ Web UI Display ]
```

---

## 🏆 Evaluation Criteria

| Criterion | Weight | Description |
|---|---|---|
| Technical Sophistication | 20% | Accuracy of skill-extraction engine and logic/complexity of adaptive recommendation model |
| Grounding & Reliability | 15% | Zero hallucinations; strict adherence to provided course catalog |
| Reasoning Trace | 10% | Provide a reasoning trace feature |
| Product Impact | 10% | Demonstrated effectiveness in reducing redundant training time and enabling role-specific competency |
| User Experience | 15% | Clarity of the generated learning pathway and functional usability of the web interface |
| Cross-Domain Scalability | 10% | Ability to generalize across diverse job categories (e.g., Technical/Desk vs. Operational/Labor roles) |
| Communication & Documentation | 20% | Quality of GitHub Readme, Demo Video, and 5-Slide Presentation |

---

## 📦 Submission Requirements

### A. Public GitHub Repository
- ✅ Fully documented and reproducible source code
- ✅ This `README.md` with setup instructions, dependencies, and high-level overview
- ⬜ `Dockerfile` for environment reproducibility *(optional but encouraged)*

### B. Video Demonstration
- **Duration:** 2–3 minutes
- **Content:** End-to-end user journey showcasing the UI and how the pathway adapts to different inputs

### C. Technical Presentation (The "5-Slide Deck")

Your presentation must be strictly limited to **5 slides** using the following structure:

1. **Solution Overview:** Value proposition and the specific problem-solving approach.
2. **Architecture & Workflow:** System design, data flow, and UI/UX logic.
3. **Tech Stack & Models:** Detailed list of LLMs, embedding models, and frameworks used.
4. **Algorithms & Training:** Deep dive into the skill-extraction logic and the "Adaptive Pathing" algorithm (e.g., Graph-based or Knowledge Tracing).
5. **Datasets & Metrics:** Disclosure of all public datasets used and the internal metrics used to validate the engine's efficiency.
    - Datasets you may find useful:
        - [Resume Dataset](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset/data)
        - [O*NET Database Releases](https://www.onetcenter.org/db_releases.html)
        - [Jobs and Job Description](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description)

---

## 📚 References

- [O\*NET Database Releases](https://www.onetcenter.org/db_releases.html)
- [Resume Dataset – Kaggle](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset/data)
- [Jobs and Job Description Dataset – Kaggle](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description)
- Pre-trained models: *(list all models used, e.g., Llama 3, BERT, Mistral)*

---

## 👥 Team

| Name | Role |
|---|---|
| *Aditi Malviya & Vishal Kushwaha* |

---

> *Note: Exceptional technical solutions must be matched by clear communication; a high-quality presentation and well-documented repository are essential for a winning submission.*
