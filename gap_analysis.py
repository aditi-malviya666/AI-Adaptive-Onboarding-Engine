from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class GapAnalyzer:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        """BERT/SentenceTransformers for skill similarity. Model is lazy-loaded on first use."""
        self.model_name = model_name
        self.encoder = None         # Lazy-loaded on first use
        self.use_transformer = False
        self.vectorizer = TfidfVectorizer(token_pattern=r"(?u)\S+", lowercase=True)  # Always available as fallback
        print(f"GapAnalyzer ready (BERT model '{model_name}' will load on first use).")

    def _get_encoder(self):
        """Lazy-loads the sentence transformer model only when first needed."""
        if self.encoder is None and self.model_name.lower() != "tfidf":
            try:
                # Use a lightweight model or allow timeout if possible
                from sentence_transformers import SentenceTransformer
                print(f"--- [AI ENGINE] Loading BERT model '{self.model_name}' (approx 420MB)... ---")
                print("--- Note: This may take 1-2 minutes on first run depending on internet speed. ---")
                self.encoder = SentenceTransformer(self.model_name)
                self.use_transformer = True
                print("--- [AI ENGINE] BERT model loaded successfully. ---")
            except Exception as e:
                print(f"--- [AI ENGINE] BERT model failed/timed out: {e}. Falling back to TF-IDF. ---")
                self.encoder = None
                self.use_transformer = False
        return self.encoder

    def _cosine_sim(self, texts: list) -> np.ndarray:
        """Returns the cosine similarity matrix."""
        encoder = self._get_encoder()
        if self.use_transformer and encoder is not None:
            embeddings = encoder.encode(texts)
            return cosine_similarity(embeddings)
        else:
            try:
                tfidf_matrix = self.vectorizer.fit_transform(texts)
                return cosine_similarity(tfidf_matrix)
            except ValueError:
                # e.g., "empty vocabulary" if texts only contain stopwords or ignored characters
                return np.zeros((len(texts), len(texts)))

    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculates cosine similarity between two texts (e.g. JD and Resume)."""
        if not text1 or not text2:
            return 0.0
        sim_matrix = self._cosine_sim([text1, text2])
        return float(sim_matrix[0][1])

    def get_skill_gaps(self, required_skills: list, user_skills: list, threshold: float = 0.75) -> dict:
        """
        Identifies missing skills using TF-IDF cosine similarity.
        If a required skill is semantically similar to a user skill above threshold,
        it is considered fulfilled (handles synonyms / related terms).
        """
        missing_skills = []
        fulfilled_skills = []

        if not required_skills:
            return {"missing": [], "fulfilled": user_skills}

        # Standardize strings
        user_skills_lower = [s.lower() for s in user_skills]

        for req_skill in required_skills:
            req_skill_lower = req_skill.lower()

            # Exact match check
            if req_skill_lower in user_skills_lower:
                fulfilled_skills.append(req_skill)
                continue

            # Semantic match check via TF-IDF cosine similarity
            if user_skills:
                all_texts = [req_skill] + user_skills
                sim_matrix = self._cosine_sim(all_texts)
                # Row 0 = req_skill vs each user skill (columns 1..N)
                similarities = sim_matrix[0][1:]
                max_score = float(np.max(similarities))
                if max_score >= threshold:
                    fulfilled_skills.append(req_skill)
                else:
                    missing_skills.append(req_skill)
            else:
                missing_skills.append(req_skill)

        return {"missing": missing_skills, "fulfilled": fulfilled_skills}

# Singleton accessor
_analyzer = None

def get_gap_analyzer(model_name="all-MiniLM-L6-v2"):
    global _analyzer
    if _analyzer is None:
        _analyzer = GapAnalyzer(model_name=model_name)
    return _analyzer

if __name__ == "__main__":
    analyzer = get_gap_analyzer()
    req = ["Machine Learning", "Python Web Frameworks", "AWS"]
    user = ["Deep Learning", "FastAPI"]
    gaps = analyzer.get_skill_gaps(req, user)
    print("Gaps:", gaps)
