def evaluate_score(score_percentage: float) -> str:
    """
    Evaluates raw score into predefined categorical confidence bands.
    score < 60% -> LOW
    60-80% -> MEDIUM
    > 85% -> HIGH
    """
    if score_percentage < 60:
        return "LOW"
    elif score_percentage <= 80:
        return "MEDIUM"
    else:
        return "HIGH"
