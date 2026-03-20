from quiz_evaluator import evaluate_score
from skill_updater import update_skill_confidence

class AdaptiveEngine:
    def evaluate_quiz_score(self, current_roadmap: list, skill_name: str, score: int, is_present: bool=False, tier: str="easy") -> dict:
        updated_roadmap = []
        target_step_idx = -1
        
        for i, step in enumerate(current_roadmap):
            if step["skill"].lower() == skill_name.lower():
                target_step_idx = i
                break
                
        if target_step_idx == -1:
            for step in current_roadmap:
                 updated_roadmap.append(dict(step))
            # Skill was tested from the Present list, so append it dynamically 
            target_step = {
                 "step": len(updated_roadmap) + 1,
                 "skill": skill_name,
                 "category": "Verification",
                 "status": "not_started",
                 "is_core_gap": False
            }
            updated_roadmap.append(target_step)
            target_step_idx = len(updated_roadmap) - 1
        else:
            for step in current_roadmap:
                 updated_roadmap.append(dict(step))
            
        target_step = updated_roadmap[target_step_idx]
        
        # 1. Evaluate Score (Modular)
        level = evaluate_score(score)
        
        # 2. Update Confidence and Generate Reasoning Trace (Modular)
        status, reasoning = update_skill_confidence(skill_name, level, is_present, score)
        
        # 3. Apply Update
        target_step["status"] = status
        
        return {
            "roadmap": updated_roadmap,
            "reasoning": reasoning
        }

# Singleton accessor
_engine = None

def get_adaptive_engine():
    global _engine
    if _engine is None:
        _engine = AdaptiveEngine()
    return _engine

if __name__ == "__main__":
    engine = get_adaptive_engine()
    roadmap = [{"step": 1, "skill": "Python", "status": "not_started"}]
    result = engine.evaluate_quiz_score(roadmap, "Python", 45)
    print(result["action"], ":", result["reasoning"])

# Cache bust - updated parameter signature to evaluate_quiz_score(self, roadmap, skill, score, is_present, tier)
