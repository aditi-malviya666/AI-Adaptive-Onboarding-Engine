def update_skill_confidence(skill_name: str, level: str, is_present: bool, score: int):
    """
    Updates the skill state based on confidence level and produces the mandatory reasoning trace.
    Returns (status, reasoning_trace)
    """
    if level == "LOW":
        status = "needs_prerequisite"
        reasoning = (
            f"{skill_name} is included in your roadmap because:\n"
            f"- {'It is present in your resume, but' if is_present else 'It was not found in your resume'}\n"
            f"- Your test score was {score}% (LOW proficiency)\n"
            f"- Action: Add beginner level content, repeat topic."
        )
    elif level == "MEDIUM":
        status = "in_progress"
        reasoning = (
            f"{skill_name} needs moderate review because:\n"
            f"- {'It is present in your resume' if is_present else 'It is a missing skill'}\n"
            f"- Your test score was {score}% (MEDIUM proficiency)\n"
            f"- Action: Add practice-based learning with moderate difficulty."
        )
    else: # HIGH
        status = "completed"
        reasoning = (
            f"{skill_name} is skipped because:\n"
            f"- {'It is present in your resume' if is_present else 'Even though it was not in your resume'}\n"
            f"- Your test score was {score}% (HIGH proficiency!)\n"
            f"- Action: Skip basic content, marked as completed."
        )
        
    return status, reasoning
