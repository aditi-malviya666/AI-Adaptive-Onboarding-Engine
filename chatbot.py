class AIMentor:
    def __init__(self, model_name="Llama-3-8B"): # Can also swap to Mistral-7B
        """
        Initializes the AI Mentor.
        In a real deployment, this would load a local LLM (e.g., via HuggingFace or llama.cpp)
        or setup an API client.
        """
        self.model_name = model_name
        print(f"Initializing AI Mentor with model: {model_name}")
        
    def ask_question(self, question: str, context: str = "") -> str:
        """
        Mocks a response from the AI Mentor.
        """
        question_lower = question.lower()
        
        if "what is" in question_lower or "explain" in question_lower:
            return f"That's a great question! To understand it, think of it as a fundamental building block in {context}. I recommend focusing on the basics first."
        elif "help" in question_lower or "stuck" in question_lower:
            return f"Don't worry, being stuck is part of learning. Let's break down where you are having trouble in {context}. Can you specify which part is confusing?"
        elif "next steps" in question_lower:
            return "Based on your roadmap, you should focus on the current skill until you score above 80% on the quiz. Let me know when you are ready for a practice quiz."
        else:
            return "I am your AI Mentor! I can help explain concepts, provide hints, or guide your learning path. What would you like to know?"

# Singleton
_mentor = None

def get_ai_mentor():
    global _mentor
    if _mentor is None:
        _mentor = AIMentor()
    return _mentor

if __name__ == "__main__":
    mentor = get_ai_mentor()
    print(mentor.ask_question("Explain Python", "Backend Development"))
