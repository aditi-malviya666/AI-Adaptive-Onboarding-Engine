const API_BASE = "/api";
let currentRoadmap = [];
let globalUserSkills = [];
let skillScores = {}; // dictionary mapping skill -> score

// ─────────────────────────────────────────────────────────────────
// Skill Roadmap Data — dynamically matched per skill
// ─────────────────────────────────────────────────────────────────
const SKILL_ROADMAPS = {
    sql: {
        icon: "🗄️",
        subtitle: "Master databases from scratch to advanced querying",
        phases: [
            { title: "Foundations", desc: "Understand what SQL is, how relational databases work, and basic CRUD operations.", topics: ["SELECT", "INSERT", "UPDATE", "DELETE", "WHERE", "ORDER BY"] },
            { title: "Joins & Relationships", desc: "Query multiple related tables using different types of joins.", topics: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "Self JOIN"] },
            { title: "Aggregation & Grouping", desc: "Summarise and group data for analytical insights.", topics: ["GROUP BY", "HAVING", "COUNT / SUM / AVG / MIN / MAX", "DISTINCT"] },
            { title: "Subqueries & CTEs", desc: "Write complex, nested queries and clean reusable query blocks.", topics: ["Subqueries", "Correlated Subqueries", "WITH (CTE)", "EXISTS / NOT EXISTS"] },
            { title: "Optimization & Advanced", desc: "Write performant SQL and use advanced database features.", topics: ["Indexes", "Execution Plans", "Stored Procedures", "Triggers", "Window Functions"] }
        ]
    },
    python: {
        icon: "🐍",
        subtitle: "Go from beginner to professional Python developer",
        phases: [
            { title: "Python Basics", desc: "Core syntax, data types, and control flow.", topics: ["Variables", "Data Types", "if/else", "Loops", "Functions", "Lists & Dicts"] },
            { title: "OOP & Modules", desc: "Object-oriented programming and Python standard library.", topics: ["Classes", "Inheritance", "Decorators", "Modules", "File I/O"] },
            { title: "Data Manipulation", desc: "Work with data using pandas and numpy.", topics: ["NumPy arrays", "Pandas DataFrames", "Cleaning Data", "Groupby", "Merging"] },
            { title: "APIs & Automation", desc: "Connect to external services and automate workflows.", topics: ["requests", "REST APIs", "JSON", "Web Scraping (BeautifulSoup)", "Regex"] },
            { title: "Advanced & ML", desc: "Machine learning pipelines and production code.", topics: ["Scikit-learn", "Matplotlib / Seaborn", "Virtual Envs", "Type Hints", "Testing (pytest)"] }
        ]
    },
    excel: {
        icon: "📊",
        subtitle: "Become an Excel power user for data analysis",
        phases: [
            { title: "Core Interface", desc: "Navigate and format spreadsheets efficiently.", topics: ["Cells & Ranges", "Formatting", "Sorting & Filtering", "Named Ranges"] },
            { title: "Essential Formulas", desc: "Master the formulas every professional must know.", topics: ["SUM / IF / COUNTIF", "VLOOKUP / HLOOKUP", "INDEX / MATCH", "TEXT functions"] },
            { title: "Data Analysis", desc: "Analyse and summarise large datasets.", topics: ["PivotTables", "PivotCharts", "Conditional Formatting", "Data Validation"] },
            { title: "Automation", desc: "Automate repetitive work with macros.", topics: ["Recording Macros", "VBA Basics", "Power Query", "Get & Transform Data"] },
            { title: "Advanced Analytics", desc: "Statistical and business analytics tools.", topics: ["Solver", "Goal Seek", "Scenario Manager", "Statistical Functions", "Dashboards"] }
        ]
    },
    tableau: {
        icon: "📈",
        subtitle: "Build stunning data visualisations and dashboards",
        phases: [
            { title: "Tableau Fundamentals", desc: "Connect to data and understand the Tableau interface.", topics: ["Data Source Types", "Dimensions vs Measures", "Drag-and-Drop", "Marks"] },
            { title: "Core Chart Types", desc: "Build the most common and effective chart types.", topics: ["Bar Charts", "Line Charts", "Scatter Plots", "Maps", "Treemaps"] },
            { title: "Calculated Fields", desc: "Create custom metrics and computed dimensions.", topics: ["Basic Calculations", "LOD Expressions", "Table Calculations", "Parameters"] },
            { title: "Interactive Dashboards", desc: "Combine sheets into powerful, interactive dashboards.", topics: ["Dashboard Actions", "Filters", "Highlight", "URL Actions", "Device Designer"] },
            { title: "Advanced & Tableau Server", desc: "Deploy, share, and optimise visualisations.", topics: ["Data Blending", "Performance Tuning", "Tableau Public/Server", "REST API"] }
        ]
    },
    "machine learning": {
        icon: "🤖",
        subtitle: "Build and deploy ML models end-to-end",
        phases: [
            { title: "ML Foundations", desc: "Understand key concepts: supervised vs unsupervised, bias-variance, model evaluation.", topics: ["Supervised Learning", "Unsupervised Learning", "Train/Test Split", "Cross-Validation"] },
            { title: "Core Algorithms", desc: "Learn the most widely used ML algorithms.", topics: ["Linear Regression", "Logistic Regression", "Decision Trees", "KNN", "SVM"] },
            { title: "Ensemble Methods", desc: "Build stronger models by combining learners.", topics: ["Random Forest", "Gradient Boosting", "XGBoost", "Bagging vs Boosting"] },
            { title: "Deep Learning Intro", desc: "Neural networks and modern deep learning basics.", topics: ["Perceptrons", "Backpropagation", "CNNs", "RNNs", "Keras / PyTorch"] },
            { title: "MLOps & Deployment", desc: "Take models from notebooks to production.", topics: ["Feature Engineering", "Hyperparameter Tuning", "Model Serving", "FastAPI", "Docker"] }
        ]
    },
    "deep learning": {
        icon: "🧠",
        subtitle: "Master neural networks and AI model architectures",
        phases: [
            { title: "Neural Network Basics", desc: "Neurons, activation functions, and forward pass.", topics: ["Perceptron", "Sigmoid / ReLU", "Loss Functions", "Gradient Descent"] },
            { title: "Training & Regularization", desc: "Train deep networks reliably.", topics: ["Backpropagation", "Batch Norm", "Dropout", "Adam Optimizer", "Learning Rate Scheduling"] },
            { title: "Convolutional Networks", desc: "Image recognition and computer vision.", topics: ["CNN Architecture", "Pooling", "Transfer Learning", "ResNet / VGG / EfficientNet"] },
            { title: "Sequence Models", desc: "Handle sequential and temporal data.", topics: ["RNNs", "LSTMs", "GRUs", "Attention Mechanism", "Transformers"] },
            { title: "Modern AI", desc: "Large language models and generative AI.", topics: ["BERT / GPT", "Fine-tuning", "Prompt Engineering", "Diffusion Models", "Hugging Face"] }
        ]
    },
    git: {
        icon: "🌿",
        subtitle: "Collaborate and version-control like a pro",
        phases: [
            { title: "Git Basics", desc: "Understand version control and basic commands.", topics: ["init / clone", "add / commit", "status / log", ".gitignore"] },
            { title: "Branching & Merging", desc: "Manage parallel lines of work.", topics: ["branch", "checkout", "merge", "Merge Conflicts"] },
            { title: "Remote Repositories", desc: "Collaborate with teams using remote repos.", topics: ["push / pull / fetch", "origin / upstream", "Pull Requests"] },
            { title: "Advanced Workflows", desc: "Professional Git strategies for teams.", topics: ["rebase", "stash", "cherry-pick", "Git Flow", "GitHub Actions"] },
            { title: "DevOps Integration", desc: "Integrate Git into CI/CD pipelines.", topics: ["GitHub Actions", "Webhooks", "Git Hooks", "Tagging & Releases"] }
        ]
    },
    github: {
        icon: "🐙",
        subtitle: "Master GitHub for collaboration and open source",
        phases: [
            { title: "GitHub Basics", desc: "Create and manage repositories on GitHub.", topics: ["Repos", "Issues", "Stars / Forks", "README.md"] },
            { title: "Pull Requests", desc: "Collaborate via code review workflows.", topics: ["Branching Strategy", "PR Templates", "Reviewers", "Merge Options"] },
            { title: "GitHub Actions", desc: "Automate CI/CD workflows directly in GitHub.", topics: ["Workflows", "Triggers", "Jobs & Steps", "Marketplace Actions"] },
            { title: "Project Management", desc: "Manage projects and track issues.", topics: ["Projects Boards", "Milestones", "Labels", "Discussions"] },
            { title: "Advanced GitHub", desc: "Packages, security, and open-source best practices.", topics: ["GitHub Packages", "Dependabot", "Security Advisories", "Sponsors"] }
        ]
    },
    numpy: {
        icon: "🔢",
        subtitle: "High-performance numerical computing with Python",
        phases: [
            { title: "NumPy Basics", desc: "Create and manipulate arrays.", topics: ["ndarray", "arange / linspace", "zeros / ones", "dtype"] },
            { title: "Array Operations", desc: "Mathematical and logical array operations.", topics: ["Element-wise Ops", "Broadcasting", "Comparison", "Boolean Indexing"] },
            { title: "Indexing & Slicing", desc: "Select and reshape data efficiently.", topics: ["Fancy Indexing", "Slices", "reshape", "flatten / ravel"] },
            { title: "Linear Algebra", desc: "Matrix operations and linear algebra.", topics: ["dot / matmul", "transpose", "linalg.inv", "eigenvalues"] },
            { title: "Advanced NumPy", desc: "Performance and integration with other libraries.", topics: ["Vectorization", "np.where", "random module", "Memory Layout", "Integration with Pandas/SciPy"] }
        ]
    },
    pandas: {
        icon: "🐼",
        subtitle: "Data manipulation and analysis at scale",
        phases: [
            { title: "DataFrames & Series", desc: "Core pandas data structures.", topics: ["Series", "DataFrame", "read_csv", "head / tail / info"] },
            { title: "Data Selection", desc: "Access and filter your data.", topics: ["loc / iloc", "Boolean Filtering", "query()", "Conditional Selection"] },
            { title: "Data Cleaning", desc: "Handle missing values and transform data.", topics: ["dropna / fillna", "astype", "rename", "duplicates", "apply / map"] },
            { title: "Aggregation", desc: "Group and summarise data.", topics: ["groupby", "agg", "pivot_table", "crosstab", "resample"] },
            { title: "Merging & Time Series", desc: "Combine datasets and work with dates.", topics: ["merge / join / concat", "DatetimeIndex", "rolling", "shift"] }
        ]
    },
    javascript: {
        icon: "⚡",
        subtitle: "Build dynamic web applications with JS",
        phases: [
            { title: "JS Fundamentals", desc: "Variables, types, and control flow.", topics: ["var / let / const", "Types", "Operators", "if/else", "Loops"] },
            { title: "Functions & Scope", desc: "How functions and closures work.", topics: ["Arrow Functions", "Closures", "Hoisting", "this", "IIFE"] },
            { title: "DOM & Events", desc: "Interact with the browser's document.", topics: ["querySelector", "addEventListener", "DOM Manipulation", "Event Bubbling"] },
            { title: "Async JavaScript", desc: "Handle asynchronous operations.", topics: ["Callbacks", "Promises", "async / await", "fetch API", "Error Handling"] },
            { title: "Modern JS & Frameworks", desc: "ES6+ features and popular frameworks.", topics: ["Modules", "Destructuring", "Spread", "React / Vue basics", "Node.js"] }
        ]
    },
    linkedin: {
        icon: "💼",
        subtitle: "Build a professional brand that gets noticed",
        phases: [
            { title: "Profile Optimization", desc: "Make your profile stand out to recruiters.", topics: ["Headline", "About Section", "Photo", "Banner", "Skills Endorsements"] },
            { title: "Network Building", desc: "Grow a relevant and engaged network.", topics: ["Connection Requests", "Personalised Messages", "Alumni Network", "Industry Groups"] },
            { title: "Content Strategy", desc: "Post content that builds influence.", topics: ["Articles", "Posts", "Commenting Strategy", "Hashtags", "Consistency"] },
            { title: "Job Search", desc: "Leverage LinkedIn for job discovery.", topics: ["Jobs Tab", "Easy Apply", "Job Alerts", "Recruiter InMail", "LinkedIn Premium"] },
            { title: "Thought Leadership", desc: "Position yourself as an industry expert.", topics: ["Creator Mode", "LinkedIn Newsletter", "Speaking Engagements", "Collaborations"] }
        ]
    }
};

