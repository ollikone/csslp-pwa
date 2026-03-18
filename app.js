let masterCards = []; 
let cards = [];       
let idx = 0;
let shuffled = false;

const card = document.getElementById('card');
const front = document.getElementById('card-front');
const back = document.getElementById('card-back');
const shuffleBtn = document.getElementById('shuffleBtn');
const modeBtn = document.getElementById('modeBtn');
const redDisplay = document.getElementById('count-red');
const greenDisplay = document.getElementById('count-green');

// --- PROGRESS PERSISTENCE ---
function saveProgress() {
    const stats = masterCards.map(c => ({ q: c.question, r: c.red || 0, g: c.green || 0 }));
    localStorage.setItem('csslp_flashcard_stats', JSON.stringify(stats));
}

function loadProgress(data) {
    const saved = localStorage.getItem('csslp_flashcard_stats');
    if (!saved) return data.map(c => ({ ...c, red: 0, green: 0 }));
    
    const statsMap = JSON.parse(saved);
    return data.map(c => {
        const found = statsMap.find(s => s.q === c.question);
        return found ? { ...c, red: found.r, green: found.g } : { ...c, red: 0, green: 0 };
    });
}

// --- CORE LOGIC ---
async function loadCards() { 
    try {
        const res = await fetch('flashcards.json'); 
        const rawData = await res.json();
        masterCards = loadProgress(rawData);
        cards = [...masterCards]; 
        render(); 
    } catch (e) { console.error("Failed to load cards:", e); }
}

function render() { 
    if (cards.length === 0) return;
    const current = cards[idx];
    front.innerText = current.question; 
    back.innerText = current.answer; 
    card.classList.remove('flipped'); 
    
    // Update Counter UI
    redDisplay.innerText = current.red;
    greenDisplay.innerText = current.green;
    
    const seqClass = !shuffled ? "mode-active" : "mode-inactive";
    const shufClass = shuffled ? "mode-active" : "mode-inactive";
    shuffleBtn.innerHTML = `<span class="${seqClass}">Sequential</span> / <span class="${shufClass}">Shuffled</span>`;
}

// WEIGHTED RANDOM: Cards with higher red/green ratio appear more often
function getWeightedIndex() {
    let pool = [];
    masterCards.forEach((c, i) => {
        // Calculation: (Red + 1) / (Green + 1). 
        // We multiply by 5 to create enough "slots" in the random pool.
        const weight = Math.ceil(((c.red + 1) / (c.green + 1)) * 5);
        for (let s = 0; s < weight; s++) pool.push(i);
    });
    return pool[Math.floor(Math.random() * pool.length)];
}

const next = () => { 
    if (shuffled) {
        idx = getWeightedIndex();
    } else {
        idx = (idx + 1) % cards.length;
    }
    render(); 
};

const prev = () => { 
    idx = (idx - 1 + cards.length) % cards.length; 
    render(); 
};

// --- ACTIONS ---
const handleSwipeLeft = () => { // Wrong / Hard
    cards[idx].red++;
    saveProgress();
    render();
    setTimeout(next, 200); 
};

const handleSwipeRight = () => { // Correct / Easy
    cards[idx].green++;
    saveProgress();
    render();
    setTimeout(next, 200);
};

// --- EVENT LISTENERS ---
modeBtn.onclick = () => { document.body.classList.toggle('dark'); };

shuffleBtn.onclick = () => { 
    shuffled = !shuffled;
    if (!shuffled) cards = [...masterCards]; 
    render(); 
};

document.getElementById('resetBtn').onclick = () => {
    cards[idx].red = 0;
    cards[idx].green = 0;
    saveProgress();
    render();
};

document.getElementById('prevBtn').onclick = prev;
document.getElementById('nextBtn').onclick = next;
card.onclick = () => { card.classList.toggle('flipped'); };

// Clicking counters triggers swipe logic (Mouse support)
redDisplay.onclick = (e) => { e.stopPropagation(); handleSwipeLeft(); };
greenDisplay.onclick = (e) => { e.stopPropagation(); handleSwipeRight(); };

// Gesture Control
let startX = 0;
card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
card.addEventListener('touchend', e => { 
    let endX = e.changedTouches[0].clientX; 
    const diff = endX - startX;
    if (diff > 60) handleSwipeRight();
    if (diff < -60) handleSwipeLeft();
}, {passive: true});

loadCards();
