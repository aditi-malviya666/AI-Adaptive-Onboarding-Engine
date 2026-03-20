import pandas as pd
import os
import re

class SkillExtractor:
    def __init__(self, datasets_dir="datasets"):
        """Pure-Python skill extractor (no spacy dependency, Python 3.14 compatible)."""
        self.skills_list = set()
        self._load_onet_skills(datasets_dir)
        # Sort skills by length descending so longer phrases match first
        self._sorted_skills = sorted(self.skills_list, key=len, reverse=True)
        print(f"SkillExtractor initialized with {len(self.skills_list)} skills.")

    def _load_onet_skills(self, datasets_dir):
        print("Loading O*NET skills...")
        tech_skills_path = os.path.join(datasets_dir, "Technology Skills.txt")
        skills_path = os.path.join(datasets_dir, "Skills.txt")

        if os.path.exists(tech_skills_path):
            try:
                df_tech = pd.read_csv(tech_skills_path, sep='\t', on_bad_lines='skip')
                if 'Example' in df_tech.columns:
                    tech_skills = df_tech['Example'].dropna().unique()
                    self.skills_list.update([str(s).lower() for s in tech_skills])
            except Exception as e:
                print(f"Error loading {tech_skills_path}: {e}")

        if os.path.exists(skills_path):
            try:
                df_skills = pd.read_csv(skills_path, sep='\t', on_bad_lines='skip')
                if 'Element Name' in df_skills.columns:
                    soft_skills = df_skills['Element Name'].dropna().unique()
                    self.skills_list.update([str(s).lower() for s in soft_skills])
            except Exception as e:
                print(f"Error loading {skills_path}: {e}")

        # Inject core tech skills to ensure demo stability
        core_demo_skills = [
            'python', 'sql', 'java', 'c++', 'javascript', 'react',
            'node.js', 'excel', 'aws', 'docker', 'git', 'tableau',
            'pandas', 'machine learning',
        ]
        self.skills_list.update(core_demo_skills)
        print(f"Loaded {len(self.skills_list)} unique skills.")

    def extract_skills(self, text: str) -> list:
        """Extracts skills from text using case-insensitive substring matching."""
        if not text or not isinstance(text, str):
            return []

        text_lower = text.lower()
        extracted_skills = set()

        for skill in self._sorted_skills:
            # Use word-boundary aware search for skills >= 3 chars
            if len(skill) >= 3:
                pattern = r'(?<![a-z])' + re.escape(skill) + r'(?![a-z])'
                if re.search(pattern, text_lower):
                    extracted_skills.add(skill)
            else:
                # Short skills (e.g. "c++", "go") — exact boundary match
                pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'
                if re.search(pattern, text_lower):
                    extracted_skills.add(skill)

        return list(extracted_skills)

# Singleton instance for easy import
_extractor = None

def get_skill_extractor(datasets_dir="datasets"):
    global _extractor
    if _extractor is None:
        _extractor = SkillExtractor(datasets_dir=datasets_dir)
    return _extractor

if __name__ == "__main__":
    extractor = get_skill_extractor("datasets")
    sample_text = "I am a software engineer with 5 years of experience in Python, Java, and Machine Learning. I use Adobe Acrobat."
    skills = extractor.extract_skills(sample_text)
    print("Extracted skills:", skills)