// Generic fallback roadmap for any skill not in the dictionary
function getGenericRoadmap(skill) {
    const s = skill.charAt(0).toUpperCase() + skill.slice(1);
    return {
        icon: "📚",
        subtitle: `Structured learning path for ${s}`,
        phases: [
            { title: `${s} Foundations`, desc: `Learn what ${s} is, its core concepts, and how to set up your environment.`, topics: [`What is ${s}?`, `${s} Key Terminology`, `Setting Up ${s}`, `Hello World in ${s}`] },
            { title: `Core ${s} Skills`, desc: `Build hands-on proficiency with the essential features of ${s}.`, topics: [`${s} Fundamentals`, `Common ${s} Patterns`, `${s} Exercises`, `Debugging ${s}`] },
            { title: `Intermediate ${s}`, desc: `Apply your ${s} knowledge to realistic, production-like scenarios.`, topics: [`${s} Mini Projects`, `${s} Case Studies`, `${s} Integration`, `Peer Review`] },
            { title: `Advanced ${s}`, desc: `Explore advanced ${s} topics, performance tuning, and best practices.`, topics: [`${s} Performance`, `${s} Best Practices`, `${s} Edge Cases`, `${s} Design Patterns`] },
            { title: `${s} in Production`, desc: `Build portfolio-worthy ${s} projects and prepare for interviews.`, topics: [`${s} Capstone Project`, `${s} Portfolio`, `${s} Interview Prep`, `${s} Certifications`] }
        ]
    };
}

