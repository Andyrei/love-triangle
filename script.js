// Axis Geometry Constants
const MIND_CORNER = { x: 200, y: 40 };
const HEART_CORNER = { x: 50, y: 310 };
const BODY_CORNER = { x: 350, y: 310 };
const CENTER = { x: 200, y: 220 };

// Global State
let currentMode = 'single';      // 'single' | 'partner'
let activePerson = 'A';         // 'A' | 'B'
let dragHintDismissed = false;   // Hint visibility state
let currentPresetFilter = 'all';// 'all' | 'sternberg' | 'pop'

// Profiles Data
let profileA = { m: 90, h: 90, b: 90 };
let profileB = { m: 70, h: 85, b: 40 };

// Full Presets Dataset (16 Presets)
const PRESETS = [
    // Sternberg Triangular Love Theory
    { id: "p1", name: "💎 Consummate Love", m: 90, h: 90, b: 90, cat: "sternberg" },
    { id: "p2", name: "🤝 Pure Liking / Best Friends", m: 85, h: 20, b: 10, cat: "sternberg" },
    { id: "p3", name: "🔥 Infatuation / Pure Passion", m: 10, h: 15, b: 95, cat: "sternberg" },
    { id: "p4", name: "⚓ Empty Love / Pure Logic", m: 90, h: 10, b: 5, cat: "sternberg" },
    { id: "p5", name: "🌹 Romantic Love", m: 30, h: 85, b: 85, cat: "sternberg" },
    { id: "p6", name: "🕊️ Companionate Love", m: 85, h: 90, b: 20, cat: "sternberg" },
    { id: "p7", name: "⚡ Fatuous Love", m: 15, h: 85, b: 90, cat: "sternberg" },
    { id: "p8", name: "💤 Non-Love / Dormant", m: 10, h: 10, b: 10, cat: "sternberg" },

    // Pop Culture Archetypes
    { id: "p9", name: "🖤 Morticia & Gomez Addams", m: 100, h: 100, b: 100, cat: "pop" },
    { id: "p10", name: "☕ Jim & Pam (The Office)", m: 85, h: 95, b: 60, cat: "pop" },
    { id: "p11", name: "🛋️ Ross & Rachel (Friends)", m: 40, h: 85, b: 80, cat: "pop" },
    { id: "p12", name: "🔍 Sherlock & Watson", m: 95, h: 70, b: 10, cat: "pop" },
    { id: "p13", name: "🦊 Fleabag & Hot Priest", m: 80, h: 90, b: 85, cat: "pop" },
    { id: "p14", name: "💥 Mr. & Mrs. Smith", m: 70, h: 45, b: 95, cat: "pop" },
    { id: "p15", name: "🚀 Tony Stark & Pepper Potts", m: 90, h: 65, b: 70, cat: "pop" },
    { id: "p16", name: "🏎️ Bonnie & Clyde", m: 25, h: 75, b: 95, cat: "pop" }
];

const mindInput = document.getElementById('mind-slider');
const heartInput = document.getElementById('heart-slider');
const bodyInput = document.getElementById('body-slider');

const mindValDisplay = document.getElementById('mind-val');
const heartValDisplay = document.getElementById('heart-val');
const bodyValDisplay = document.getElementById('body-val');
const centerCoordsText = document.getElementById('center-coords-text');

const activePolygonA = document.getElementById('active-polygon');
const activePolygonB = document.getElementById('active-polygon-b');

const lineMind = document.getElementById('line-mind');
const lineHeart = document.getElementById('line-heart');
const lineBody = document.getElementById('line-body');

const centerPointA = document.getElementById('matrix-center-point');
const centerPulseA = document.getElementById('matrix-center-pulse');
const centerPointB = document.getElementById('matrix-center-point-b');

const statusCard = document.getElementById('status-card');
const badgeContainer = document.getElementById('badge-container');
const stateTitle = document.getElementById('state-title');
const stateDescription = document.getElementById('state-description');
const dominantVectorText = document.getElementById('dominant-vector-text');

