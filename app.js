let masterCards = []; 
let history = [];     // Tracks indices of cards seen
let hIdx = -1;        // Current position in history
let shuffled = false;

const card = document.getElementById('card');
const front = document.getElementById('card-front');
const back = document.getElementById('card-back');
const shuffleBtn = document.getElementById('shuffleBtn');
const redDisplay = document.getElementById('count-red');
const greenDisplay = document.getElementById('count-green');
const progressBar = document.getElementById('progress-bar');
const statsText = document.getElementById('stats-text');
const fileInput = document.getElementById('fileInput');

const STORAGE_KEY = 'csslp_flash_v1';

async function loadCards() { 
    try {
        const res = await fetch('flashcards.json'); 
        const rawData = await res.json();
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        
        masterCards = rawData.map(c => {
            const s = saved.find(item => item.q === c.question);
            return { ...c, red: s ? s.r : 0, green: s ? s.g : 0 };
        });
        
        // Initialize History
        history = [0];
        hIdx = 0;
        
        updateStats();
        render(); 
    } catch (e) { console.error("Error loading cards:", e); }
}

function render() { 
    if (masterCards.length === 0) return;
    const currentIdx = history[hIdx];
    const current = masterCards[currentIdx];
    
    front.innerText = current.question; 
    back.innerText = current.answer; 
    card.classList.remove('flipped'); 
    
    redDisplay.innerText = current.red;
    greenDisplay.innerText = current.green;
    
    // Toggle Text Clarity
    const s1 = !shuffled ? "active-mode" : "inactive-mode";
    const s2 = shuffled ? "active-mode" : "inactive-mode";
    shuffleBtn.innerHTML = `<span class="${s1}">Seq</span> | <span class="${s2}">Shuffle</span>`;
}

// --- NAVIGATION LOGIC (The History Stack) ---

const next = () => { 
    if (hIdx < history.length - 1) {
        // Move forward in existing history
        hIdx++;
    } else {
        // Generate a new step
        let nextCardIdx;
        if (shuffled) {
            nextCardIdx = getWeightedIndex();
        } else {
            nextCardIdx = (history[hIdx] + 1) % masterCards.length;
        }
        history.push(nextCardIdx);
        hIdx++;
    }
    render(); 
};

const prev = () => { 
    if (hIdx > 0) {
        hIdx--;
        render();
    }
};

function getWeightedIndex() {
    let pool = [];
    masterCards.forEach((c, i) => {
        // Higher red-to-green ratio = more slots in the random pool
        const weight = Math.ceil(((c.red + 1) / (c.green + 1)) * 5);
        for (let s = 0; s < weight; s++) pool.push(i);
    });
    return pool[Math.floor(Math.random() * pool.length)];
}

// --- SCORE LOGIC ---

const handleVote = (isRed) => {
    const currentIdx = history[hIdx];
    const target = masterCards[currentIdx];
    isRed ? target.red++ : target.green++;
    saveProgress();
    render();
    // After voting, we wait a moment and move to the NEXT card
    setTimeout(next, 250);
};

function saveProgress() {
    const stats = masterCards.map(c => ({ q: c.question, r: c.red, g: c.green }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    updateStats();
}

function updateStats() {
    const mastered = masterCards.filter(c => c.green > c.red).length;
    const total = masterCards.length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    progressBar.style.width = `${percent}%`;
    statsText.innerText = `Mastery: ${percent}% (${mastered}/${total} cards)`;
}

// --- EVENT BINDINGS ---

document.getElementById('modeBtn').onclick = () => document.body.classList.toggle('dark');

shuffleBtn.onclick = () => { 
    shuffled = !shuffled; 
    // When switching modes, we clear the 'forward' history to start a new path
    if (hIdx < history.length - 1) {
        history = history.slice(0, hIdx + 1);
    }
    render(); 
};

document.getElementById('resetBtn').onclick = () => {
    const target = masterCards[history[hIdx]];
    target.red = 0; target.green = 0;
    saveProgress(); render();
};

document.getElementById('clearAllBtn').onclick = () => {
    if(confirm("Clear all mastery progress?")) {
        masterCards.forEach(c => { c.red = 0; c.green = 0; });
        saveProgress(); render();
    }
};

document.getElementById('prevBtn').onclick = prev;
document.getElementById('nextBtn').onclick = next;
card.onclick = () => card.classList.toggle('flipped');

redDisplay.onclick = (e) => { e.stopPropagation(); handleVote(true); };
greenDisplay.onclick = (e) => { e.stopPropagation(); handleVote(false); };

// Swipe Logic
let startX = 0;
card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
card.addEventListener('touchend', e => { 
    let diff = e.changedTouches[0].clientX - startX;
    if (diff > 60) handleVote(false); // Right = Green
    if (diff < -60) handleVote(true); // Left = Red
}, {passive: true});

// File I/O
document.getElementById('exportBtn').onclick = () => {
    const blob = new Blob([localStorage.getItem(STORAGE_KEY)], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `csslp_study_data.json`;
    link.click();
};
document.getElementById('importBtn').onclick = () => fileInput.click();
fileInput.onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => { localStorage.setItem(STORAGE_KEY, ev.target.result); location.reload(); };
    reader.readAsText(e.target.files[0]);
};

loadCards();