function getRoadmapForSkill(skill) {
    const key = skill.toLowerCase().trim();
    return SKILL_ROADMAPS[key] || getGenericRoadmap(skill);
}

document.getElementById('analyze-btn').addEventListener('click', async () => {
    const resumeText = document.getElementById('resume-text').value;
    const jdText = document.getElementById('jd-text').value;
    const resumeFile = document.getElementById('resume-file').files[0];

    if ((!resumeText && !resumeFile) || !jdText) {
        alert("Please provide both a Resume (File or Text) and Job Description text.");
        return;
    }

    document.getElementById('analyze-btn').textContent = "Analyzing...";

    const formData = new FormData();
    formData.append("job_description_target", jdText);
    if (resumeText) formData.append("resume_text", resumeText);
    if (resumeFile) formData.append("resume_file", resumeFile);

    try {
        const response = await fetch(`${API_BASE}/analyze`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        // Render Score
        document.getElementById('match-score-value').textContent = `${data.match_score}%`;

        // Render Skills
        globalUserSkills = data.user_skills.map(s => s.toLowerCase());
        const userSkillsDiv = document.getElementById('user-skills-container');
        userSkillsDiv.innerHTML = '';
        data.user_skills.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'chip present';
            span.dataset.skill = skill.toLowerCase();
            span.style.cursor = 'pointer';
            span.title = 'Click to take adaptive test!';
            span.onclick = () => openQuiz(skill);
            span.innerHTML = `${skill} <span style="font-size:0.7em">🎯 Test</span>`;
            userSkillsDiv.appendChild(span);
        });

        const missingSkillsDiv = document.getElementById('missing-skills-container');
        missingSkillsDiv.innerHTML = '';
        data.missing_skills.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'chip missing';
            span.dataset.skill = skill.toLowerCase();
            span.style.cursor = 'pointer';
            span.title = 'Click to take adaptive test!';
            span.onclick = () => openQuiz(skill);
            span.innerHTML = `${skill} <span style="font-size:0.7em">🎯 Test</span>`;
            missingSkillsDiv.appendChild(span);
        });

        currentRoadmap = data.roadmap;
        renderRoadmap(currentRoadmap);

        document.getElementById('results-section').classList.remove('hidden');
        document.getElementById('analyze-btn').textContent = "Generate Roadmap 🚀";

    } catch (err) {
        console.error(err);
        alert("Error analyzing. Is backend running?");
        document.getElementById('analyze-btn').textContent = "Generate Roadmap 🚀";
    }
});