// Node Circle Elements for Dynamic Glows
const nodeMindCircle = document.getElementById('node-mind-circle');
const nodeHeartCircle = document.getElementById('node-heart-circle');
const nodeBodyCircle = document.getElementById('node-body-circle');

// Gauges DOM
const gaugeViabilityVal = document.getElementById('gauge-viability-val');
const gaugeViabilityBar = document.getElementById('gauge-viability-bar');
const gaugeVolatilityVal = document.getElementById('gauge-volatility-val');
const gaugeVolatilityBar = document.getElementById('gauge-volatility-bar');
const gaugeCommVal = document.getElementById('gauge-comm-val');
const gaugeCommBar = document.getElementById('gauge-comm-bar');
const gaugeSparkVal = document.getElementById('gauge-spark-val');
const gaugeSparkBar = document.getElementById('gauge-spark-bar');

// Split Share Bars DOM
const mindBarSplit = document.getElementById('mind-bar-split');
const heartBarSplit = document.getElementById('heart-bar-split');
const bodyBarSplit = document.getElementById('body-bar-split');
const mindSplitPct = document.getElementById('mind-split-pct');
const heartSplitPct = document.getElementById('heart-split-pct');
const bodySplitPct = document.getElementById('body-split-pct');

// Insights DOM
const strengthText = document.getElementById('strength-text');
const challengeText = document.getElementById('challenge-text');
const adviceText = document.getElementById('advice-text');

// Partner Alignment DOM
const partnerAlignmentCard = document.getElementById('partner-alignment-card');
const alignmentScoreBadge = document.getElementById('alignment-score-badge');
const symmetryGapText = document.getElementById('symmetry-gap-text');
const complementaryTypeText = document.getElementById('complementary-type-text');
const partnerTabsContainer = document.getElementById('partner-tabs-container');
const activeProfileLabel = document.getElementById('active-profile-label');
const dragHint = document.getElementById('canvas-drag-hint');

function loadSavedState() {
    try {
        const saved = localStorage.getItem('cm_compatibility_matrix_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.profileA) profileA = parsed.profileA;
            if (parsed.profileB) profileB = parsed.profileB;
            if (parsed.currentMode) currentMode = parsed.currentMode;
            if (parsed.activePerson) activePerson = parsed.activePerson;
            if (parsed.dragHintDismissed) {
                dragHintDismissed = true;
                if (dragHint) dragHint.classList.add('hidden');
            }
        }
    } catch (e) {
        console.warn("Failed to load state from localStorage:", e);
    }
}

function saveState() {
    try {
        const stateToSave = {
            profileA,
            profileB,
            currentMode,
            activePerson,
            dragHintDismissed
        };
        localStorage.setItem('cm_compatibility_matrix_state', JSON.stringify(stateToSave));
    } catch (e) {
        console.warn("Failed to save state:", e);
    }
}

// Feature 1: Permanently Dismiss Drag Hint on user interaction
function dismissDragHint() {
    if (!dragHintDismissed) {
        dragHintDismissed = true;
        if (dragHint) {
            dragHint.style.transition = 'opacity 0.3s ease';
            dragHint.style.opacity = '0';
            setTimeout(() => dragHint.classList.add('hidden'), 300);
        }
        saveState();
    }
}

function initPresetsUI() {
    const container = document.getElementById('preset-buttons-container');
    container.innerHTML = '';

    const filtered = PRESETS.filter(p => currentPresetFilter === 'all' || p.cat === currentPresetFilter);

    filtered.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center space-x-1.5';
        btn.textContent = p.name;
        btn.onclick = () => {
            dismissDragHint();
            setPreset(p.m, p.h, p.b);
        };
        container.appendChild(btn);
    });
}

function filterPresets(cat) {
    currentPresetFilter = cat;
    ['all', 'sternberg', 'pop'].forEach(c => {
        const tab = document.getElementById(`preset-tab-${c}`);
        if (c === cat) {
            tab.className = 'px-2 py-0.5 rounded text-sky-400 bg-slate-800 shadow';
        } else {
            tab.className = 'px-2 py-0.5 rounded text-slate-400 hover:text-white';
        }
    });
    initPresetsUI();
}

