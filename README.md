# AI-Adaptive Onboarding Engine

## Problem Statement
Current corporate onboarding often utilizes static, "one-size-fits-all" curricula, resulting in significant inefficiencies. This project builds an AI-driven, adaptive learning engine that parses a new hire's capabilities from their resume and dynamically maps an optimized, personalized training pathway to reach role-specific competency.

## 🔥 Minimum Required Features
- **Intelligent Parsing**: Extracts skills and experience levels using spaCy NLP and O*NET dataset dictionaries.
- **Dynamic Mapping**: Generates a personalized learning pathway using **BERT** (`Sentence-Transformers` `all-MiniLM-L6-v2`) for Semantic Skill Gap Analysis and NetworkX for topological sorting of course prerequisites.
- **AI Mentorship (Open-Source Models)**: Integrated a mock Chatbot Mentor system built to harness models like **Llama 3** or **Mistral**.
- **Functional Interface**: A modern web UI with glassmorphism to upload Resumes (PDF/Text) and visualize the custom training roadmap timeline.

## 🏆 Evaluation Criteria Adherence
- **Adaptive Pathing (Graph-based)**: An original algorithm that evaluates quiz scores to dynamically adapt the roadmap. Missing skills are mapped against a directed acyclic graph (`skill_graph.json`) using `NetworkX` topological sorting.
- **Grounding and Reliability**: Our Graph-based prerequisite sorting guarantees zero hallucinations and strict adherence to the `skill_graph.json` course catalog.
- **Reasoning Trace**: The adaptive engine provides a clear reasoning trace for why a specific pathway adjustment was made, which is returned in the API and rendered in the frontend quiz modal.
- **Cross-Domain Scalability**: The system relies on the O*NET dataset, ensuring the engine can scale and generalize across any technical, desk, or operational role.

## 🛠 Setup Instructions

### 1. Local Setup
1. Clone the repository.
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment:
    - Windows: `venv\Scripts\activate`
    - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Download required spaCy model (if you face errors): `python -m spacy download en_core_web_sm`
6. Run the FastAPI server: `python main.py`
7. Open `frontend/index.html` in your web browser.

### 2. Docker Setup (Recommended for Judges)
We provide a Dockerfile for seamless execution.
1. Build the image: `docker build -t ai-onboarding-engine .`
2. Run the container: `docker run -p 8000:8000 ai-onboarding-engine`
3. Access the API at `http://localhost:8000`

## 🧠 High-Level Logic: Skill-Gap Analysis & Adaptive Pathing
1. **Extraction**: We use `spaCy`'s `PhraseMatcher` against a comprehensive list of O*NET skills to reliably extract exact skill matches from the Resume.
2. **Gap Analysis (BERT)**: `Sentence-Transformers` (`all-MiniLM-L6-v2`) computes cosine similarity embeddings between the user's skills and the required skills from the Job Description. A threshold of 0.75 is used to determine if a required skill is missing. 
3. **Graph-Based Pathing**: Missing skills are mapped against a directed acyclic graph (`skill_graph.json`) using `NetworkX`. We perform a topological sort to generate the optimal learning sequence, ensuring all foundational prerequisites are learned before advanced topics.
4. **Original Adaptive Logic**: When a user completes a module, their score is evaluated. The system uses a custom python algorithm (not a pre-trained LLM) to definitively update the graph state, preventing LLM hallucinations and ensuring strict adherence to the training catalog.