function renderRoadmap(roadmap) {
    const timeline = document.getElementById('roadmap-timeline');
    timeline.innerHTML = '';

    roadmap.forEach((item, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = `timeline-step ${item.status}`;
        stepDiv.style.animationDelay = `${index * 0.1}s`;

        let statusBadge = "";
        if (item.status === 'completed') statusBadge = '✅ Completed';
        else if (item.status === 'in_progress') statusBadge = '⏳ Needs Review';
        else if (item.status === 'needs_prerequisite') statusBadge = '⚠️ Needs Prereq';
        else statusBadge = '⚪ Not Started';

        // Unique submenu ID per step
        const menuId = `submenu-${index}`;
        const btnId = `optbtn-${index}`;

        stepDiv.innerHTML = `
            <div class="step-header">
                <h4>Step ${item.step}: ${item.skill}
                    <span style="font-size:0.8rem; margin-left:10px; color:var(--text-muted)">[${item.category}]</span>
                </h4>
                <span style="font-size:0.8rem; font-weight:bold;">${statusBadge}</span>
            </div>
            <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom: 1rem;">
                ${item.is_core_gap ? "Core requirement from Job Description" : "Foundational Prerequisite"}
            </p>

            <!-- Step action submenu -->
            <div class="step-actions-wrapper">
                <button class="step-options-btn" id="${btnId}"
                    onclick="toggleSubmenu('${menuId}', '${btnId}')">
                    ⚡ Options <span class="btn-arrow">▲</span>
                </button>
                <div class="step-submenu" id="${menuId}">
                    <button class="submenu-item quiz-item" onclick="closeAllSubmenus(); openQuiz('${item.skill}')">
                        <span class="menu-icon">🎯</span>
                        <span>Take Test</span>
                    </button>
                    <button class="submenu-item roadmap-item" onclick="closeAllSubmenus(); openSkillRoadmap('${item.skill}')">
                        <span class="menu-icon">🗺️</span>
                        <span>View Roadmap</span>
                    </button>
                </div>
            </div>
        `;
        timeline.appendChild(stepDiv);
    });
}