function setMode(mode) {
    dismissDragHint();
    currentMode = mode;
    const singleBtn = document.getElementById('mode-single-btn');
    const partnerBtn = document.getElementById('mode-partner-btn');

    if (mode === 'single') {
        singleBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-sky-500 text-white shadow-md';
        partnerBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all';
        partnerTabsContainer.classList.add('hidden');
        activePolygonB.classList.add('hidden');
        centerPointB.classList.add('hidden');
        partnerAlignmentCard.classList.add('hidden');
        activeProfileLabel.textContent = "";
        activePerson = 'A';
    } else {
        partnerBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-sky-500 text-white shadow-md';
        singleBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all';
        partnerTabsContainer.classList.remove('hidden');
        activePolygonB.classList.remove('hidden');
        centerPointB.classList.remove('hidden');
        partnerAlignmentCard.classList.remove('hidden');
        updateTabHighlight();
    }
    syncSlidersFromState();
    updateMatrix();
    saveState();
}

function setActivePerson(person) {
    dismissDragHint();
    activePerson = person;
    updateTabHighlight();
    syncSlidersFromState();
    updateMatrix();
    saveState();
}

function updateTabHighlight() {
    const tabA = document.getElementById('tab-person-a');
    const tabB = document.getElementById('tab-person-b');

    if (activePerson === 'A') {
        tabA.className = 'px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-500 text-white shadow';
        tabB.className = 'px-4 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white';
        activeProfileLabel.textContent = "(Editing Person A)";
    } else {
        tabB.className = 'px-4 py-1.5 rounded-lg text-xs font-bold bg-purple-500 text-white shadow';
        tabA.className = 'px-4 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white';
        activeProfileLabel.textContent = "(Editing Person B)";
    }
}

function syncSlidersFromState() {
    const prof = activePerson === 'A' ? profileA : profileB;
    mindInput.value = prof.m;
    heartInput.value = prof.h;
    bodyInput.value = prof.b;
}

function setPreset(m, h, b) {
    if (activePerson === 'A') {
        profileA = { m, h, b };
    } else {
        profileB = { m, h, b };
    }
    syncSlidersFromState();
    updateMatrix();
    saveState();
}

function getPointOnAxis(cornerPoint, valPercent) {
    const factor = valPercent / 100;
    return {
        x: CENTER.x + (cornerPoint.x - CENTER.x) * factor,
        y: CENTER.y + (cornerPoint.y - CENTER.y) * factor
    };
}

function cartesianToBarycentric(x, y) {
    const xM = MIND_CORNER.x, yM = MIND_CORNER.y;
    const xH = HEART_CORNER.x, yH = HEART_CORNER.y;
    const xB = BODY_CORNER.x, yB = BODY_CORNER.y;

    const det = (yH - yB) * (xM - xB) + (xB - xH) * (yM - yB);
    let wM = ((yH - yB) * (x - xB) + (xB - xH) * (y - yB)) / det;
    let wH = ((yB - yM) * (x - xB) + (xM - xB) * (y - yB)) / det;
    let wB = 1 - wM - wH;

    wM = Math.max(0, Math.min(1, wM));
    wH = Math.max(0, Math.min(1, wH));
    wB = Math.max(0, Math.min(1, wB));
    const sum = wM + wH + wB || 1;

    return {
        m: Math.round((wM / sum) * 100 * 1.45),
        h: Math.round((wH / sum) * 100 * 1.45),
        b: Math.round((wB / sum) * 100 * 1.45)
    };
}

// Canvas Interaction Events
const svgCanvas = document.getElementById('matrix-svg');
let isDragging = false;

