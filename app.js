let masterCards = []; 
let cards = [];       
let idx = 0;
let shuffled = false;

const card = document.getElementById('card');
const front = document.getElementById('card-front');
const back = document.getElementById('card-back');
const shuffleBtn = document.getElementById('shuffleBtn');

async function loadCards() { 
    try {
        const res = await fetch('flashcards.json'); 
        masterCards = await res.json(); 
        cards = [...masterCards]; // Start with a copy of the master list
        render(); 
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

function render() { 
    if (cards.length === 0) return;
    front.innerText = cards[idx].question; 
    back.innerText = cards[idx].answer; 
    card.classList.remove('flipped'); 
    
    // UI Feedback for Shuffle button
    shuffleBtn.innerText = shuffled ? "Sequential" : "Shuffle";
    shuffleBtn.style.color = shuffled ? "#00ff00" : ""; 
}

shuffleBtn.onclick = () => { 
    const currentCard = cards[idx];
    shuffled = !shuffled; 

    if (shuffled) {
        // Shuffle using Fisher-Yates for better randomization
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    } else {
        // Restore to original master list order
        cards = [...masterCards];
    }

    // Find our new index in the new list so we don't jump to a different card
    idx = cards.findIndex(c => c.question === currentCard.question);
    render(); 
};

// Navigation logic
document.getElementById('prevBtn').onclick = () => { idx = (idx - 1 + cards.length) % cards.length; render(); };
document.getElementById('nextBtn').onclick = () => { idx = (idx + 1) % cards.length; render(); };
card.onclick = () => { card.classList.toggle('flipped'); };

// Swipe Logic for iPhone
let startX = 0;
card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
card.addEventListener('touchend', e => { 
    let endX = e.changedTouches[0].clientX; 
    if (endX - startX > 50) { idx = (idx - 1 + cards.length) % cards.length; render(); } 
    if (startX - endX > 50) { idx = (idx + 1) % cards.length; render(); } 
});

loadCards();