// ── Submenu toggle helpers ────────────────────────────────────────────────────
window.toggleSubmenu = function (menuId, btnId) {
    const menu = document.getElementById(menuId);
    const btn = document.getElementById(btnId);
    const isOpen = menu.classList.contains('visible');

    closeAllSubmenus(); // close any other open submenus first

    if (!isOpen) {
        menu.classList.add('visible');
        btn.classList.add('open');
    }
};

window.closeAllSubmenus = function () {
    document.querySelectorAll('.step-submenu.visible').forEach(m => m.classList.remove('visible'));
    document.querySelectorAll('.step-options-btn.open').forEach(b => b.classList.remove('open'));
};

// Click outside any submenu → close all
document.addEventListener('click', (e) => {
    if (!e.target.closest('.step-actions-wrapper')) {
        closeAllSubmenus();
    }
});

// ── Skill Roadmap Modal ───────────────────────────────────────────────────────
window.openSkillRoadmap = function (skill) {
    const roadmapData = getRoadmapForSkill(skill);

    document.getElementById('roadmap-modal-icon').textContent = roadmapData.icon;
    document.getElementById('roadmap-modal-title').textContent = `${skill} Roadmap`;
    document.getElementById('roadmap-modal-subtitle').textContent = roadmapData.subtitle;

    const phasesContainer = document.getElementById('roadmap-modal-phases');
    phasesContainer.innerHTML = '';

    roadmapData.phases.forEach((phase, i) => {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = 'roadmap-phase';
        phaseDiv.style.animationDelay = `${i * 0.08}s`;

        const tagsHTML = phase.topics.map(t =>
            `<span class="phase-tag">${t}</span>`
        ).join('');

        phaseDiv.innerHTML = `
            <div class="phase-number">${i + 1}</div>
            <div class="phase-content">
                <div class="phase-title">${phase.title}</div>
                <div class="phase-desc">${phase.desc}</div>
                <div class="phase-topics">${tagsHTML}</div>
            </div>
        `;
        phasesContainer.appendChild(phaseDiv);
    });

    document.getElementById('skill-roadmap-modal').classList.remove('hidden');
};

