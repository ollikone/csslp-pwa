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
    } catch (e) {
        console.error("Error loading flashcards:", e);
    }
}

function render() { 
    if (cards.length === 0) return;
    front.innerText = cards[idx].question; 
    back.innerText = cards[idx].answer; 
    card.classList.remove('flipped'); 
    
    // Update Button Text
    shuffleBtn.innerText = shuffled ? "Sequential" : "Shuffle";
    
    // Update Visibility/Color via Class
    if (shuffled) {
        shuffleBtn.classList.add('active-shuffle');
    } else {
        shuffleBtn.classList.remove('active-shuffle');
    }
}

// Dark Mode Toggle Fix
modeBtn.onclick = () => { 
    document.body.classList.toggle('dark'); 
};

shuffleBtn.onclick = () => { 
    const currentCard = cards[idx];
    shuffled = !shuffled; 

    if (shuffled) {
        // Fisher-Yates Shuffle
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    } else {
        cards = [...masterCards];
    }

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

// Touch Gestures
let startX = 0;
card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
card.addEventListener('touchend', e => { 
    let endX = e.changedTouches[0].clientX; 
    if (endX - startX > 50) { 
        idx = (idx - 1 + cards.length) % cards.length; 
        render(); 
    } 
    if (startX - endX > 50) { 
        idx = (idx + 1) % cards.length; 
        render(); 
    } 
});

loadCards();