function handlePointerEvent(e) {
    dismissDragHint();
    const rect = svgCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const svgX = ((clientX - rect.left) / rect.width) * 400;
    const svgY = ((clientY - rect.top) / rect.height) * 380;

    const bary = cartesianToBarycentric(svgX, svgY);
    const clampedM = Math.min(100, Math.max(0, bary.m));
    const clampedH = Math.min(100, Math.max(0, bary.h));
    const clampedB = Math.min(100, Math.max(0, bary.b));

    if (activePerson === 'A') {
        profileA = { m: clampedM, h: clampedH, b: clampedB };
    } else {
        profileB = { m: clampedM, h: clampedH, b: clampedB };
    }
    syncSlidersFromState();
    updateMatrix();
    saveState();
}

svgCanvas.addEventListener('mousedown', (e) => { isDragging = true; handlePointerEvent(e); });
window.addEventListener('mousemove', (e) => { if (isDragging) handlePointerEvent(e); });
window.addEventListener('mouseup', () => { isDragging = false; });

svgCanvas.addEventListener('touchstart', (e) => { isDragging = true; handlePointerEvent(e); }, { passive: true });
window.addEventListener('touchmove', (e) => { if (isDragging) handlePointerEvent(e); }, { passive: true });
window.addEventListener('touchend', () => { isDragging = false; });

function updateDynamicEmojiStyles(m, h, b) {
    const root = document.documentElement;

    // 1. Dynamic CSS Variables for Sliders Dynamic Linear-Gradient Fills
    root.style.setProperty('--mind-val', m);
    root.style.setProperty('--heart-val', h);
    root.style.setProperty('--body-val', b);

    // 2. Feature 3: Heartbeat grow speed scales inversely with Heart intensity (Faster pulse at 100%)
    // 100% -> 0.4s fast beat; 0% -> 2.2s sluggish beat
    const beatSpeedSec = (2.2 - (h / 100) * 1.8).toFixed(2);
    root.style.setProperty('--heart-beat-speed', `${beatSpeedSec}s`);

    // 3. Feature 3: Eggplant "Morning Wood" Rising Up angle:
    // 0% -> -60deg (drooping flat/down); 100% -> 0deg (erect/pointing up)
    const angleDeg = (-60 + (b / 100) * 60).toFixed(1);
    root.style.setProperty('--eggplant-angle', `${angleDeg}deg`);

    // 4. Feature 4: Node SVG Glow Drop Shadows scaling directly with vector intensities (0-100%)
    const mindGlowBlur = (2 + (m / 100) * 16).toFixed(1);
    const mindGlowAlpha = (0.2 + (m / 100) * 0.75).toFixed(2);
    nodeMindCircle.style.filter = `drop-shadow(0px 0px ${mindGlowBlur}px rgba(56, 189, 248, ${mindGlowAlpha}))`;

    const heartGlowBlur = (2 + (h / 100) * 16).toFixed(1);
    const heartGlowAlpha = (0.2 + (h / 100) * 0.75).toFixed(2);
    nodeHeartCircle.style.filter = `drop-shadow(0px 0px ${heartGlowBlur}px rgba(244, 63, 94, ${heartGlowAlpha}))`;

    const bodyGlowBlur = (2 + (b / 100) * 16).toFixed(1);
    const bodyGlowAlpha = (0.2 + (b / 100) * 0.75).toFixed(2);
    nodeBodyCircle.style.filter = `drop-shadow(0px 0px ${bodyGlowBlur}px rgba(172, 200, 20, ${bodyGlowAlpha}))`;
}