document.getElementById('close-roadmap-modal').addEventListener('click', () => {
    document.getElementById('skill-roadmap-modal').classList.add('hidden');
});

// Click outside roadmap modal content → close modal
document.getElementById('skill-roadmap-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('skill-roadmap-modal')) {
        document.getElementById('skill-roadmap-modal').classList.add('hidden');
    }
});

// Quiz Modal Logic
let quizSkill = "";
let currentQuestions = [];
const modal = document.getElementById('quiz-modal');

window.openQuiz = async (skill) => {
    quizSkill = skill;
    document.getElementById('quiz-title').textContent = `Diagnostic Test: ${skill}`;
    const container = document.getElementById('quiz-questions-container');
    container.innerHTML = '<p style="color:#00ffcc;">🧠 Generating personalized 5-question Quiz using NLP Machine Learning... Please wait a few seconds...</p>';
    document.getElementById('submit-quiz').classList.add('hidden');
    document.getElementById('quiz-feedback').innerHTML = '';
    modal.classList.remove('hidden');

    const isPresent = globalUserSkills.includes(skill.toLowerCase());
    try {
        const response = await fetch(`${API_BASE}/get_quiz`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                skill_name: skill,
                is_present_in_resume: isPresent,
                previous_score: skillScores[skill.toLowerCase()]?.score || null,
                previous_tier: skillScores[skill.toLowerCase()]?.tier || null
            })
        });
        const data = await response.json();
        currentQuestions = data.questions;

        container.innerHTML = '';
        currentQuestions.forEach((q, idx) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = '2rem';
            qDiv.style.background = 'rgba(255,255,255,0.03)';
            qDiv.style.padding = '1.5rem';
            qDiv.style.borderRadius = '12px';
            qDiv.style.border = '1px solid rgba(255,255,255,0.1)';

            qDiv.innerHTML = `<p style="font-weight:600; font-size:1.15rem; margin-bottom:1.2rem; color: #fff;">
                <span style="color:var(--primary-color);">Q${idx + 1} <span style="font-size:0.7em; color:gray; font-weight:normal;">[${q.tier_selected.toUpperCase()}]</span>:</span> ${q.q}
            </p>`;

            const optionsGrid = document.createElement('div');
            optionsGrid.style.display = 'flex';
            optionsGrid.style.flexDirection = 'column';
            optionsGrid.style.gap = '0.8rem';

            q.options.forEach((opt, optIdx) => {
                const label = document.createElement('label');
                label.className = 'quiz-option-card';
                label.innerHTML = `
                    <input type="radio" name="q${idx}" value="${optIdx}" class="hidden-radio">
                    <div class="radio-indicator"></div>
                    <span style="font-size: 1.05rem; line-height: 1.4;">${opt}</span>
                `;
                optionsGrid.appendChild(label);
            });
            qDiv.appendChild(optionsGrid);
            container.appendChild(qDiv);
        });

        document.getElementById('submit-quiz').classList.remove('hidden');
    } catch (err) {
        container.innerHTML = '<p style="color:red;">Error loading quiz questions. Is backend running?</p>';
    }
};

document.querySelector('.close-modal').addEventListener('click', () => {
    modal.classList.add('hidden');
});

