let masterCards = []; 
let cards = [];       
let idx = 0;
let shuffled = false;

const card = document.getElementById('card');
const front = document.getElementById('card-front');
const back = document.getElementById('card-back');
const shuffleBtn = document.getElementById('shuffleBtn');
const redDisplay = document.getElementById('count-red');
const greenDisplay = document.getElementById('count-green');
const fileInput = document.getElementById('fileInput');
const progressBar = document.getElementById('progress-bar');
const statsText = document.getElementById('stats-text');

const STORAGE_KEY = 'csslp_flashcard_stats';

// --- SAVE / LOAD / STATS ---
function saveProgress() {
    const stats = masterCards.map(c => ({ q: c.question, r: c.red || 0, g: c.green || 0 }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    updateStats();
}

function updateStats() {
    // A card is "Mastered" if Green > Red AND Green is at least 1
    const mastered = masterCards.filter(c => c.green > c.red).length;
    const total = masterCards.length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    
    progressBar.style.width = `${percent}%`;
    statsText.innerText = `Mastery: ${percent}% (${mastered}/${total} cards mastered)`;
}

function applyStatsToData(rawData, statsArray) {
    return rawData.map(c => {
        const found = statsArray.find(s => s.q === c.question);
        return found ? { ...c, red: found.r, green: found.g } : { ...c, red: 0, green: 0 };
    });
}

async function loadCards() { 
    try {
        const res = await fetch('flashcards.json'); 
        const rawData = await res.json();
        const saved = localStorage.getItem(STORAGE_KEY);
        masterCards = saved ? applyStatsToData(rawData, JSON.parse(saved)) : rawData.map(c => ({...c, red:0, green:0}));
        cards = [...masterCards]; 
        updateStats();
        render(); 
    } catch (e) { console.error(e); }
}

// Export/Import (Same as before)
document.getElementById('exportBtn').onclick = () => {
    const dataStr = localStorage.getItem(STORAGE_KEY) || "[]";
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `csslp_progress_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
};

document.getElementById('importBtn').onclick = () => fileInput.click();
fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            localStorage.setItem(STORAGE_KEY, event.target.result);
            location.reload();
        } catch (err) { alert("Invalid file"); }
    };
    reader.readAsText(file);
};

// --- RENDER & LOGIC ---
function render() { 
    if (cards.length === 0) return;
    const current = cards[idx];
    front.innerText = current.question; 
    back.innerText = current.answer; 
    card.classList.remove('flipped'); 
    redDisplay.innerText = current.red;
    greenDisplay.innerText = current.green;
    shuffleBtn.innerHTML = shuffled ? "<b>Shuffled</b>" : "Sequential";
}

function getWeightedIndex() {
    let pool = [];
    masterCards.forEach((c, i) => {
        const weight = Math.ceil(((c.red + 1) / (c.green + 1)) * 5);
        for (let s = 0; s < weight; s++) pool.push(i);
    });
    return pool[Math.floor(Math.random() * pool.length)];
}

const next = () => { 
    idx = shuffled ? getWeightedIndex() : (idx + 1) % cards.length;
    render(); 
};

const handleVote = (isRed) => {
    const target = cards[idx];
    isRed ? target.red++ : target.green++;
    saveProgress();
    render();
    setTimeout(next, 250);
};

// --- BINDINGS ---
document.getElementById('modeBtn').onclick = () => document.body.classList.toggle('dark');
shuffleBtn.onclick = () => { shuffled = !shuffled; render(); };
document.getElementById('resetBtn').onclick = () => {
    cards[idx].red = 0; cards[idx].green = 0;
    saveProgress(); render();
};
document.getElementById('prevBtn').onclick = () => { idx = (idx - 1 + cards.length) % cards.length; render(); };
document.getElementById('nextBtn').onclick = next;
card.onclick = () => card.classList.toggle('flipped');
redDisplay.onclick = (e) => { e.stopPropagation(); handleVote(true); };
greenDisplay.onclick = (e) => { e.stopPropagation(); handleVote(false); };

let startX = 0;
card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
card.addEventListener('touchend', e => { 
    let diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 60) handleVote(diff < 0);
}, {passive: true});

loadCards();
