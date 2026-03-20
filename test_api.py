import requests

try:
    url = "http://127.0.0.1:8000/api/analyze"
    data = {"job_description_target": "Machine Learning, Python, FastAPI, AWS", "resume_text": "I know Python and Deep Learning."}
    response = requests.post(url, data=data)
    print("STATUS:", response.status_code)
    print("RESPONSE:", response.json())
except Exception as e:
    print(f"Error calling API: {e}")