document.getElementById('submit-quiz').addEventListener('click', async () => {
    // Calculate score
    let correct = 0;
    for (let i = 0; i < currentQuestions.length; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && parseInt(selected.value) === currentQuestions[i].answer) {
            correct++;
        }
    }
    const score = Math.round((correct / currentQuestions.length) * 100);
    const currentTier = currentQuestions[0] ? currentQuestions[0].tier_selected : 'easy';
    skillScores[quizSkill.toLowerCase()] = { score, tier: currentTier }; // Track score for adaptive difficulty on retry

    const isPresent = globalUserSkills.includes(quizSkill.toLowerCase());
    try {
        const response = await fetch(`${API_BASE}/evaluate_quiz`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roadmap: currentRoadmap,
                skill_name: quizSkill,
                score: score,
                is_present: isPresent,
                tier: currentTier
            })
        });

        const data = await response.json();
        currentRoadmap = data.roadmap;

        // Visual UI Feedback on the Chips
        const chipClass = isPresent ? '.chip.present' : '.chip.missing';
        const chips = document.querySelectorAll(chipClass);
        chips.forEach(chip => {
            // Find the specific chip they just tested by exact dataset match
            if (chip.dataset.skill === quizSkill.toLowerCase()) {
                if (score >= 80 && currentTier === 'hard') {
                    chip.innerHTML = `${quizSkill} <span style="font-size:0.8em; margin-left:5px; padding:3px 6px; border-radius:4px; background:rgba(46,204,113,0.3); color:#2ecc71;">✅ Verified</span>`;
                    chip.style.borderColor = '#2ecc71';
                    chip.style.boxShadow = '0 0 10px rgba(46,204,113,0.2)';
                } else if (score >= 80 && currentTier !== 'hard') {
                    chip.innerHTML = `${quizSkill} <span style="font-size:0.8em; margin-left:5px; padding:3px 6px; border-radius:4px; background:rgba(245,158,11,0.3); color:#f59e0b;">📈 Level Up!</span>`;
                    chip.style.borderColor = '#f59e0b';
                    chip.style.boxShadow = '0 0 10px rgba(245,158,11,0.2)';
                } else {
                    chip.innerHTML = `${quizSkill} <span style="font-size:0.8em; margin-left:5px; padding:3px 6px; border-radius:4px; background:rgba(231,76,60,0.3); color:#e74c3c;">❌ Unverified</span>`;
                    chip.style.borderColor = '#e74c3c';
                }
            }
        });

        // Render Reasoning Trace exactly as requested
        document.getElementById('quiz-feedback').innerHTML = `
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary-color);">
                <strong style="color: var(--primary-color); display:block; margin-bottom:5px;">🧠 Adaptive Reasoning Trace:</strong>
                <pre style="white-space: pre-wrap; font-family: inherit; margin:0; line-height:1.5;">${data.reasoning}</pre>
            </div>
        `;

        // Hide submit button to prevent double submission
        document.getElementById('submit-quiz').classList.add('hidden');

        // Render updated roadmap behind the modal
        renderRoadmap(currentRoadmap);

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 6000); // 6 seconds to read the reasoning trace before closing

    } catch (err) {
        console.error("Failed to evaluate quiz:", err);
    }
});

// Chatbot Logic
const chatToggle = document.getElementById('chatbot-toggle');
const chatBody = document.getElementById('chatbot-body');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

chatToggle.addEventListener('click', () => {
    chatBody.classList.toggle('hidden');
    document.getElementById('chat-icon').textContent = chatBody.classList.contains('hidden') ? '▲' : '▼';
});

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append user msg
    const uMsg = document.createElement('div');
    uMsg.className = 'message user-message';
    uMsg.textContent = text;
    chatMessages.appendChild(uMsg);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch(`${API_BASE}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: text,
                context: quizSkill || "General Learning"
            })
        });
        const data = await response.json();

        // Append AI msg
        const aMsg = document.createElement('div');
        aMsg.className = 'message ai-message';
        aMsg.textContent = data.reply;
        chatMessages.appendChild(aMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (e) {
        console.error(e);
    }
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
