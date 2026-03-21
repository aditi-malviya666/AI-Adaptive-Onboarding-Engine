import random

QUESTIONS_BANK = {
    "sql": {
        "easy": [
            {"q": "What does SQL stand for?", "options": ["Structured Query Language", "Simple Query Logic", "System Query Link"], "answer": 0},
            {"q": "Which clause is used to filter records?", "options": ["WHERE", "FILTER", "SORT"], "answer": 0},
            {"q": "What does SELECT * do?", "options": ["Selects all columns", "Selects all tables", "Deletes data"], "answer": 0},
            {"q": "How do you add a new row of data?", "options": ["INSERT INTO", "ADD ROW", "APPEND DATA"], "answer": 0},
            {"q": "Which SQL statement deletes data?", "options": ["DELETE", "REMOVE", "DROP"], "answer": 0}
        ],
        "medium": [
            {"q": "What is an INNER JOIN?", "options": ["Returns records with matching values in both tables", "Returns all records", "Deletes matching records"], "answer": 0},
            {"q": "What is the difference between HAVING and WHERE?", "options": ["HAVING is for aggregate functions", "They are identical", "WHERE is only for numbers"], "answer": 0},
            {"q": "What does GROUP BY do?", "options": ["Aggregates data by specific columns", "Sorts data", "Joins tables"], "answer": 0},
            {"q": "What is a Primary Key?", "options": ["A unique identifier for a row", "A password", "A foreign table reference"], "answer": 0},
            {"q": "What does the LIKE operator do?", "options": ["Searches for a specified pattern in a column", "Compares integers", "Links two tables"], "answer": 0}
        ],
        "hard": [
            {"q": "What is a window function?", "options": ["Performs calculation across a set of table rows", "Opens a new window", "Creates a view"], "answer": 0},
            {"q": "What is a clustered index?", "options": ["Determines the physical order of data", "An external table", "A non-unique key"], "answer": 0},
            {"q": "Explain a CTE.", "options": ["Common Table Expression", "Central Tracking Engine", "Column Type Evaluator"], "answer": 0},
            {"q": "What is database normalization?", "options": ["Organizing data to reduce redundancy", "Making all data uppercase", "Deleting old rows"], "answer": 0},
            {"q": "What does ACID properties stand for in DB ops?", "options": ["Atomicity, Consistency, Isolation, Durability", "Active, Core, Internal, Dynamic", "Always Consistent Incoming Data"], "answer": 0}
        ]
    },
    "python": {
        "easy": [
            {"q": "What is a list in Python?", "options": ["A mutable array", "A database", "A function"], "answer": 0},
            {"q": "How do you define a function?", "options": ["def func():", "function func():", "func() =>"], "answer": 0},
            {"q": "What is a dictionary?", "options": ["Key-value lookup", "A list of strings", "A tuple"], "answer": 0},
            {"q": "How do you print a string?", "options": ["print('hello')", "echo 'hello'", "log('hello')"], "answer": 0},
            {"q": "Which data type is immutable?", "options": ["Tuple", "List", "Dictionary"], "answer": 0}
        ],
        "medium": [
            {"q": "What is a list comprehension?", "options": ["Concise syntax for creating lists", "A built-in module", "A database query"], "answer": 0},
            {"q": "What does the 'yield' keyword do?", "options": ["Creates a generator", "Exits the program", "Throws an error"], "answer": 0},
            {"q": "What is a decorator?", "options": ["A function that modifies another function", "Visual UI element", "A class"], "answer": 0},
            {"q": "How do you catch an exception?", "options": ["try...except", "catch...error", "if...fail"], "answer": 0},
            {"q": "What is the difference between shallow and deep copy?", "options": ["Deep copy clones nested objects", "Shallow copy is slower", "There is no difference"], "answer": 0}
        ],
        "hard": [
            {"q": "Explain the Global Interpreter Lock (GIL).", "options": ["Prevents multiple threads from executing Python bytecodes at once", "A security feature", "Memory manager"], "answer": 0},
            {"q": "What are metaclasses?", "options": ["Classes of a class", "Functions inside classes", "Static typing"], "answer": 0},
            {"q": "What is monkey patching?", "options": ["Modifying behavior at runtime", "Fixing bugs with a script", "A testing framework"], "answer": 0},
            {"q": "What is Python's __init__ method?", "options": ["A constructor for a class instance", "A global startup function", "A destructive method"], "answer": 0},
            {"q": "How does asyncio differ from threading?", "options": ["It uses a single-threaded event loop", "It creates multiple OS threads", "It only runs on GPU"], "answer": 0}
        ]
    }
}

