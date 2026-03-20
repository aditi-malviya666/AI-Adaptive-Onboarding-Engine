import os
from PyPDF2 import PdfReader
import pandas as pd

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extracts text from a given PDF file path."""
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at {pdf_path}")
    
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
    return text

def parse_txt(file_path: str) -> str:
    """Extracts text from a plain TXT file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"TXT file not found at {file_path}")
    
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def get_job_description_by_title(title: str, dataset_path: str = "datasets/job_title_des.csv") -> str:
    """Retrieves a job description from the dataset given a job title."""
    try:
        df = pd.read_csv(dataset_path)
        # Search for case-insensitive match
        match = df[df['Job Title'].str.contains(title, case=False, na=False)]
        if not match.empty:
            return match.iloc[0]['Job Description']
        return ""
    except Exception as e:
        print(f"Error reading JD dataset: {e}")
        return ""

def get_resume_by_category(category: str, dataset_path: str = "datasets/Resume.csv") -> str:
    """Retrieves a sample resume string from the dataset given a category."""
    try:
        df = pd.read_csv(dataset_path)
        match = df[df['Category'].str.contains(category, case=False, na=False)]
        if not match.empty:
            return match.iloc[0]['Resume_str']
        return ""
    except Exception as e:
        print(f"Error reading Resume dataset: {e}")
        return ""

if __name__ == "__main__":
    # Test parser
    sample_jd = get_job_description_by_title("Flutter Developer", "../datasets/job_title_des.csv")
    print("Sample JD length:", len(sample_jd))
