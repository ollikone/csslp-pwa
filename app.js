
let cards = [];
let idx = 0;
let shuffled = false;
const card = document.getElementById('card');
const front = document.getElementById('card-front');
const back = document.getElementById('card-back');

async function loadCards() { 
    try {
        const res = await fetch('flashcards.json'); 
        cards = await res.json(); 
        render(); 
    } catch (e) {
        console.error("Error loading flashcards:", e);
    }
}

function render() { 
    if (cards.length === 0) return;
    front.innerText = cards[idx].question; 
    back.innerText = cards[idx].answer; 
    card.classList.remove('flipped'); 
}

document.getElementById('modeBtn').onclick = () => { document.body.classList.toggle('dark'); };

document.getElementById('shuffleBtn').onclick = () => { 
    shuffled = !shuffled; 
    if (shuffled) {
        cards.sort(() => Math.random() - 0.5);
    } else {
        // Re-fetching or reloading logic to reset order could go here if desired
    }
    idx = 0; 
    render(); 
};

document.getElementById('prevBtn').onclick = () => { idx = (idx - 1 + cards.length) % cards.length; render(); };
document.getElementById('nextBtn').onclick = () => { idx = (idx + 1) % cards.length; render(); };
card.onclick = () => { card.classList.toggle('flipped'); };

let startX = 0;
card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
card.addEventListener('touchend', e => { 
    let endX = e.changedTouches[0].clientX; 
    if (endX - startX > 50) { idx = (idx - 1 + cards.length) % cards.length; render(); } 
    if (startX - endX > 50) { idx = (idx + 1) % cards.length; render(); } 
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => console.log('SW reg error:', err));
}

loadCards();