def generate_adaptive_quiz(skill_name: str, is_present: bool, previous_score: int = None, previous_tier: str = None):
    skill = skill_name.lower().strip()
    bank = QUESTIONS_BANK.get(skill)
    
    if not bank:
        # Fallback dictionary of size 5 per tier so it can randomize properly
        bank = {
            "easy": [
                {"q": f"What is {skill_name} used for at a basic level?", "options": ["Basic Dev", "Nothing", "Hard tasks"], "answer": 0},
                {"q": f"Which of the following best describes {skill_name}?", "options": ["A tool/framework", "A hardware component", "A type of food"], "answer": 0},
                {"q": f"If you are a beginner in {skill_name}, what do you learn first?", "options": ["Syntax & Basics", "Advanced Architecture", "Nothing"], "answer": 0},
                {"q": f"What industry primarily uses {skill_name}?", "options": ["Tech & Software", "Agriculture", "Textiles"], "answer": 0},
                {"q": f"Is {skill_name} considered an important modern skill?", "options": ["Yes, very much", "No, obsolete", "Only in the 1990s"], "answer": 0}
            ],
            "medium": [
                {"q": f"How do you implement common {skill_name} patterns?", "options": ["Standard Design Patterns", "Chaos", "Random logic"], "answer": 0},
                {"q": f"Which process is most often paired with {skill_name} development?", "options": ["Version Control & CI/CD", "Cooking", "Driving"], "answer": 0},
                {"q": f"What is a standard best practice in {skill_name}?", "options": ["Code Modularity", "Deleting everything", "Never testing"], "answer": 0},
                {"q": f"How do you typically debug {skill_name} issues?", "options": ["Using logs and debuggers", "Guessing randomly", "Reinstalling Windows"], "answer": 0},
                {"q": f"What architecture relies heavily on {skill_name}?", "options": ["Scalable Systems", "Desktop only", "Paper-based systems"], "answer": 0}
            ],
            "hard": [
                {"q": f"What is a complex edge case in {skill_name} resource management?", "options": ["Memory Leaks & Cleanup", "Disk Space", "Screen Size"], "answer": 0},
                {"q": f"How do you scale {skill_name} for millions of users?", "options": ["Load balancing & Distributed instances", "Running on a laptop", "Printing the source code"], "answer": 0},
                {"q": f"What is a major security vulnerability vector in {skill_name}?", "options": ["Injection & Auth bypass", "Broken CSS", "Typos in comments"], "answer": 0},
                {"q": f"How does {skill_name} handle asynchronous high-throughput traffic?", "options": ["Event loops or multi-threading", "Waiting in line", "Crashing immediately"], "answer": 0},
                {"q": f"What is the ultimate bottleneck when using {skill_name} at massive scale?", "options": ["I/O and Database locks", "The keyboard", "Monitor refresh rate"], "answer": 0}
            ]
        }
        
    tier = "easy"
    
    # Apply Sequential AI-Adaptive Progression
    if previous_score is not None and previous_tier is not None:
        if previous_score >= 80:
            if previous_tier == "easy": tier = "medium"
            elif previous_tier == "medium": tier = "hard"
            else: tier = "hard"
        elif previous_score >= 60:
            tier = previous_tier # Stay at same level to practice
        else:
            # Fall back to easier level
            if previous_tier == "hard": tier = "medium"
            else: tier = "easy"
    else:
        # First time
        if is_present:
            tier = random.choice(["medium", "hard"])
        else:
            tier = "easy"
            
    pool = bank[tier]
    questions = random.sample(pool, min(5, len(pool)))
    
    # Shuffle options internally so answer isn't always 0
    formatted_questions = []
    for q in questions:
        opts = list(q["options"])
        correct_string = opts[q["answer"]]
        random.shuffle(opts)
        formatted_questions.append({
            "q": q["q"],
            "options": opts,
            "answer": opts.index(correct_string),
            "tier_selected": tier
        })
        
    return formatted_questions