function updateMatrix() {
    const activeProf = activePerson === 'A' ? profileA : profileB;
    activeProf.m = parseInt(mindInput.value);
    activeProf.h = parseInt(heartInput.value);
    activeProf.b = parseInt(bodyInput.value);

    const mA = profileA.m, hA = profileA.h, bA = profileA.b;
    const mB = profileB.m, hB = profileB.h, bB = profileB.b;

    // Apply Dynamic Emoji Animations & Glows for active profile
    updateDynamicEmojiStyles(activeProf.m, activeProf.h, activeProf.b);

    // Display text
    mindValDisplay.textContent = `${activeProf.m}%`;
    heartValDisplay.textContent = `${activeProf.h}%`;
    bodyValDisplay.textContent = `${activeProf.b}%`;
    centerCoordsText.textContent = `🧠 ${activeProf.m}% | 🫀 ${activeProf.h}% | 🍆 ${activeProf.b}%`;

    // Calculate SVG Points for Person A
    const pMindA = getPointOnAxis(MIND_CORNER, mA);
    const pHeartA = getPointOnAxis(HEART_CORNER, hA);
    const pBodyA = getPointOnAxis(BODY_CORNER, bA);

    // Calculate SVG Points for Person B
    const pMindB = getPointOnAxis(MIND_CORNER, mB);
    const pHeartB = getPointOnAxis(HEART_CORNER, hB);
    const pBodyB = getPointOnAxis(BODY_CORNER, bB);

    // Center handle position calculations
    const totalA = mA + hA + bA || 1;
    const cxA = (pMindA.x * mA + pHeartA.x * hA + pBodyA.x * bA) / totalA;
    const cyA = (pMindA.y * mA + pHeartA.y * hA + pBodyA.y * bA) / totalA;

    const totalB = mB + hB + bB || 1;
    const cxB = (pMindB.x * mB + pHeartB.x * hB + pBodyB.x * bB) / totalB;
    const cyB = (pMindB.y * mB + pHeartB.y * hB + pBodyB.y * bB) / totalB;

    // Feature 4: Ghosting Inactive Partner vs Solid Active Partner
    if (currentMode === 'single' || activePerson === 'A') {
        // Person A is Primary Active Solid
        activePolygonA.setAttribute('points', `${pMindA.x},${pMindA.y} ${pBodyA.x},${pBodyA.y} ${pHeartA.x},${pHeartA.y}`);
        activePolygonA.style.opacity = "1";
        activePolygonA.setAttribute('stroke-dasharray', 'none');
        activePolygonA.setAttribute('stroke-width', '2.5');

        lineMind.setAttribute('x2', pMindA.x); lineMind.setAttribute('y2', pMindA.y);
        lineHeart.setAttribute('x2', pHeartA.x); lineHeart.setAttribute('y2', pHeartA.y);
        lineBody.setAttribute('x2', pBodyA.x); lineBody.setAttribute('y2', pBodyA.y);

        centerPointA.setAttribute('cx', cxA); centerPointA.setAttribute('cy', cyA);
        centerPulseA.setAttribute('cx', cxA); centerPulseA.setAttribute('cy', cyA);

        if (currentMode === 'partner') {
            // Person B is Ghosted Inactive
            activePolygonB.setAttribute('points', `${pMindB.x},${pMindB.y} ${pBodyB.x},${pBodyB.y} ${pHeartB.x},${pHeartB.y}`);
            activePolygonB.style.opacity = "0.35";
            activePolygonB.setAttribute('stroke-dasharray', '4 4');
            centerPointB.setAttribute('cx', cxB); centerPointB.setAttribute('cy', cyB);
        }
    } else {
        // Person B is Primary Active Solid
        activePolygonA.setAttribute('points', `${pMindA.x},${pMindA.y} ${pBodyA.x},${pBodyA.y} ${pHeartA.x},${pHeartA.y}`);
        activePolygonA.style.opacity = "0.35";
        activePolygonA.setAttribute('stroke-dasharray', '4 4');

        activePolygonB.setAttribute('points', `${pMindB.x},${pMindB.y} ${pBodyB.x},${pBodyB.y} ${pHeartB.x},${pHeartB.y}`);
        activePolygonB.style.opacity = "1";
        activePolygonB.setAttribute('stroke-dasharray', 'none');
        activePolygonB.setAttribute('stroke-width', '2.5');

        lineMind.setAttribute('x2', pMindB.x); lineMind.setAttribute('y2', pMindB.y);
        lineHeart.setAttribute('x2', pHeartB.x); lineHeart.setAttribute('y2', pHeartB.y);
        lineBody.setAttribute('x2', pBodyB.x); lineBody.setAttribute('y2', pBodyB.y);

        centerPointB.setAttribute('cx', cxB); centerPointB.setAttribute('cy', cyB);
        centerPointA.setAttribute('cx', cxA); centerPointA.setAttribute('cy', cyA);
        centerPulseA.setAttribute('cx', cxB); centerPulseA.setAttribute('cy', cyB);
    }

    if (currentMode === 'partner') {
        calculatePartnerAlignment(mA, hA, bA, mB, hB, bB);
    }

    // Vector Share Breakdown
    const activeM = activeProf.m, activeH = activeProf.h, activeB = activeProf.b;
    const activeTotal = activeM + activeH + activeB || 1;
    const mPct = Math.round((activeM / activeTotal) * 100);
    const hPct = Math.round((activeH / activeTotal) * 100);
    const bPct = Math.max(0, 100 - mPct - hPct);

    mindBarSplit.style.width = `${mPct}%`;
    heartBarSplit.style.width = `${hPct}%`;
    bodyBarSplit.style.width = `${bPct}%`;
    mindSplitPct.textContent = `${mPct}%`;
    heartSplitPct.textContent = `${hPct}%`;
    bodySplitPct.textContent = `${bPct}%`;

    // Calculate Gauge Metrics
    calculateGauges(activeM, activeH, activeB);

    // Dominant Vector Text
    if (activeM > activeH && activeM > activeB) dominantVectorText.textContent = "Mind Driven (Intellectual Core)";
    else if (activeH > activeM && activeH > activeB) dominantVectorText.textContent = "Heart Driven (Emotional Core)";
    else if (activeB > activeM && activeB > activeH) dominantVectorText.textContent = "Body Driven (Physical Core)";
    else dominantVectorText.textContent = "Balanced Triad Synergy";

    // Evaluate Logical Relationship State Archetype
    evaluateState(activeM, activeH, activeB);
}

