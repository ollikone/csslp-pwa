let masterCards = []; 
let cards = [];       
let idx = 0;
let shuffled = false;

const card = document.getElementById('card');
const front = document.getElementById('card-front');
const back = document.getElementById('card-back');
const shuffleBtn = document.getElementById('shuffleBtn');
const modeBtn = document.getElementById('modeBtn');

async function loadCards() { 
    try {
        const res = await fetch('flashcards.json'); 
        masterCards = await res.json(); 
        cards = [...masterCards]; 
        render(); 
    } catch (e) { console.error(e); }
}

function render() { 
    if (cards.length === 0) return;
    front.innerText = cards[idx].question; 
    back.innerText = cards[idx].answer; 
    card.classList.remove('flipped'); 
    
    // Update button text with bold active state
    const seqClass = !shuffled ? "mode-active" : "mode-inactive";
    const shufClass = shuffled ? "mode-active" : "mode-inactive";
    shuffleBtn.innerHTML = `<span class="${seqClass}">Sequential</span> / <span class="${shufClass}">Shuffled</span>`;
}

modeBtn.onclick = () => { document.body.classList.toggle('dark'); };

shuffleBtn.onclick = () => { 
    const currentCard = cards[idx];
    shuffled = !shuffled; 

    if (shuffled) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    } else {
        cards = [...masterCards];
    }

    idx = cards.findIndex(c => c.question === currentCard.question);
    render(); 
};

// Nav logic
const next = () => { idx = (idx + 1) % cards.length; render(); };
const prev = () => { idx = (idx - 1 + cards.length) % cards.length; render(); };

document.getElementById('prevBtn').onclick = prev;
document.getElementById('nextBtn').onclick = next;
card.onclick = () => { card.classList.toggle('flipped'); };

// Gesture Control
let startX = 0;
card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
card.addEventListener('touchend', e => { 
    let endX = e.changedTouches[0].clientX; 
    if (endX - startX > 50) prev(); 
    if (startX - endX > 50) next(); 
}, {passive: true});

loadCards();
