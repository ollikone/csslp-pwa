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

// --- NEW: SAVE/LOAD LOGIC ---
function saveProgress() {
    // We save the red/green stats mapped to the card question (unique ID)
    const stats = masterCards.map(c => ({ q: c.question, r: c.red, g: c.green }));
    localStorage.setItem('csslp_stats', JSON.stringify(stats));
}

function applySavedProgress(data) {
    const saved = localStorage.getItem('csslp_stats');
    if (!saved) return data;
    
    const statsMap = JSON.parse(saved);
    return data.map(card => {
        const found = statsMap.find(s => s.q === card.question);
        return found ? { ...card, red: found.r, green: found.g } : { ...card, red: 0, green: 0 };
    });
}
// ----------------------------

async function loadCards() { 
    try {
        const res = await fetch('flashcards.json'); 
        let data = await res.json();
        
        // Load stats from local storage and apply them to the cards
        masterCards = applySavedProgress(data);
        cards = [...masterCards]; 
        render(); 
    } catch (e) { console.error(e); }
}

function render() { 
    if (cards.length === 0) return;
    const current = cards[idx];
    front.innerText = current.question; 
    back.innerText = current.answer; 
    card.classList.remove('flipped'); 
    
    redDisplay.innerText = current.red;
    greenDisplay.innerText = current.green;
    
    const seqClass = !shuffled ? "mode-active" : "mode-inactive";
    const shufClass = shuffled ? "mode-active" : "mode-inactive";
    shuffleBtn.innerHTML = `<span class="${seqClass}">Sequential</span> / <span class="${shufClass}">Shuffled</span>`;
}

// WEIGHTED SHUFFLE
function getWeightedRandomCard() {
    let weightedList = [];
    cards.forEach((c, i) => {
        // Calculation: (Red + 1) / (Green + 1)
        // If Red is high, weight is high. If Green is high, weight is low.
        const weight = Math.ceil(Math.max(1, (c.red + 1) / (c.green + 1)) * 5);
        for (let s = 0; s < weight; s++) { weightedList.push(i); }
    });
    return weightedList[Math.floor(Math.random() * weightedList.length)];
}

// Update functions now trigger a Save
const addRed = () => { 
    cards[idx].red++; 
    saveProgress(); 
    render(); 
    setTimeout(next, 300); // Slight delay so you see the number change
};

const addGreen = () => { 
    cards[idx].green++; 
    saveProgress(); 
    render(); 
    setTimeout(next, 300); 
};

document.getElementById('resetBtn').onclick = () => {
    cards[idx].red = 0;
    cards[idx].green = 0;
    saveProgress();
    render();
};

shuffleBtn.onclick = () => { 
    shuffled = !shuffled;
    if (!shuffled) cards = [...masterCards];
    render(); 
};

const next = () => { 
    if (shuffled) {
        idx = getWeightedRandomCard();
    } else {
        idx = (idx + 1) % cards.length;
    }
    render(); 
};

const prev = () => { idx = (idx - 1 + cards.length) % cards.length; render(); };

// Bindings
document.getElementById('prevBtn').onclick = prev;
document.getElementById('nextBtn').onclick = next;
card.onclick = () => { card.classList.toggle('flipped'); };
redDisplay.onclick = (e) => { e.stopPropagation(); addRed(); };
greenDisplay.onclick = (e) => { e.stopPropagation(); addGreen(); };

// Swipe logic
let startX = 0;
card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
card.addEventListener('touchend', e => { 
    let endX = e.changedTouches[0].clientX; 
    const diff = endX - startX;
    if (diff > 60) addGreen();  
    if (diff < -60) addRed();   
}, {passive: true});

loadCards();
