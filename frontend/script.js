const API_BASE = "http://localhost:8000/api";
let currentRoadmap = [];
let globalUserSkills = [];
let skillScores = {}; // dictionary mapping skill -> score

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
            <button class="take-quiz-btn" onclick="openQuiz('${item.skill}')">Take Practice Quiz</button>
        `;
        timeline.appendChild(stepDiv);
    });
}

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
            // Find the specific chip they just tested by partial text match
            if (chip.textContent.toLowerCase().includes(quizSkill.toLowerCase())) {
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
