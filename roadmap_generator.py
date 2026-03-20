import json
import networkx as nx
import os

class RoadmapGenerator:
    def __init__(self, graph_path="datasets/skill_graph.json"):
        self.skill_graph = {}
        self.G = nx.DiGraph()
        self._load_graph(graph_path)
        
    def _load_graph(self, graph_path):
        if not os.path.exists(graph_path):
            print(f"Graph path {graph_path} not found. Creating empty graph.")
            return

        try:
            with open(graph_path, "r", encoding="utf-8") as f:
                self.skill_graph = json.load(f)
                
            for skill, data in self.skill_graph.items():
                self.G.add_node(skill, **data)
                for dep in data.get("dependencies", []):
                    self.G.add_edge(dep, skill)
                    
        except Exception as e:
            print(f"Error loading skill graph: {e}")

    def _generate_llm_roadmap(self, missing_skills: list):
        """Attempts to use HuggingFace (Llama 3 / Mistral) to generate a dynamic roadmap."""
        if not missing_skills:
            return []
            
        try:
            from huggingface_hub import InferenceClient
            import os
            
            hf_token = os.environ.get("HUGGINGFACE_API_KEY")
            # Fallback to a free model inference if token provided, else fail
            if not hf_token:
                print("No HUGGINGFACE_API_KEY found. Falling back to graph-based generation.")
                return None
                
            # Mistral is open source and available on HF Hub
            client = InferenceClient("mistralai/Mistral-7B-Instruct-v0.2", token=hf_token)
            
            prompt = f"Create a step-by-step learning roadmap for the following missing skills: {', '.join(missing_skills)}. Respond strictly with a raw JSON array of objects. Each object must have 'skill' (string), 'category' (string), and 'difficulty' (number 1-5). Do not include any explanations or markdown backticks."
            
            # Use chat_completion as it is better supported by instruct models across providers
            response = client.chat_completion(
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
            )
            
            if not response or not response.choices:
                print("--- [AI ENGINE] Empty response from Hugging Face. ---")
                return None
                
            text_response = response.choices[0].message.content
            
            # Parse it
            import json
            import re
            
            # Simple cleanup for markdown backticks if the model still generated them
            clean_text = text_response.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
                
            json_match = re.search(r'\[.*\]', clean_text, re.DOTALL)
            if json_match:
                roadmap_data = json.loads(json_match.group(0))
                if not roadmap_data:
                    return None
                    
                # Add our generic formatting
                for i, step in enumerate(roadmap_data):
                    step["step"] = i + 1
                    step["status"] = "not_started"
                    step["is_core_gap"] = step.get("skill", "").lower() in [s.lower() for s in missing_skills]
                print(f"--- [AI ENGINE] Successfully generated LLM roadmap with {len(roadmap_data)} steps. ---")
                return roadmap_data
                
            print(f"--- [AI ENGINE] Failed to parse JSON out of LLM response: {text_response} ---")
            return None
            
        except ImportError:
            print("huggingface_hub not found. Falling back to graph-based generation.")
            return None
        except Exception as e:
            print(f"LLM roadmap generation failed: {e}")
            return None

    def generate_roadmap(self, missing_skills: list) -> list:
        """
        Generates an ordered learning roadmap for the missing skills using LLM or topological sorting.
        """
        # Try dynamic LLM model first
        llm_roadmap = self._generate_llm_roadmap(missing_skills)
        if llm_roadmap:
            return llm_roadmap
            
        # Fallback to local graph methodology
        subgraph_nodes = set()
        
        for skill in missing_skills:
            matched_skill = self._find_skill_in_graph(skill)
            if matched_skill:
                subgraph_nodes.add(matched_skill)
                # also add ancestors (prerequisites)
                ancestors = nx.ancestors(self.G, matched_skill)
                subgraph_nodes.update(ancestors)
            else:
                # Skill not in graph, add as isolated node
                subgraph_nodes.add(skill)
                self.G.add_node(skill, category="General", difficulty=2)
                
        # Create subgraph and topological sort
        subG = self.G.subgraph(subgraph_nodes)
        try:
            ordered_learning = list(nx.topological_sort(subG))
        except nx.NetworkXUnfeasible:
            # Cycle found, fallback to simple list
            ordered_learning = list(subgraph_nodes)
            
        # Format output
        roadmap = []
        
        # To identify core gaps vs missing prerequisites
        missing_skills_lower = [s.lower() for s in missing_skills]
        
        for i, skill in enumerate(ordered_learning):
            node_data = self.G.nodes.get(skill, {})
            is_core_gap = skill.lower() in missing_skills_lower
            
            roadmap.append({
                "step": i + 1,
                "skill": skill,
                "category": node_data.get("category", "General"),
                "difficulty": node_data.get("difficulty", 2),
                "is_core_gap": is_core_gap,  # True if from JD, False if PREREQ
                "status": "not_started"
            })
            
        return roadmap
        
    def _find_skill_in_graph(self, target: str):
        target_lower = target.lower()
        for skill in self.G.nodes:
            if skill.lower() == target_lower:
                return skill
        return None

# Singleton accessor
_roadmap_gen = None

def get_roadmap_generator(graph_path="datasets/skill_graph.json"):
    global _roadmap_gen
    if _roadmap_gen is None:
        _roadmap_gen = RoadmapGenerator(graph_path=graph_path)
    return _roadmap_gen

if __name__ == "__main__":
    generator = get_roadmap_generator()
    roadmap = generator.generate_roadmap(["Deep Learning", "FastAPI", "React"])
    for step in roadmap:
        print(f"Step {step['step']}: {step['skill']} (Core Gap: {step['is_core_gap']})")
