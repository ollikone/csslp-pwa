let masterCards = []; // Original sequential list
let cards = [];       // Working list (shuffled or original)
let idx = 0;
let shuffled = false;

const card = document.getElementById('card');
const front = document.getElementById('card-front');
const back = document.getElementById('card-back');
const shuffleBtn = document.getElementById('shuffleBtn');

async function loadCards() { 
    try {
        // Ensure this matches your actual .json filename
        const res = await fetch('flashcards.json'); 
        masterCards = await res.json(); 
        cards = [...masterCards]; 
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
    
    // Toggle button text based on state
    shuffleBtn.innerText = shuffled ? "Sequential" : "Shuffle";
}

document.getElementById('modeBtn').onclick = () => { 
    document.body.classList.toggle('dark'); 
};

shuffleBtn.onclick = () => { 
    const currentCard = cards[idx]; // Remember current card
    shuffled = !shuffled; 

    if (shuffled) {
        // Fisher-Yates Shuffle Algorithm
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    } else {
        // Restore original order from master list
        cards = [...masterCards];
    }

    // Find the new index of the card you were looking at
    idx = cards.findIndex(c => c.question === currentCard.question);
    if (idx === -1) idx = 0;

    render(); 
};

document.getElementById('prevBtn').onclick = () => { 
    idx = (idx - 1 + cards.length) % cards.length; 
    render(); 
};

document.getElementById('nextBtn').onclick = () => { 
    idx = (idx + 1) % cards.length; 
    render(); 
};

card.onclick = () => { 
    card.classList.toggle('flipped'); 
};

// Touch Gestures for iPhone
let startX = 0;
card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
card.addEventListener('touchend', e => { 
    let endX = e.changedTouches[0].clientX; 
    if (endX - startX > 50) { // Swipe Right
        idx = (idx - 1 + cards.length) % cards.length; 
        render(); 
    } 
    if (startX - endX > 50) { // Swipe Left
        idx = (idx + 1) % cards.length; 
        render(); 
    } 
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

loadCards();