function calculateGauges(m, h, b) {
    const avg = (m + h + b) / 3;
    const dev = Math.sqrt(((m - avg) ** 2 + (h - avg) ** 2 + (b - avg) ** 2) / 3);
    const balanceFactor = Math.max(0, 100 - dev * 1.2);

    // 1. Long-Term Viability
    const viability = Math.min(100, Math.round(0.4 * h + 0.35 * m + 0.15 * b + 0.1 * balanceFactor));
    gaugeViabilityVal.textContent = `${viability}%`;
    gaugeViabilityBar.style.width = `${viability}%`;

    // 2. Volatility Index
    const volatility = Math.min(100, Math.round(0.55 * b + 0.35 * Math.abs(h - m) + 0.1 * (100 - m)));
    gaugeVolatilityVal.textContent = `${volatility}%`;
    gaugeVolatilityBar.style.width = `${volatility}%`;

    // 3. Communication Flow Ease
    const comm = Math.min(100, Math.round(0.55 * m + 0.35 * h + 0.10 * (100 - Math.abs(m - h))));
    gaugeCommVal.textContent = `${comm}%`;
    gaugeCommBar.style.width = `${comm}%`;

    // 4. Spontaneity & Spark
    const spark = Math.min(100, Math.round(0.55 * b + 0.35 * h + 0.10 * m));
    gaugeSparkVal.textContent = `${spark}%`;
    gaugeSparkBar.style.width = `${spark}%`;
}

function calculatePartnerAlignment(mA, hA, bA, mB, hB, bB) {
    const diffM = Math.abs(mA - mB);
    const diffH = Math.abs(hA - hB);
    const diffB = Math.abs(bA - bB);
    const avgDiff = Math.round((diffM + diffH + diffB) / 3);

    const matchScore = Math.max(0, 100 - avgDiff);
    alignmentScoreBadge.textContent = `${matchScore}% Match`;
    symmetryGapText.textContent = `${avgDiff}% Delta`;

    if (matchScore >= 85) complementaryTypeText.textContent = "Harmonious Mirror Pair";
    else if (diffM < 20 && diffH < 20) complementaryTypeText.textContent = "Emotional & Mental Anchors";
    else if (diffB > 40) complementaryTypeText.textContent = "Asymmetric Physical Attraction";
    else complementaryTypeText.textContent = "Complementary Growth Dynamic";
}

function evaluateState(m, h, b) {
    const HIGH = 60;
    const LOW = 40;

    let state = {};

    if (m >= HIGH && h >= HIGH && b >= HIGH) {
        state = {
            title: "Consummate Love / Perfect Match",
            badge: "Ideal Harmony",
            badgeStyle: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
            borderStyle: "border-l-emerald-400",
            description: "A rare and complete alignment across intellect, emotion, and physical attraction. You operate as partners, lovers, and best friends simultaneously.",
            strength: "Profound multi-dimensional synergy and high long-term relationship satisfaction.",
            challenge: "Risk of taking total harmony for granted without continuous intentional cultivation.",
            advice: "Continuously nurture all three pillars through novel shared adventures and deep intellectual reflections."
        };
    }
    else if (m >= HIGH && h >= HIGH && b < LOW) {
        state = {
            title: "The Platonic Best Friends Duo",
            badge: "Intellectual & Emotional",
            badgeStyle: "bg-sky-500/20 text-sky-400 border-sky-500/40",
            borderStyle: "border-l-sky-400",
            description: "Profound mutual understanding, shared values, and deep emotional trust, but lacking a passionate physical spark.",
            strength: "Unshakable emotional safety, transparent communication, and deep companionship.",
            challenge: "Vulnerable to drifting into feeling like platonic roommates or close business partners.",
            advice: "Introduce physical affection, playful touch, and spontaneous romantic dates to awaken the body vector."
        };
    }
    else if (m >= HIGH && b >= HIGH && h < LOW) {
        state = {
            title: "The Analytical Power Couple",
            badge: "Strategic & Carnal",
            badgeStyle: "bg-amber-500/20 text-amber-400 border-amber-500/40",
            borderStyle: "border-l-amber-400",
            description: "High intellectual alignment paired with strong physical attraction, but guarded or emotionally detached.",
            strength: "Highly efficient life unit with electrifying physical chemistry and strategic execution.",
            challenge: "Lack of deep emotional vulnerability creates vulnerability during unexpected personal crises.",
            advice: "Practice active emotional sharing and lowering defenses without fearing loss of control."
        };
    }
    else if (h >= HIGH && b >= HIGH && m < LOW) {
        state = {
            title: "The Passionate Star-Crossed Lovers",
            badge: "Volatile Romance",
            badgeStyle: "bg-rose-500/20 text-rose-400 border-rose-500/40",
            borderStyle: "border-l-rose-400",
            description: "Intense emotional longing and magnetic physical attraction, but frequent friction over logic, practical life goals, or core values.",
            strength: "High romantic intensity and electrifying chemistry.",
            challenge: "Misalignments in practical values create explosive friction and repeated misunderstandings.",
            advice: "Establish clear ground rules for conflict resolution and build shared intellectual projects."
        };
    }
    else if (m >= HIGH && h < LOW && b < LOW) {
        state = {
            title: "Pure Intellectual Complicity (Liking)",
            badge: "Mental Alignment",
            badgeStyle: "bg-blue-500/20 text-blue-400 border-blue-500/40",
            borderStyle: "border-l-blue-400",
            description: "Great mental stimulation and conversation, but feels more like professional or academic collaboration.",
            strength: "Stimulating conversations, mental clarity, and mutual respect.",
            challenge: "Deficit in emotional warmth and physical magnetism.",
            advice: "Explore deeper vulnerability and shared emotional experiences to see if a heart bond can ignite."
        };
    }
    else if (h >= HIGH && m < LOW && b < LOW) {
        state = {
            title: "Pure Emotional Attachment (Empty Attachment)",
            badge: "Empathetic Bond",
            badgeStyle: "bg-pink-500/20 text-pink-400 border-pink-500/40",
            borderStyle: "border-l-pink-400",
            description: "Deep affection and caring for each other, but lacking both dynamic physical spark and intellectual alignment.",
            strength: "Genuine empathy, loyalty, and caring nature.",
            challenge: "Can become co-dependent or stagnant over time.",
            advice: "Engage in shared intellectual hobbies and exciting physical activities together."
        };
    }
    else if (b >= HIGH && m < LOW && h < LOW) {
        state = {
            title: "Pure Infatuation / Carnal Attraction",
            badge: "Physical Spark",
            badgeStyle: "bg-lime-500/20 text-lime-400 border-lime-500/40",
            borderStyle: "border-l-lime-400",
            description: "Intense physical pull with minimal emotional depth or long-term intellectual connection.",
            strength: "High immediate physical chemistry and passion.",
            challenge: "Burns out quickly once novelty fades unless deeper roots develop.",
            advice: "Spend quality time outside physical settings to discover shared values and intellectual resonance."
        };
    }
    else if (m < 30 && h < 30 && b < 30) {
        state = {
            title: "Dormant / Unengaged System",
            badge: "Inactive Connection",
            badgeStyle: "bg-slate-500/20 text-slate-400 border-slate-500/40",
            borderStyle: "border-l-slate-500",
            description: "Minimal traction across all vectors. The connection is either in its infancy or requires significant intentional spark.",
            strength: "A clean slate with zero false expectations.",
            challenge: "Lack of initial momentum or natural pull.",
            advice: "Identify if there is genuine motivation from both sides to build connection intentionally."
        };
    }
    else {
        state = {
            title: "Evolving / Moderate Synergy",
            badge: "Developing Dynamic",
            badgeStyle: "bg-purple-500/20 text-purple-400 border-purple-500/40",
            borderStyle: "border-l-purple-400",
            description: "A balanced but moderate dynamic with potential to grow into any vector depending on focus.",
            strength: "Adaptable foundation with balanced potential.",
            challenge: "May lack a strong defining anchor or passion point.",
            advice: "Pick one area (intellect, heart, or body) to intentionally deepen together this month."
        };
    }

    // Update DOM Elements
    stateTitle.textContent = state.title;
    stateDescription.textContent = state.description;
    strengthText.textContent = state.strength;
    challengeText.textContent = state.challenge;
    adviceText.textContent = state.advice;

    badgeContainer.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${state.badgeStyle}`;
    badgeContainer.textContent = state.badge;

    statusCard.className = `glass-card glass-card-glow rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 smooth-transition border-l-4 ${state.borderStyle}`;
}

function copySnapshot() {
    const activeProf = activePerson === 'A' ? profileA : profileB;
    const summaryText =
        `=========================================
THE COMPATIBILITY MATRIX - RELATIONSHIP SNAPSHOT
=========================================
State Archetype: ${stateTitle.textContent}
Badge: [${badgeContainer.textContent}]

VECTORS:
🧠 Mind (Intellect):  ${activeProf.m}%
🫀 Heart (Emotion):   ${activeProf.h}%
🍆 Body (Physical):   ${activeProf.b}%

METRICS FORECAST:
🏔️ Long-Term Viability: ${gaugeViabilityVal.textContent}
⚡ Volatility Index:   ${gaugeVolatilityVal.textContent}
💬 Communication Flow: ${gaugeCommVal.textContent}
🔥 Spontaneity / Spark:${gaugeSparkVal.textContent}

KEY STRENGTH: ${strengthText.textContent}
SYSTEM VULNERABILITY: ${challengeText.textContent}
ACTIONABLE TIP: ${adviceText.textContent}
=========================================
Generated via The Compatibility Matrix Engine`;

    // Standard fallback execCommand copy
    const textarea = document.createElement('textarea');
    textarea.value = summaryText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    showToast("Matrix Report copied to clipboard!");
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    toastMsg.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}

[mindInput, heartInput, bodyInput].forEach(slider => {
    slider.addEventListener('input', () => {
        dismissDragHint();
        updateMatrix();
        saveState();
    });
});

// Initialize App on Window Load
window.onload = function () {
    loadSavedState();
    initPresetsUI();
    setMode(currentMode);
};